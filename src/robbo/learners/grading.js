/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * One response at a time goes through the stock grading state: its assignment becomes the
 * app's ORA (rubric, API location), the response becomes a one-item selection. The stock
 * Rubric and StartGradingButton then lock, grade and release it as in the grading window.
 */
import { actions, selectors, thunkActions } from 'data/redux';
import requests from 'data/redux/thunkActions/requests';
import { RequestKeys } from 'data/constants/requests';
import { setOraLocation } from 'data/constants/app';
import { lockStatuses } from 'data/services/lms/constants';

/**
 * Open the response for grading and lock it, unless another grader holds it.
 * @param {object} ora - { id, oraMetadata } from the course API
 * @param {object} submission - stock list entry of the response (submissionUUID, statuses…)
 */
export const openAnswer = ({ ora, submission }) => (dispatch, getState) => {
  const { submissionUUID } = submission;
  setOraLocation(ora.id);
  dispatch(actions.app.loadOraMetadata(ora.oraMetadata));
  dispatch(actions.submissions.loadList({ [submissionUUID]: submission }));
  dispatch(actions.grading.updateSelection([submissionUUID]));
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.submitGrade }));
  dispatch(actions.requests.clearRequest({ requestKey: RequestKeys.setLock }));
  dispatch(requests.fetchSubmission({
    submissionUUID,
    onSuccess: (response) => {
      dispatch(actions.grading.loadSubmission({ ...response, submissionUUID }));
      if (selectors.grading.selected.isGrading(getState())) {
        // Already locked by this grader (another tab, a reload): continue.
        const gradeData = selectors.app.fillGradeData(getState(), response.gradeData);
        dispatch(actions.grading.startGrading({ lockStatus: lockStatuses.inProgress, gradeData }));
      } else if (response.lockStatus === lockStatuses.unlocked) {
        dispatch(thunkActions.grading.startGrading());
      }
    },
  }));
};

/** Release the response being graded (the started grade is dropped). */
export const stopGrading = () => (dispatch) => {
  dispatch(thunkActions.grading.cancelGrading());
};
