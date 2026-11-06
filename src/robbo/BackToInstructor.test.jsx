/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import urls from 'data/services/lms/urls';

import BackToInstructor from './BackToInstructor';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('react');

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `/openResponseUrl/${courseId}`,
}));

describe('BackToInstructor', () => {
  it('leads to the open response tab of the instructor dashboard', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <BackToInstructor courseId="test-course-id" />
      </IntlProvider>,
    );
    const link = screen.getByRole('link', { name: messages.backToInstructor.defaultMessage });
    expect(link).toHaveAttribute('href', urls.openResponse('test-course-id'));
  });
});
