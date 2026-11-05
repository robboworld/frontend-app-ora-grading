/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * «Разрешить пересдачу» under the rubric: goes out with the grade (allowRetake in gradeData).
 * After a grade it stays visible as a read-only note until the learner starts the retake.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux';

import messages from './messages';

const RetakeToggle = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const isSupported = useSelector(selectors.app.ora.retakeSupported);
  const isGrading = useSelector(selectors.grading.selected.isGrading);
  const allowRetake = useSelector(selectors.grading.selected.allowRetake);

  if (!isSupported || (!isGrading && !allowRetake)) {
    return null;
  }
  return (
    <Form.Group className="mb-0">
      <Form.Checkbox
        checked={allowRetake}
        disabled={!isGrading}
        onChange={(event) => dispatch(actions.grading.setAllowRetake(event.target.checked))}
      >
        {intl.formatMessage(messages.allowRetake)}
      </Form.Checkbox>
      <Form.Text>{intl.formatMessage(messages.allowRetakeHint)}</Form.Text>
    </Form.Group>
  );
};

export default RetakeToggle;
