/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * One assignment in the learner's feed: the response (files first, text below) and its
 * grading. Only the open card talks to the grading state; the others show the statuses
 * of the last load.
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';

import {
  Button, Card, Collapsible, Hyperlink,
} from '@openedx/paragon';
import { Notes } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux';
import { gradingStatusTransform } from 'data/redux/grading/selectors/selected';
import { gradeStatuses, lockStatuses } from 'data/services/lms/constants';
import urls from 'data/services/lms/urls';
import StatusBadge from 'components/StatusBadge';
import OverrideGradeConfirmModal from 'containers/ReviewActions/components/OverrideGradeConfirmModal';

import { parseResponseHtml } from '../sanitize';
import ActiveGrading from './ActiveGrading';
import AnswerFiles from './AnswerFiles';
import { assignmentPageUrl } from './api';
import messages from './messages';
import { textParts } from './responseText';

const oraShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  unitName: PropTypes.string,
  oraMetadata: PropTypes.shape({
    name: PropTypes.string,
    textResponseEditor: PropTypes.string,
  }).isRequired,
});

const AssignmentTitle = ({ courseId, ora, headingId }) => {
  const intl = useIntl();
  const newTab = intl.formatMessage(messages.opensInNewTab);
  return (
    <div className="robbo-answer__title">
      {ora.unitName && <p className="robbo-answer__unit">{ora.unitName}</p>}
      <h3 id={headingId} className="robbo-answer__name">{ora.oraMetadata.name}</h3>
      <p className="robbo-answer__links">
        <Hyperlink
          destination={urls.ora(courseId, ora.id)}
          target="_blank"
          externalLinkAlternativeText={newTab}
          externalLinkTitle={newTab}
        >
          {intl.formatMessage(messages.openInCourse)}
        </Hyperlink>
        <Hyperlink destination={assignmentPageUrl(ora.id)}>
          {intl.formatMessage(messages.assignmentResponses)}
        </Hyperlink>
      </p>
    </div>
  );
};

AssignmentTitle.propTypes = {
  courseId: PropTypes.string.isRequired,
  ora: oraShape.isRequired,
  headingId: PropTypes.string.isRequired,
};

const AnswerText = ({
  parts, isPlain, open, onToggle,
}) => {
  const intl = useIntl();
  return (
    <Collapsible
      className="robbo-answer-text"
      styling="basic"
      open={open}
      onToggle={onToggle}
      title={<h4 className="robbo-answer__section-heading">{intl.formatMessage(messages.textHeading)}</h4>}
    >
      {parts.map((part, index) => (
        // eslint-disable-next-line react/no-array-index-key -- one part per prompt, order is fixed
        <div key={index} className={classNames('robbo-answer-text__part', { 'is-plain': isPlain })}>
          {isPlain ? part : parseResponseHtml(part, {
            externalImageText: (alt, url) => intl.formatMessage(messages.externalImage, { name: alt || url }),
          })}
        </div>
      ))}
    </Collapsible>
  );
};

AnswerText.propTypes = {
  parts: PropTypes.arrayOf(PropTypes.string).isRequired,
  isPlain: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const AnswerActions = ({
  submission, isBusy, onOpen, busyHintId,
}) => {
  const intl = useIntl();
  const [confirmOverride, setConfirmOverride] = useState(false);
  const isGraded = submission.gradeStatus === gradeStatuses.graded;
  let label = isGraded ? messages.regrade : messages.grade;
  if (submission.lockStatus === lockStatuses.inProgress) {
    label = messages.continueGrading;
  }
  const needsConfirm = isGraded && submission.lockStatus !== lockStatuses.inProgress;
  return (
    <>
      <Button
        variant={isGraded ? 'outline-primary' : 'primary'}
        disabled={isBusy}
        aria-describedby={isBusy ? busyHintId : undefined}
        onClick={() => (needsConfirm ? setConfirmOverride(true) : onOpen())}
      >
        {intl.formatMessage(label)}
      </Button>
      {isBusy && (
        <span id={busyHintId} className="robbo-answer__hint">{intl.formatMessage(messages.busyGrading)}</span>
      )}
      <OverrideGradeConfirmModal
        isOpen={confirmOverride}
        onCancel={() => setConfirmOverride(false)}
        onConfirm={() => {
          setConfirmOverride(false);
          onOpen();
        }}
      />
    </>
  );
};

AnswerActions.propTypes = {
  submission: PropTypes.shape({
    gradeStatus: PropTypes.string.isRequired,
    lockStatus: PropTypes.string.isRequired,
  }).isRequired,
  isBusy: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  busyHintId: PropTypes.string.isRequired,
};

const AnswerCard = ({
  courseId, ora, answer, isActive, isBusy, onOpen, onClose,
}) => {
  const intl = useIntl();
  const current = useSelector(selectors.grading.current);
  const { submission, response } = answer;
  // The open card follows the grading state once its response is loaded there.
  const isLive = isActive && current.submissionUUID === submission.submissionUUID && current.lockStatus;
  const status = gradingStatusTransform(isLive ? current : submission);
  const headingId = `robbo-answer-${submission.submissionUUID}`;
  const { score } = submission;
  const isPlain = ora.oraMetadata.textResponseEditor !== 'tinymce';
  const parts = textParts(response.text, isPlain);
  // Without files the text is open; under files it starts collapsed, and the flag in the
  // header tells the grader it is there.
  const [textOpen, setTextOpen] = useState(!response.files.length);
  const textRef = useRef(null);
  const showText = () => {
    setTextOpen(true);
    window.requestAnimationFrame(() => textRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <Card className={classNames('robbo-answer', { 'is-active': isActive })}>
      <Card.Section className="robbo-answer__head">
        <AssignmentTitle courseId={courseId} ora={ora} headingId={headingId} />
        <div className="robbo-answer__state">
          <StatusBadge status={status} />
          {score && (
            <span className="robbo-answer__score">{intl.formatMessage(messages.score, score)}</span>
          )}
          <span className="robbo-answer__date">
            {intl.formatMessage(messages.submittedOn, {
              date: intl.formatDate(moment(submission.dateSubmitted).toDate(), {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
              }),
            })}
          </span>
          {parts.length > 0 && (
            <Button
              variant="link"
              size="sm"
              className="robbo-answer__text-flag"
              iconBefore={Notes}
              title={intl.formatMessage(messages.textFlagTitle)}
              onClick={showText}
            >
              {intl.formatMessage(messages.textFlag)}
            </Button>
          )}
        </div>
      </Card.Section>
      <div className="robbo-answer__body">
        <div className="robbo-answer__content">
          <AnswerFiles files={response.files} />
          {parts.length > 0 && (
            <div ref={textRef} className="robbo-answer__text-anchor">
              <AnswerText parts={parts} isPlain={isPlain} open={textOpen} onToggle={setTextOpen} />
            </div>
          )}
        </div>
        {isActive && (
          <section className="robbo-answer__grading" aria-labelledby={headingId}>
            <ActiveGrading onClose={onClose} />
          </section>
        )}
      </div>
      {/* Locked by another grader: no actions, the badge says so. */}
      {!isActive && submission.lockStatus !== lockStatuses.locked && (
        <Card.Footer className="robbo-answer__footer">
          <AnswerActions
            submission={submission}
            isBusy={isBusy}
            onOpen={onOpen}
            busyHintId={`${headingId}-busy`}
          />
        </Card.Footer>
      )}
    </Card>
  );
};

AnswerCard.propTypes = {
  courseId: PropTypes.string.isRequired,
  ora: oraShape.isRequired,
  answer: PropTypes.shape({
    submission: PropTypes.shape({
      submissionUUID: PropTypes.string.isRequired,
      dateSubmitted: PropTypes.string,
      gradeStatus: PropTypes.string.isRequired,
      lockStatus: PropTypes.string.isRequired,
      score: PropTypes.shape({
        pointsEarned: PropTypes.number,
        pointsPossible: PropTypes.number,
      }),
    }).isRequired,
    response: PropTypes.shape({
      text: PropTypes.arrayOf(PropTypes.string).isRequired,
      files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  isBusy: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const MissingAnswer = ({ courseId, ora }) => {
  const intl = useIntl();
  return (
    <Card className="robbo-answer is-missing">
      <Card.Section className="robbo-answer__head">
        <AssignmentTitle courseId={courseId} ora={ora} headingId={`robbo-answer-missing-${ora.id}`} />
        <div className="robbo-answer__state">
          <span className="robbo-answer__missing">{intl.formatMessage(messages.noAnswer)}</span>
        </div>
      </Card.Section>
    </Card>
  );
};

MissingAnswer.propTypes = {
  courseId: PropTypes.string.isRequired,
  ora: oraShape.isRequired,
};

export default AnswerCard;
