/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * The selected learner's feed: every assignment of the course in outline order, with the
 * response or «Нет ответа».
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Button, Spinner } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { gradeStatuses } from 'data/services/lms/constants';

import AnswerCard, { MissingAnswer } from './AnswerCard';
import { loadStates } from './hooks';
import messages from './messages';

const LearnerAnswers = ({
  courseId, oras, learnerState, activeOraId, isGrading, onOpen, onClose,
}) => {
  const intl = useIntl();
  const { status, data, reload } = learnerState;

  if (status === loadStates.loading) {
    return (
      <div className="robbo-learners__loading">
        <Spinner animation="border" variant="primary" screenReaderText={intl.formatMessage(messages.loading)} />
      </div>
    );
  }
  if (status === loadStates.failed) {
    return (
      <Alert
        variant="danger"
        actions={[
          <Button key="retry" variant="outline-danger" onClick={() => reload()}>
            {intl.formatMessage(messages.retry)}
          </Button>,
        ]}
      >
        {intl.formatMessage(messages.loadLearnerError)}
      </Alert>
    );
  }

  const { learner, answers } = data;
  const answered = oras.filter((ora) => answers[ora.id]);
  const ungraded = answered.filter((ora) => answers[ora.id].submission.gradeStatus === gradeStatuses.ungraded);
  return (
    <section className="robbo-learner-answers" aria-labelledby="robbo-learner-answers-heading">
      <header className="robbo-learner-answers__header">
        <h2 id="robbo-learner-answers-heading" className="robbo-learner-answers__name">
          {learner.fullname || learner.username}
        </h2>
        <p className="robbo-learner-answers__meta">
          {[learner.fullname && learner.username, learner.email].filter(Boolean).join(' · ')}
        </p>
        <p className="robbo-learner-answers__summary">
          {intl.formatMessage(messages.learnerSummary, {
            answered: answered.length,
            total: oras.length,
            ungraded: ungraded.length,
          })}
        </p>
      </header>
      <ol className="robbo-learner-answers__list">
        {oras.map((ora) => (
          <li key={ora.id}>
            {answers[ora.id] ? (
              <AnswerCard
                courseId={courseId}
                ora={ora}
                answer={answers[ora.id]}
                isActive={activeOraId === ora.id}
                isBusy={isGrading && activeOraId !== ora.id}
                onOpen={() => onOpen(ora, answers[ora.id].submission)}
                onClose={onClose}
              />
            ) : (
              <MissingAnswer courseId={courseId} ora={ora} />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

LearnerAnswers.defaultProps = {
  activeOraId: null,
};

LearnerAnswers.propTypes = {
  courseId: PropTypes.string.isRequired,
  oras: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  learnerState: PropTypes.shape({
    status: PropTypes.oneOf(Object.values(loadStates)).isRequired,
    data: PropTypes.shape({
      learner: PropTypes.shape({
        username: PropTypes.string,
        fullname: PropTypes.string,
        email: PropTypes.string,
      }),
      answers: PropTypes.objectOf(PropTypes.shape({})),
    }),
    reload: PropTypes.func.isRequired,
  }).isRequired,
  activeOraId: PropTypes.string,
  isGrading: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LearnerAnswers;
