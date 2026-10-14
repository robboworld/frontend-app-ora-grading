/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Text and code file extensions, with their highlight.js language (null — plain text, lines
 * wrap). Languages are registered in highlighter.js. .txt is here too, instead of the stock
 * TXTRenderer, for the preview size limit of CodeRenderer.
 */
export const CODE_LANGUAGES = {
  py: 'python',
  ino: 'arduino',
  pde: 'arduino',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  java: 'java',
  js: 'javascript',
  mjs: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'xml',
  htm: 'xml',
  xml: 'xml',
  css: 'css',
  json: 'json',
  lua: 'lua',
  md: 'markdown',
  sql: 'sql',
  sh: 'bash',
  yml: 'yaml',
  yaml: 'yaml',
  txt: null,
  csv: null,
  log: null,
};

export const extensionOf = (fileName) => fileName.split('.').pop()?.toLowerCase();

export const languageOf = (fileName) => CODE_LANGUAGES[extensionOf(fileName)] || null;
