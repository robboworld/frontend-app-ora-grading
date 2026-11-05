/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import React from 'react';
import * as redux from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import reducers, { actions, selectors } from 'data/redux';
import { gradeStatuses, lockStatuses } from 'data/services/lms/constants';

import RetakeToggle from './RetakeToggle';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('react');
jest.unmock('react-redux');

const submissionUUID = 'submission-uuid';
const label = messages.allowRetake.defaultMessage;

const makeStore = ({ retakeSupported = true, gradeData = {}, isGrading = false }) => {
  const store = redux.createStore(reducers);
  store.dispatch(actions.app.loadOraMetadata({ retakeSupported }));
  store.dispatch(actions.submissions.loadList({ [submissionUUID]: { submissionUUID } }));
  store.dispatch(actions.grading.updateSelection([submissionUUID]));
  store.dispatch(actions.grading.loadSubmission({
    submissionUUID,
    gradeData,
    gradeStatus: gradeStatuses.graded,
    lockStatus: lockStatuses.unlocked,
    response: {},
  }));
  if (isGrading) {
    store.dispatch(actions.grading.startGrading({ lockStatus: lockStatuses.inProgress, gradeData }));
  }
  return store;
};

const renderToggle = (store) => render(
  <IntlProvider locale="en" messages={{}}>
    <Provider store={store}>
      <RetakeToggle />
    </Provider>
  </IntlProvider>,
);

describe('RetakeToggle', () => {
  it('is absent where a retake cannot work (team, peer)', () => {
    renderToggle(makeStore({ retakeSupported: false, isGrading: true }));
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('is absent from a graded answer without a retake', () => {
    renderToggle(makeStore({ gradeData: { allowRetake: false } }));
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('starts unticked when grading and saves the tick with the grade', async () => {
    const store = makeStore({ isGrading: true });
    renderToggle(store);
    const checkbox = screen.getByRole('checkbox', { name: label });
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toBeEnabled();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(selectors.grading.selected.gradingData(store.getState()).allowRetake).toBe(true);
  });

  it('starts ticked when regrading an answer with a retake, and can be unticked', async () => {
    const store = makeStore({ gradeData: { allowRetake: true }, isGrading: true });
    renderToggle(store);
    const checkbox = screen.getByRole('checkbox', { name: label });
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);

    expect(selectors.grading.selected.gradingData(store.getState()).allowRetake).toBe(false);
  });

  it('stays as a read-only note after the grade', () => {
    renderToggle(makeStore({ gradeData: { allowRetake: true } }));
    const checkbox = screen.getByRole('checkbox', { name: label });
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });
});
