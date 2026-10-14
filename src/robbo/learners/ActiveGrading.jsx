/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Rubric of the open response: the stock StartGradingButton (stop / change grade with their
 * confirmations) and Rubric (criteria, comments, submit), fed by grading.js#openAnswer.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  ActionRow, Alert, Button, Spinner,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { gradeStatuses } from 'data/services/lms/constants';
import Rubric from 'containers/Rubric';
import StartGradingButton from 'containers/ReviewActions/components/StartGradingButton';

import messages from './messages';

const ActiveGrading = ({ onClose }) => {
  const intl = useIntl();
  const isLoading = useSelector((state) => (
    selectors.requests.isPending(state, { requestKey: RequestKeys.fetchSubmission })
  ));
  const isFailed = useSelector((state) => (
    selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchSubmission })
  ));
  const isGrading = useSelector(selectors.grading.selected.isGrading);
  const gradeStatus = useSelector(selectors.grading.selected.gradeStatus);

  if (isLoading) {
    return (
      <div className="robbo-active-grading__loading">
        <Spinner
          animation="border"
          variant="primary"
          screenReaderText={intl.formatMessage(messages.openingAnswer)}
        />
      </div>
    );
  }

  const collapse = (
    <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.collapse)}</Button>
  );
  if (isFailed) {
    return (
      <>
        <Alert variant="danger">{intl.formatMessage(messages.openAnswerError)}</Alert>
        <ActionRow className="robbo-active-grading__actions">{collapse}</ActionRow>
      </>
    );
  }
  return (
    <>
      <ActionRow className="robbo-active-grading__actions">
        <StartGradingButton />
        {!isGrading && collapse}
      </ActionRow>
      {(isGrading || gradeStatus === gradeStatuses.graded) && <Rubric />}
    </>
  );
};

ActiveGrading.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ActiveGrading;
