// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
const crypto = require('crypto');
const path = require('path');
const { Compilation, sources } = require('webpack');
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-prod');

config.resolve.modules = [
  path.resolve(__dirname, './src'),
  'node_modules',
];

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

/**
 * Robbo: index.html without inline scripts, so the grading page runs under a Content-Security-Policy
 * with `script-src 'self'` (tutor-plugin-robbo-mfe-branding, ROBBO_ORA_GRADING_CSP). frontend-build
 * inlines `var PARAGON_THEME = …` (and the New Relic agent unless ENABLE_NEW_RELIC=false); each
 * inline script becomes a file named by its content hash, loaded by a plain <script src> at the same
 * place, so it still runs before the deferred app bundles.
 */
class ExternalInlineScriptsPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('RobboExternalInlineScripts', (compilation) => {
      compilation.hooks.processAssets.tap(
        // Last stage. A file emitted here re-runs Paragon's handler (ADDITIONS, additionalAssets),
        // which inlines PARAGON_THEME again; with additionalAssets this one runs after it again.
        { name: 'RobboExternalInlineScripts', stage: Compilation.PROCESS_ASSETS_STAGE_REPORT, additionalAssets: true },
        () => {
          const html = compilation.getAsset('index.html');
          if (!html) {
            return;
          }
          const publicPath = compilation.outputOptions.publicPath || '/';
          const original = html.source.source().toString();
          const inlineScript = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
          const loaded = new Set();
          const source = original.replace(inlineScript, (tag, attributes, code) => {
            if (!code.trim()) {
              return tag;
            }
            const hash = crypto.createHash('sha256').update(code).digest('hex').slice(0, 20);
            const src = `${publicPath}robbo-inline.${hash}.js`;
            if (!compilation.getAsset(`robbo-inline.${hash}.js`)) {
              compilation.emitAsset(`robbo-inline.${hash}.js`, new sources.RawSource(code));
            }
            if (loaded.has(src) || original.includes(`src="${src}"`)) {
              return ''; // the same script is already loaded
            }
            loaded.add(src);
            const type = attributes.replace(/\s*type="text\/javascript"/, '');
            return `<script${type} src="${src}"></script>`;
          });
          if (source !== original) {
            compilation.updateAsset('index.html', new sources.RawSource(source));
          }
        },
      );
    });
  }
}

config.plugins.push(new ExternalInlineScriptsPlugin());

module.exports = config;
