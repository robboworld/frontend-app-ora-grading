/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * highlight.js with the languages of code answers only. Loaded on demand by CodeRenderer
 * (a separate chunk), so the grading app does not grow for answers without code.
 */
import hljs from 'highlight.js/lib/core';
import arduino from 'highlight.js/lib/languages/arduino';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import lua from 'highlight.js/lib/languages/lua';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

Object.entries({
  arduino,
  bash,
  c,
  cpp,
  csharp,
  css,
  java,
  javascript,
  json,
  lua,
  markdown,
  python,
  sql,
  typescript,
  xml,
  yaml,
}).forEach(([name, language]) => hljs.registerLanguage(name, language));

export default hljs;
