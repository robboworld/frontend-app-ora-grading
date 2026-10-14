/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * The pdf.js worker of the PDF preview, served with the app (/ora-grading/…) instead of
 * unpkg.com: no third-party code on the grading page, and it fits its Content-Security-Policy
 * (worker-src 'self'). Webpack emits the file of the installed pdfjs-dist, so it always matches
 * the pdf.js version react-pdf uses. Mocked in tests (jest does not parse import.meta).
 */
export default new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
