/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Previews Robbo adds to the stock ones (images, PDF, .txt): video and program code.
 * Merged into RENDERERS of components/FilePreview/hooks.js — the grading window and
 * «Проверка по учащимся» both use them.
 */
import CodeRenderer from './CodeRenderer';
import VideoRenderer from './VideoRenderer';
import { CODE_LANGUAGES } from './languages';

import './renderers.scss';

export const VIDEO_EXTENSIONS = ['mp4', 'm4v', 'webm', 'mov', 'ogv'];

export const ROBBO_RENDERERS = {
  ...Object.fromEntries(VIDEO_EXTENSIONS.map((extension) => [extension, VideoRenderer])),
  ...Object.fromEntries(Object.keys(CODE_LANGUAGES).map((extension) => [extension, CodeRenderer])),
};
