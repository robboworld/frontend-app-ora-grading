/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * react-table prop getters put English `title` tooltips on the DataTable sort buttons and
 * selection checkboxes ("Toggle SortBy", …), and Paragon DataTable has no way to pass a
 * react-table plugin that would override them. This wrapper translates those titles in place.
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const TITLE_MESSAGES = {
  'Toggle SortBy': messages.toggleSortBy,
  'Toggle Row Selected': messages.toggleRowSelected,
  'Toggle All Current Page Rows Selected': messages.toggleAllPageRowsSelected,
  'Toggle All Rows Selected': messages.toggleAllPageRowsSelected,
};

const TranslatedTitles = ({ className, children }) => {
  const intl = useIntl();
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const translate = () => {
      root.querySelectorAll('[title]').forEach((el) => {
        const message = TITLE_MESSAGES[el.getAttribute('title')];
        if (message) {
          el.setAttribute('title', intl.formatMessage(message));
        }
      });
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(root, { childList: true, subtree: true, attributeFilter: ['title'] });
    return () => observer.disconnect();
  }, [intl]);

  return <div ref={ref} className={className}>{children}</div>;
};

TranslatedTitles.defaultProps = {
  className: undefined,
};

TranslatedTitles.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default TranslatedTitles;
