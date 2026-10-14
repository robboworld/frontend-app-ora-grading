/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * LMS API of «Проверка по учащимся» (openedx-platform lms/djangoapps/robbo_ora/learner_grading.py)
 * and the page addresses of the two grading views.
 */
import { getConfig, getPath } from '@edx/frontend-platform';

import { get, stringifyUrl } from 'data/services/lms/utils';

const apiUrl = (courseId) => (
  `${getConfig().LMS_BASE_URL}/api/robbo/v1/ora-grading/${encodeURIComponent(courseId)}`
);

/**
 * @return {Promise} { courseMetadata, isEnabled, oras: [{ id, unitName, oraMetadata }],
 *   learners: [{ username, fullname, email, submitted, ungraded }] }
 */
export const fetchCourse = (courseId) => get(`${apiUrl(courseId)}/`).then(({ data }) => data);

/**
 * @return {Promise} { learner: { username, fullname, email },
 *   answers: { <ora id>: { submission, response: { text, files } } } }
 */
export const fetchLearner = (courseId, username) => (
  get(`${apiUrl(courseId)}/learners/${encodeURIComponent(username)}`).then(({ data }) => data)
);

const appPath = () => getPath(getConfig().PUBLIC_PATH);

/** Stock view: all responses to one assignment. */
export const assignmentPageUrl = (oraId) => `${appPath()}${oraId}`;

/** «Проверка по учащимся»; `ora` — the assignment the grader came from (the way back). */
export const learnersPageUrl = (courseId, { ora, learner } = {}) => (
  stringifyUrl(`${appPath()}${courseId}`, { ora, learner })
);
