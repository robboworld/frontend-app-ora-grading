/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import { textParts } from './responseText';

describe('textParts', () => {
  test('plain text responses: keeps text, drops blank parts', () => {
    expect(textParts(['Собрал робота.', '', '   \n'], true)).toEqual(['Собрал робота.']);
  });

  test('rich text responses: an untouched editor is not text', () => {
    expect(textParts(['<p>&nbsp;</p>', '<p></p>', '<p>\u00a0</p>'], false)).toEqual([]);
  });

  test('rich text responses: words or an image are', () => {
    const words = '<h2>Отчёт</h2><p>Мы собрали робота.</p>';
    const image = '<p><img src="../static/images/logo.png" alt="" /></p>';
    expect(textParts([words, image], false)).toEqual([words, image]);
  });

  test('no response text at all', () => {
    expect(textParts([], false)).toEqual([]);
  });
});
