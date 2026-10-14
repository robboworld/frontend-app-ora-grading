/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Learners who answered at least one assignment of the course, with the number of
 * responses waiting for a grade. Order comes from the API (waiting first, then by name).
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Badge, Form, Icon } from '@openedx/paragon';
import { Check } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const matchesQuery = (learner, query) => (
  [learner.fullname, learner.username, learner.email]
    .some((value) => value && value.toLowerCase().includes(query))
);

const LearnerList = ({ learners, selected, onSelect }) => {
  const intl = useIntl();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const shown = normalizedQuery
    ? learners.filter((learner) => matchesQuery(learner, normalizedQuery))
    : learners;

  return (
    <nav className="robbo-learner-list" aria-labelledby="robbo-learner-list-heading">
      <h2 id="robbo-learner-list-heading" className="robbo-learner-list__heading">
        {intl.formatMessage(messages.learnersHeading)}
      </h2>
      <Form.Group controlId="robbo-learner-search" className="robbo-learner-list__search">
        <Form.Label className="sr-only">{intl.formatMessage(messages.learnerSearchLabel)}</Form.Label>
        <Form.Control
          type="search"
          value={query}
          placeholder={intl.formatMessage(messages.learnerSearchPlaceholder)}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Form.Group>
      {shown.length ? (
        <ul className="robbo-learner-list__items">
          {shown.map((learner) => {
            const isSelected = learner.username === selected;
            return (
              <li key={learner.username}>
                <button
                  type="button"
                  className={classNames('robbo-learner', { 'is-selected': isSelected })}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => onSelect(learner.username)}
                >
                  <span className="robbo-learner__text">
                    <span className="robbo-learner__name">{learner.fullname || learner.username}</span>
                    {learner.fullname && <span className="robbo-learner__username">{learner.username}</span>}
                  </span>
                  {learner.ungraded > 0 ? (
                    <Badge variant="primary" className="robbo-learner__count">
                      <span aria-hidden="true">{learner.ungraded}</span>
                      <span className="sr-only">
                        {intl.formatMessage(messages.ungradedCount, { count: learner.ungraded })}
                      </span>
                    </Badge>
                  ) : (
                    <Icon
                      src={Check}
                      className="robbo-learner__done"
                      screenReaderText={intl.formatMessage(messages.allGraded)}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="robbo-learner-list__empty">{intl.formatMessage(messages.noLearnerMatches)}</p>
      )}
    </nav>
  );
};

LearnerList.defaultProps = {
  selected: null,
};

LearnerList.propTypes = {
  learners: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string,
    email: PropTypes.string,
    ungraded: PropTypes.number.isRequired,
  })).isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default LearnerList;
