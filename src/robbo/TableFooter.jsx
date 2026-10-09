/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * DataTable footer whose pagination labels are translated: Paragon's TablePagination and
 * TablePaginationMinimal leave Pagination's English buttonLabels ("Previous", "Page", "of").
 */
import React, { useContext } from 'react';
import { DataTable, DataTableContext, Pagination } from '@openedx/paragon';
import { ArrowBackIos, ArrowForwardIos } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const PAGINATION_LABEL_ID = 'pgn.DataTable.paginationLabel';

const TablePagination = () => {
  const intl = useIntl();
  const {
    nextPage, pageCount, gotoPage, state,
  } = useContext(DataTableContext);

  // Same condition as Paragon TablePaginationMinimal: nextPage exists only for paginated tables.
  if (!nextPage) {
    return null;
  }
  return (
    <Pagination
      variant="minimal"
      currentPage={(state?.pageIndex || 0) + 1}
      pageCount={pageCount}
      paginationLabel={intl.formatMessage({ id: PAGINATION_LABEL_ID, defaultMessage: 'table pagination' })}
      onPageSelect={(pageNum) => gotoPage(pageNum - 1)}
      buttonLabels={{
        previous: intl.formatMessage(messages.paginationPrevious),
        next: intl.formatMessage(messages.paginationNext),
        page: intl.formatMessage(messages.paginationPage),
        currentPage: intl.formatMessage(messages.paginationCurrentPage),
        pageOfCount: intl.formatMessage(messages.paginationPageOfCount),
      }}
      icons={{ leftIcon: ArrowBackIos, rightIcon: ArrowForwardIos }}
    />
  );
};

const TableFooter = () => (
  <DataTable.TableFooter>
    <DataTable.RowStatus />
    <TablePagination />
  </DataTable.TableFooter>
);

export default TableFooter;
