/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * HTML of rich text responses (ORA TinyMCE) for the grading pages. DOMPurify defaults already
 * drop scripts and event handlers; on top of that a learner must not restyle or cover the
 * grading page, put forms on it, or learn when and from where the response was opened through
 * images loaded from other sites. What the ORA editor itself produces stays: headings, bold,
 * italic, lists, quotes, code, links, images, and its inline styles (underline, strikethrough,
 * indent) — see sanitize.test.js, made from real TinyMCE output.
 */
import React from 'react';
import createDOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { getConfig } from '@edx/frontend-platform';

import './sanitize.scss';

const purify = createDOMPurify(window);

const FORBID_TAGS = [
  'style', 'link', 'meta', 'base',
  'form', 'input', 'button', 'textarea', 'select', 'option', 'optgroup', 'datalist', 'output',
  'fieldset', 'legend', 'label', 'dialog', 'template',
  'video', 'audio', 'source', 'track', 'picture',
];
const FORBID_ATTR = ['background', 'srcset', 'poster', 'action', 'formaction', 'ping'];

export const EXTERNAL_IMAGE_ATTR = 'data-robbo-external-src';
// Links of a response open in a new tab, without the page address and without page access.
const LINK_REL = 'noopener noreferrer nofollow';

const LENGTH = /^(\d{1,4}(\.\d+)?(px|em|rem|%|pt)?|auto)$/;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.]+%?\s*(,\s*[\d.]+%?\s*){2,3}\)|[a-z]{3,20})$/i;
const KEYWORDS = /^[a-z-]+( [a-z-]+)*$/; // underline, line-through…

/** CSS properties the grading page keeps in a response, with the values they may take. */
export const STYLE_RULES = {
  'text-decoration': KEYWORDS,
  'text-decoration-line': KEYWORDS,
  'text-decoration-style': KEYWORDS,
  'text-decoration-color': COLOR,
  'text-align': /^(left|right|center|justify|start|end)$/,
  'font-weight': /^(normal|bold|bolder|lighter|[1-9]00)$/,
  'font-style': /^(normal|italic|oblique)$/,
  'vertical-align': /^(baseline|sub|super|top|middle|bottom|text-top|text-bottom)$/,
  'padding-left': LENGTH,
  'margin-left': LENGTH,
  'margin-right': LENGTH,
  float: /^(left|right|none)$/,
  display: /^(block|inline|inline-block)$/,
  color: COLOR,
  'background-color': COLOR,
  width: LENGTH,
  height: LENGTH,
  'border-collapse': /^(collapse|separate)$/,
};

/** The declarations of `style` that STYLE_RULES allow, in the same order; '' if none. */
export const filterStyle = (style) => style
  .split(';')
  .map((declaration) => {
    const colon = declaration.indexOf(':');
    if (colon < 0) {
      return null;
    }
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const value = declaration.slice(colon + 1).replace(/!important/i, '').trim();
    const rule = STYLE_RULES[property];
    return rule && rule.test(value) ? `${property}: ${value}` : null;
  })
  .filter(Boolean)
  .join('; ');

const origins = () => {
  const own = [window.location.origin];
  try {
    own.push(new URL(getConfig().LMS_BASE_URL).origin);
  } catch (e) {
    // no LMS URL configured: the page origin only
  }
  return own;
};

/** Images of the platform itself or embedded in the response (data:image/…). */
export const isLocalImage = (src) => {
  if (/^data:image\//i.test(src)) {
    return true;
  }
  try {
    return origins().includes(new URL(src, window.location.href).origin);
  } catch (e) {
    return false;
  }
};

const isWebUrl = (url) => {
  try {
    return ['http:', 'https:'].includes(new URL(url, window.location.href).protocol);
  } catch (e) {
    return false;
  }
};

purify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName === 'style') {
    // eslint-disable-next-line no-param-reassign -- DOMPurify reads the changed hook data
    data.attrValue = filterStyle(data.attrValue);
    if (!data.attrValue) {
      // eslint-disable-next-line no-param-reassign
      data.keepAttr = false;
    }
  }
});

purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src') || '';
    if (src && !isLocalImage(src)) {
      // Not loaded by the grading page: parseResponseHtml shows a link to open it.
      node.removeAttribute('src');
      if (isWebUrl(src)) {
        node.setAttribute(EXTERNAL_IMAGE_ATTR, src);
      }
    }
  }
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', LINK_REL);
  }
});

export const sanitizeResponseHtml = (html) => purify.sanitize(html, {
  USE_PROFILES: { html: true }, // no SVG or MathML
  FORBID_TAGS,
  FORBID_ATTR,
});

/**
 * The response as React nodes. An image from another site becomes a link that opens it in a
 * new tab, `externalImageText(alt, url)` gives its text (default: the alt text or the address).
 */
export const parseResponseHtml = (html, { externalImageText } = {}) => parse(sanitizeResponseHtml(html), {
  replace: (node) => {
    const url = node.type === 'tag' && node.name === 'img' && node.attribs[EXTERNAL_IMAGE_ATTR];
    if (!url) {
      return undefined;
    }
    const { alt } = node.attribs;
    return React.createElement('a', {
      className: 'robbo-external-image',
      href: url,
      target: '_blank',
      rel: LINK_REL,
    }, externalImageText ? externalImageText(alt, url) : (alt || url));
  },
});

export default sanitizeResponseHtml;
