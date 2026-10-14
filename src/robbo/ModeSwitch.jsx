/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Switch between the two ways of grading: «По заданию» (stock: all responses to one
 * assignment) and «По учащимся» (src/robbo/learners: one learner across the course).
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './learners/messages';

import './ModeSwitch.scss';

export const modes = {
  assignment: 'assignment',
  learners: 'learners',
};

const ModeSwitch = ({ active, assignmentUrl, learnersUrl }) => {
  const intl = useIntl();
  const items = [
    { mode: modes.assignment, url: assignmentUrl, label: messages.modeByAssignment },
    { mode: modes.learners, url: learnersUrl, label: messages.modeByLearner },
  ];
  return (
    <nav className="robbo-mode-switch" aria-label={intl.formatMessage(messages.modeSwitchLabel)}>
      <ul className="robbo-mode-switch__items">
        {items.map(({ mode, url, label }) => (
          <li key={mode}>
            <a
              className={classNames('robbo-mode-switch__item', { 'is-active': mode === active })}
              href={url}
              aria-current={mode === active ? 'page' : undefined}
            >
              {intl.formatMessage(label)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

ModeSwitch.propTypes = {
  active: PropTypes.oneOf(Object.values(modes)).isRequired,
  assignmentUrl: PropTypes.string.isRequired,
  learnersUrl: PropTypes.string.isRequired,
};

export default ModeSwitch;
