// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Badge } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { StrictDict } from 'utils';
import { gradingStatuses as statuses } from 'data/services/lms/constants';
import messages from 'data/services/lms/messages';

import '../robbo/StatusBadge.scss';

export const buttonVariants = StrictDict({
  primary: 'primary',
  light: 'light',
  success: 'success',
  warning: 'warning',
});

export const statusVariants = StrictDict({
  [statuses.ungraded]: buttonVariants.primary,
  [statuses.locked]: buttonVariants.light,
  [statuses.graded]: buttonVariants.success,
  [statuses.inProgress]: buttonVariants.warning,
});

/**
 * <StatusBadge />
 */
export const StatusBadge = ({ className, status }) => {
  if (!Object.keys(statusVariants).includes(status)) {
    return null;
  }
  return (
    <Badge
      // Robbo: «Не оценено» in brand coal (src/robbo/StatusBadge.scss), apart from the green «Оценено».
      className={classNames(className, { 'robbo-status-ungraded': status === statuses.ungraded })}
      variant={statusVariants[status]}
    >
      <FormattedMessage {...messages[status]} />
    </Badge>
  );
};
StatusBadge.defaultProps = {
  className: '',
};
StatusBadge.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
