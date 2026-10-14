/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */

const NBSP = /&nbsp;|&#160;|\u00a0/gi;

/**
 * Parts of a response with something to read: plain text that is not blank, or rich text
 * (TinyMCE) with words or an image — the editor saves an untouched field as <p>&nbsp;</p>.
 */
export const textParts = (text, isPlain) => text.filter((part) => {
  if (!part || !part.trim()) {
    return false;
  }
  if (isPlain) {
    return true;
  }
  return /<img\b/i.test(part) || part.replace(/<[^>]*>/g, ' ').replace(NBSP, ' ').trim() !== '';
});

export default textParts;
