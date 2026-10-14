/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * «Проверка по учащимся»: the alternative to the stock grading by assignment. Page path is the
 * course id (/ora-grading/course-v1:…); learners on the left, all assignments of the course for
 * the selected one on the right, files of the responses in full width, the stock rubric in the
 * open response. Entry points: the instructor dashboard «Ответы в свободной форме» tab
 * (openedx-platform lms/static/js/robbo-ora-instructor-listing.js) and ModeSwitch.
 */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Alert, Button, Container, Spinner,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import ConfirmModal from 'components/ConfirmModal';
import { pathId } from 'data/constants/app';
import urls from 'data/services/lms/urls';

import ModeSwitch, { modes } from '../ModeSwitch';
import LearnerAnswers from './LearnerAnswers';
import LearnerList from './LearnerList';
import { assignmentPageUrl, learnersPageUrl } from './api';
import { openAnswer, stopGrading } from './grading';
import {
  loadStates, useCourse, useGradingEnd, useIsGrading, useLearner, useSelectedLearner,
} from './hooks';
import messages from './messages';

import './LearnersView.scss';

export const isLearnersRoute = () => pathId().startsWith('course-v1:');

const LearnersView = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const courseId = pathId();
  const course = useCourse(courseId);
  const oras = course.data?.oras || [];
  const learners = course.data?.learners || [];
  const [username, setUsername] = useSelectedLearner(course.data?.learners);
  const learner = useLearner(courseId, username);
  const [activeOraId, setActiveOraId] = useState(null);
  const [pendingLearner, setPendingLearner] = useState(null);
  const isGrading = useIsGrading();

  const { reload: reloadCourse } = course;
  const { reload: reloadLearner } = learner;
  useGradingEnd(useCallback(() => {
    reloadCourse({ quiet: true });
    reloadLearner({ quiet: true });
  }, [reloadCourse, reloadLearner]));

  const showLearner = (name) => {
    setActiveOraId(null);
    setUsername(name);
  };
  const selectLearner = (name) => {
    if (name === username) {
      return;
    }
    if (isGrading) {
      setPendingLearner(name);
    } else {
      showLearner(name);
    }
  };
  const confirmSwitch = () => {
    dispatch(stopGrading());
    showLearner(pendingLearner);
    setPendingLearner(null);
  };

  const fromOra = new URLSearchParams(window.location.search).get('ora');
  const assignmentUrl = fromOra ? assignmentPageUrl(fromOra) : urls.openResponse(courseId);

  let content = null;
  if (course.status === loadStates.loading) {
    content = (
      <div className="robbo-learners__loading">
        <Spinner animation="border" variant="primary" screenReaderText={intl.formatMessage(messages.loading)} />
      </div>
    );
  } else if (course.status === loadStates.failed) {
    content = (
      <Alert
        variant="danger"
        actions={[
          <Button key="retry" variant="outline-danger" onClick={() => course.reload()}>
            {intl.formatMessage(messages.retry)}
          </Button>,
        ]}
      >
        {intl.formatMessage(messages.loadCourseError)}
      </Alert>
    );
  } else if (!oras.length) {
    content = <p className="robbo-learners__empty">{intl.formatMessage(messages.noAssignments)}</p>;
  } else if (!learners.length && !username) {
    content = (
      <div className="robbo-learners__empty">
        <h2 className="h4">{intl.formatMessage(messages.noLearnersTitle)}</h2>
        <p>{intl.formatMessage(messages.noLearnersBody)}</p>
      </div>
    );
  } else {
    content = (
      <div className="robbo-learners__layout">
        <LearnerList learners={learners} selected={username} onSelect={selectLearner} />
        <div className="robbo-learners__main">
          {username && (
            <LearnerAnswers
              courseId={courseId}
              oras={oras}
              learnerState={learner}
              activeOraId={activeOraId}
              isGrading={isGrading}
              onOpen={(ora, submission) => {
                setActiveOraId(ora.id);
                dispatch(openAnswer({ ora, submission }));
              }}
              onClose={() => setActiveOraId(null)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="robbo-learners">
      <ModeSwitch
        active={modes.learners}
        assignmentUrl={assignmentUrl}
        learnersUrl={learnersPageUrl(courseId, { ora: fromOra, learner: username })}
      />
      <h1 className="robbo-learners__title">{intl.formatMessage(messages.pageHeading)}</h1>
      {content}
      <ConfirmModal
        isOpen={pendingLearner !== null}
        title={intl.formatMessage(messages.switchLearnerTitle)}
        content={intl.formatMessage(messages.switchLearnerWarning)}
        cancelText={intl.formatMessage(messages.switchLearnerCancel)}
        confirmText={intl.formatMessage(messages.switchLearnerConfirm)}
        onCancel={() => setPendingLearner(null)}
        onConfirm={confirmSwitch}
      />
    </Container>
  );
};

export default LearnersView;
