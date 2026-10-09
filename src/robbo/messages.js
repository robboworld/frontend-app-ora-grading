/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Strings that upstream ORA grading and Paragon hardcode in English.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  textFilterPlaceholder: {
    id: 'robbo.ora-grading.TextFilter.placeholder',
    defaultMessage: 'Search {column}',
    description: 'Placeholder and label of the text search over a table column',
  },
  filteredBy: {
    id: 'robbo.ora-grading.FilterStatus.filteredBy',
    defaultMessage: 'Filtered by {columns}',
    description: 'Names of the table columns the submissions are filtered by',
  },
  clearFilters: {
    id: 'robbo.ora-grading.FilterStatus.clearFilters',
    defaultMessage: 'Clear filters',
    description: 'Button that removes all table filters',
  },
  paginationPrevious: {
    id: 'robbo.ora-grading.Pagination.previous',
    defaultMessage: 'Previous',
    description: 'Previous page button of the submissions table',
  },
  paginationNext: {
    id: 'robbo.ora-grading.Pagination.next',
    defaultMessage: 'Next',
    description: 'Next page button of the submissions table',
  },
  paginationPage: {
    id: 'robbo.ora-grading.Pagination.page',
    defaultMessage: 'Page',
    description: 'Screen reader text before a page number ("Page 1")',
  },
  paginationCurrentPage: {
    id: 'robbo.ora-grading.Pagination.currentPage',
    defaultMessage: 'Current Page',
    description: 'Screen reader text marking the selected page',
  },
  paginationPageOfCount: {
    id: 'robbo.ora-grading.Pagination.pageOfCount',
    defaultMessage: 'of',
    description: 'Screen reader text between the page number and the page count ("1 of 3")',
  },
  toggleSortBy: {
    id: 'robbo.ora-grading.DataTable.toggleSortBy',
    defaultMessage: 'Sort',
    description: 'Tooltip of a sortable table column header',
  },
  toggleRowSelected: {
    id: 'robbo.ora-grading.DataTable.toggleRowSelected',
    defaultMessage: 'Select response',
    description: 'Tooltip of the row selection checkbox',
  },
  toggleAllPageRowsSelected: {
    id: 'robbo.ora-grading.DataTable.toggleAllPageRowsSelected',
    defaultMessage: 'Select all responses on this page',
    description: 'Tooltip of the "select all" checkbox in the table header',
  },
  reviewModalClose: {
    id: 'robbo.ora-grading.ReviewModal.close',
    defaultMessage: 'Close',
    description: 'Label of the close button of the grading window',
  },
  pdfPage: {
    id: 'robbo.ora-grading.PDFRenderer.page',
    defaultMessage: 'Page',
    description: 'Label before the page number input of the PDF preview',
  },
  pdfPageOf: {
    id: 'robbo.ora-grading.PDFRenderer.pageOf',
    defaultMessage: 'of {numPages}',
    description: 'Total page count after the page number input of the PDF preview',
  },
  pdfPrevious: {
    id: 'robbo.ora-grading.PDFRenderer.previous',
    defaultMessage: 'Previous PDF page',
    description: 'Previous page button of the PDF preview',
  },
  pdfNext: {
    id: 'robbo.ora-grading.PDFRenderer.next',
    defaultMessage: 'Next PDF page',
    description: 'Next page button of the PDF preview',
  },
});

export default messages;
