/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Russian — src/i18n/robbo-overrides/ru.json.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  previewTruncated: {
    id: 'robbo.ora-grading.FilePreview.previewTruncated',
    defaultMessage: 'Showing the first {size} of the file. Download it to see the whole file.',
    description: 'Above the preview of a long text or code file that is cut',
  },
});

export default messages;
