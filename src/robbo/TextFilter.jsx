/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Paragon TextFilter with a translatable "Search {column}" label (upstream hardcodes English).
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

let filterSeq = 0;

const TextFilter = ({
  column: {
    filterValue, setFilter, Header, getHeaderProps,
  },
}) => {
  const intl = useIntl();
  const controlId = useRef(null);
  if (controlId.current === null) {
    filterSeq += 1;
    controlId.current = `robbo-text-filter-${getHeaderProps().key}-${filterSeq}`;
  }
  const column = typeof Header === 'string' ? Header.toLowerCase() : Header;
  const label = intl.formatMessage(messages.textFilterPlaceholder, { column });
  return (
    <Form.Group controlId={controlId.current}>
      <Form.Label className="sr-only">{label}</Form.Label>
      <Form.Control
        value={filterValue || ''}
        type="text"
        onChange={(e) => setFilter(e.target.value || undefined)}
        placeholder={label}
      />
    </Form.Group>
  );
};

TextFilter.propTypes = {
  column: PropTypes.shape({
    setFilter: PropTypes.func.isRequired,
    Header: PropTypes.string.isRequired,
    getHeaderProps: PropTypes.func.isRequired,
    filterValue: PropTypes.string,
  }).isRequired,
};

export default TextFilter;
