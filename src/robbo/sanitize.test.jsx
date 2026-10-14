/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Ordinary rich text responses must look on the grading pages as the learner wrote them.
 */
import React from 'react';
import { TextEncoder } from 'util';

import {
  EXTERNAL_IMAGE_ATTR, filterStyle, isLocalImage, parseResponseHtml, sanitizeResponseHtml,
} from './sanitize';

// getContent() of the ORA response editor (TinyMCE 5.5.1 with the edx-ora2 toolbar,
// oa_editor_tinymce.js) after its buttons: «Heading 2», bold, italic, underline,
// strikethrough, bulleted and numbered list, indent, blockquote, link, «Preformatted»,
// image by address — from another site and from the platform (TinyMCE made it relative).
const TINYMCE_ANSWER = `<h2>Отчёт о проекте</h2>
<p>Мы собрали робота. Важно: <strong>жирный</strong>, <em>курсив</em>, <span style="text-decoration: underline;">подчёркнутый</span> и <span style="text-decoration: line-through;">зачёркнутый</span> текст.</p>
<ul>
<li>Детали: мотор</li>
<li>Детали: датчик</li>
</ul>
<ol>
<li>Шаг: собрать</li>
<li>Шаг: запрограммировать</li>
</ol>
<p style="padding-left: 40px;">Отступ абзаца</p>
<blockquote>
<p>Цитата учителя</p>
</blockquote>
<p><a href="https://scratch.mit.edu/projects/123456">Ссылка на проект</a></p>
<pre>print("hello")</pre>
<p><img src="https://example.com/robot.png" alt="Фото робота" width="320" height="240" /></p>
<p><img src="../static/images/logo.png" alt="Логотип" width="120" height="40" /></p>`;

// react-dom/server needs TextEncoder, which the jsdom test environment lacks.
global.TextEncoder = global.TextEncoder || TextEncoder;
// eslint-disable-next-line import/order, global-require -- loaded after the polyfill
const { renderToStaticMarkup } = require('react-dom/server');

const toDom = (html) => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};

describe('sanitizeResponseHtml with an ordinary TinyMCE response', () => {
  const dom = toDom(sanitizeResponseHtml(TINYMCE_ANSWER));

  test('keeps the text structure', () => {
    expect(dom.querySelector('h2').textContent).toBe('Отчёт о проекте');
    expect(dom.querySelector('strong').textContent).toBe('жирный');
    expect(dom.querySelector('em').textContent).toBe('курсив');
    expect([...dom.querySelectorAll('ul > li')].map((li) => li.textContent))
      .toEqual(['Детали: мотор', 'Детали: датчик']);
    expect([...dom.querySelectorAll('ol > li')].map((li) => li.textContent))
      .toEqual(['Шаг: собрать', 'Шаг: запрограммировать']);
    expect(dom.querySelector('blockquote p').textContent).toBe('Цитата учителя');
    expect(dom.querySelector('pre').textContent).toBe('print("hello")');
  });

  test('keeps the inline styles of the editor buttons', () => {
    const spans = [...dom.querySelectorAll('span')].map((span) => [span.textContent, span.getAttribute('style')]);
    expect(spans).toEqual([
      ['подчёркнутый', 'text-decoration: underline'],
      ['зачёркнутый', 'text-decoration: line-through'],
    ]);
    expect(dom.querySelector('p[style]').getAttribute('style')).toBe('padding-left: 40px');
  });

  test('opens links in a new tab without the referrer', () => {
    const link = dom.querySelector('a');
    expect(link.getAttribute('href')).toBe('https://scratch.mit.edu/projects/123456');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow');
  });

  test('shows images of the platform', () => {
    const logo = dom.querySelector('img[alt="Логотип"]');
    expect(logo.getAttribute('src')).toBe('../static/images/logo.png');
    expect(logo.getAttribute('width')).toBe('120');
    expect(logo.getAttribute('height')).toBe('40');
  });

  test('does not load images from other sites but keeps their address', () => {
    const photo = dom.querySelector('img[alt="Фото робота"]');
    expect(photo.hasAttribute('src')).toBe(false);
    expect(photo.getAttribute(EXTERNAL_IMAGE_ATTR)).toBe('https://example.com/robot.png');
  });

  test('leaves plain text as it is', () => {
    expect(sanitizeResponseHtml('Просто текст ответа.')).toBe('Просто текст ответа.');
  });
});

describe('parseResponseHtml', () => {
  const render = (options) => renderToStaticMarkup(<div>{parseResponseHtml(TINYMCE_ANSWER, options)}</div>);

  test('shows an image from another site as a link that opens it in a new tab', () => {
    const markup = render({ externalImageText: (alt, url) => `Открыть: ${alt} (${url})` });
    expect(markup).toContain(
      '<a class="robbo-external-image" href="https://example.com/robot.png" target="_blank" '
      + 'rel="noopener noreferrer nofollow">Открыть: Фото робота (https://example.com/robot.png)</a>',
    );
    expect(markup).not.toContain('src="https://example.com');
  });

  test('names the link after the alt text by default', () => {
    expect(render()).toContain('rel="noopener noreferrer nofollow">Фото робота</a>');
  });

  test('renders the rest of the response', () => {
    const markup = render();
    expect(markup).toContain('<strong>жирный</strong>');
    expect(markup).toContain('<span style="text-decoration:underline">подчёркнутый</span>');
    expect(markup).toContain('<span style="text-decoration:line-through">зачёркнутый</span>');
    expect(markup).toContain('<p style="padding-left:40px">Отступ абзаца</p>');
    const logo = toDom(markup).querySelector('img[alt="Логотип"]'); // DOMPurify reorders attributes
    expect(logo.getAttribute('src')).toBe('../static/images/logo.png');
    expect(logo.getAttribute('width')).toBe('120');
  });
});

describe('filterStyle', () => {
  test('keeps what the editor writes', () => {
    expect(filterStyle('text-decoration: underline;')).toBe('text-decoration: underline');
    expect(filterStyle('padding-left: 80px;')).toBe('padding-left: 80px');
    expect(filterStyle('text-align: center; color: #e03e2d;')).toBe('text-align: center; color: #e03e2d');
  });

  test('drops properties outside the list', () => {
    expect(filterStyle('font-family: Arial; font-size: 40px; text-align: right')).toBe('text-align: right');
  });

  test('drops values a property does not take', () => {
    expect(filterStyle('padding-left: 99999px; text-align: middle')).toBe('');
  });
});

describe('isLocalImage', () => {
  test('platform images and images inside the response', () => {
    expect(isLocalImage('../static/images/logo.png')).toBe(true);
    expect(isLocalImage(`${window.location.origin}/static/images/logo.png`)).toBe(true);
    expect(isLocalImage('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
  });

  test('images from other sites', () => {
    expect(isLocalImage('https://example.com/robot.png')).toBe(false);
  });
});
