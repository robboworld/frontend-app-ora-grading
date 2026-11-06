/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Arrow back to the instructor dashboard under the header, as in the gradebook: on both ways of
 * grading, on the dashboard tab the teacher came from.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';

import urls from 'data/services/lms/urls';

import messages from './messages';

import './BackToInstructor.scss';

const BackToInstructor = ({ courseId }) => {
  const intl = useIntl();
  return (
    <a href={urls.openResponse(courseId)} className="robbo-back-to-instructor">
      <Icon src={ArrowBack} size="sm" />
      {intl.formatMessage(messages.backToInstructor)}
    </a>
  );
};

BackToInstructor.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default BackToInstructor;
