/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * «Проверка по учащимся» and the switch between the two ways of grading.
 * Russian — src/i18n/robbo-overrides/ru.json.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  modeSwitchLabel: {
    id: 'robbo.ora-grading.Learners.modeSwitchLabel',
    defaultMessage: 'How to review responses',
    description: 'Screen reader label of the switch between grading by assignment and by learner',
  },
  modeByAssignment: {
    id: 'robbo.ora-grading.Learners.modeByAssignment',
    defaultMessage: 'By assignment',
    description: 'Switch item: all responses to one assignment (the stock grading view)',
  },
  modeByLearner: {
    id: 'robbo.ora-grading.Learners.modeByLearner',
    defaultMessage: 'By learner',
    description: 'Switch item: all responses of one learner across the course',
  },
  pageHeading: {
    id: 'robbo.ora-grading.Learners.pageHeading',
    defaultMessage: 'Grading by learner',
    description: 'Heading of the page with the responses of one learner across the course',
  },
  learnersHeading: {
    id: 'robbo.ora-grading.Learners.learnersHeading',
    defaultMessage: 'Learners',
    description: 'Heading of the learner list',
  },
  learnerSearchLabel: {
    id: 'robbo.ora-grading.Learners.learnerSearchLabel',
    defaultMessage: 'Search learners',
    description: 'Label of the learner search field',
  },
  learnerSearchPlaceholder: {
    id: 'robbo.ora-grading.Learners.learnerSearchPlaceholder',
    defaultMessage: 'Name, username or email',
    description: 'Placeholder of the learner search field',
  },
  noLearnerMatches: {
    id: 'robbo.ora-grading.Learners.noLearnerMatches',
    defaultMessage: 'No learners found',
    description: 'The learner search matched nobody',
  },
  ungradedCount: {
    id: 'robbo.ora-grading.Learners.ungradedCount',
    defaultMessage: '{count, plural, one {# response waits for a grade} other {# responses wait for a grade}}',
    description: 'Screen reader text of the counter next to a learner',
  },
  allGraded: {
    id: 'robbo.ora-grading.Learners.allGraded',
    defaultMessage: 'All responses are graded',
    description: 'Screen reader text of the check mark next to a learner',
  },
  noLearnersTitle: {
    id: 'robbo.ora-grading.Learners.noLearnersTitle',
    defaultMessage: 'No responses yet',
    description: 'Nobody answered any assignment of the course yet',
  },
  noLearnersBody: {
    id: 'robbo.ora-grading.Learners.noLearnersBody',
    defaultMessage: 'Learners appear here once they submit a response to any assignment of the course.',
    description: 'Nobody answered any assignment of the course yet',
  },
  noAssignments: {
    id: 'robbo.ora-grading.Learners.noAssignments',
    defaultMessage: 'The course has no open response assignments.',
    description: 'The course has no assignments this page can show',
  },
  loading: {
    id: 'robbo.ora-grading.Learners.loading',
    defaultMessage: 'Loading responses',
    description: 'Responses are loading',
  },
  loadCourseError: {
    id: 'robbo.ora-grading.Learners.loadCourseError',
    defaultMessage: 'Could not load the responses of the course',
    description: 'Error when the course data could not be loaded',
  },
  loadLearnerError: {
    id: 'robbo.ora-grading.Learners.loadLearnerError',
    defaultMessage: 'Could not load the responses of this learner',
    description: 'Error when the responses of the selected learner could not be loaded',
  },
  retry: {
    id: 'robbo.ora-grading.Learners.retry',
    defaultMessage: 'Try again',
    description: 'Button that repeats a failed request',
  },
  learnerSummary: {
    id: 'robbo.ora-grading.Learners.learnerSummary',
    defaultMessage: 'Responses: {answered} of {total} · waiting for a grade: {ungraded}',
    description: 'Summary under the learner name: answered assignments and responses waiting for a grade',
  },
  noAnswer: {
    id: 'robbo.ora-grading.Learners.noAnswer',
    defaultMessage: 'No response',
    description: 'The learner has not answered this assignment',
  },
  submittedOn: {
    id: 'robbo.ora-grading.Learners.submittedOn',
    defaultMessage: 'Submitted {date}',
    description: 'When the response was submitted',
  },
  score: {
    id: 'robbo.ora-grading.Learners.score',
    defaultMessage: '{pointsEarned} of {pointsPossible} points',
    description: 'Score of a graded response',
  },
  openInCourse: {
    id: 'robbo.ora-grading.Learners.openInCourse',
    defaultMessage: 'Assignment in the course',
    description: 'Link to the assignment in the course (opens in a new tab)',
  },
  assignmentResponses: {
    id: 'robbo.ora-grading.Learners.assignmentResponses',
    defaultMessage: 'All responses to the assignment',
    description: 'Link to the stock grading view of this assignment',
  },
  opensInNewTab: {
    id: 'robbo.ora-grading.Learners.opensInNewTab',
    defaultMessage: '(opens in a new tab)',
    description: 'Screen reader note of links that open a new tab',
  },
  filesHeading: {
    id: 'robbo.ora-grading.Learners.filesHeading',
    defaultMessage: 'Files ({count})',
    description: 'Heading of the files of a response',
  },
  downloadFile: {
    id: 'robbo.ora-grading.Learners.downloadFile',
    defaultMessage: 'Download {name}, {size}',
    description: 'Screen reader label of the download link of a file',
  },
  textHeading: {
    id: 'robbo.ora-grading.Learners.textHeading',
    defaultMessage: 'Response text',
    description: 'Collapsible text of a response',
  },
  textFlag: {
    id: 'robbo.ora-grading.Learners.textFlag',
    defaultMessage: 'Has response text',
    description: 'Flag in the header of a response that also has text (it may be collapsed below the files)',
  },
  textFlagTitle: {
    id: 'robbo.ora-grading.Learners.textFlagTitle',
    defaultMessage: 'Show the response text',
    description: 'Tooltip of the response text flag; clicking opens and scrolls to the text',
  },
  externalImage: {
    id: 'robbo.ora-grading.Learners.externalImage',
    defaultMessage: 'Image from another site, not loaded automatically: {name}',
    description: 'Link in place of an image the learner inserted from another site; opens it in a new tab',
  },
  grade: {
    id: 'robbo.ora-grading.Learners.grade',
    defaultMessage: 'Grade',
    description: 'Button that opens the rubric of an ungraded response',
  },
  regrade: {
    id: 'robbo.ora-grading.Learners.regrade',
    defaultMessage: 'Change grade',
    description: 'Button that opens the rubric of a graded response',
  },
  continueGrading: {
    id: 'robbo.ora-grading.Learners.continueGrading',
    defaultMessage: 'Continue grading',
    description: 'Button that reopens a response this grader started grading',
  },
  collapse: {
    id: 'robbo.ora-grading.Learners.collapse',
    defaultMessage: 'Collapse',
    description: 'Hides the rubric of the response',
  },
  busyGrading: {
    id: 'robbo.ora-grading.Learners.busyGrading',
    defaultMessage: 'Submit or stop the grade you have started first.',
    description: 'Why the grading buttons of other responses are disabled',
  },
  openingAnswer: {
    id: 'robbo.ora-grading.Learners.openingAnswer',
    defaultMessage: 'Opening the response',
    description: 'The response is being opened for grading',
  },
  openAnswerError: {
    id: 'robbo.ora-grading.Learners.openAnswerError',
    defaultMessage: 'Could not open the response for grading.',
    description: 'Error when the response could not be opened for grading',
  },
  switchLearnerTitle: {
    id: 'robbo.ora-grading.Learners.switchLearnerTitle',
    defaultMessage: 'Stop grading?',
    description: 'Title of the confirmation shown when another learner is opened during grading',
  },
  switchLearnerWarning: {
    id: 'robbo.ora-grading.Learners.switchLearnerWarning',
    defaultMessage: 'The grade you have started is not submitted. It will be lost if you open another learner.',
    description: 'Warning shown when another learner is opened during grading',
  },
  switchLearnerCancel: {
    id: 'robbo.ora-grading.Learners.switchLearnerCancel',
    defaultMessage: 'Back to grading',
    description: 'Keeps grading the current response',
  },
  switchLearnerConfirm: {
    id: 'robbo.ora-grading.Learners.switchLearnerConfirm',
    defaultMessage: 'Stop and open',
    description: 'Drops the started grade and opens the other learner',
  },
});

export default messages;
