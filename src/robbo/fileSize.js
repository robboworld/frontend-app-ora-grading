/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */

const SIZE_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];

/** «6,6 кБ» in the page language (filesize prints English units). */
export const formatFileSize = (intl, bytes) => {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return intl.formatNumber(value, {
    style: 'unit', unit: SIZE_UNITS[unit], unitDisplay: 'short', maximumFractionDigits: unit ? 1 : 0,
  });
};

export default formatFileSize;
