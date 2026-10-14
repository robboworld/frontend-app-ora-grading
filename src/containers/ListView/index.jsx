// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Container, Spinner } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import ReviewModal from 'containers/ReviewModal';
import { locationId } from 'data/constants/app';
import ModeSwitch, { modes } from 'robbo/ModeSwitch';
import { learnersPageUrl } from 'robbo/learners/api';

import ListError from './ListError';
import ListViewBreadcrumb from './ListViewBreadcrumb';
import SubmissionsTable from './SubmissionsTable';
import EmptySubmission from './EmptySubmission';
import messages from './messages';
import './ListView.scss';

/**
 * <ListView />
 */
export class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.props.initializeApp();
  }

  render() {
    const {
      isLoaded, hasError, courseId, isEmptySubmissionData,
    } = this.props;
    return (
      <Container className="py-4">
        {/* Robbo: switch to «Проверка по учащимся»; it leads back to this assignment. */}
        {courseId && (
          <ModeSwitch
            active={modes.assignment}
            assignmentUrl={window.location.pathname}
            learnersUrl={learnersPageUrl(courseId, { ora: locationId() })}
          />
        )}
        {isLoaded
          && (isEmptySubmissionData ? (
            <EmptySubmission courseId={courseId} />
          ) : (
            <>
              <ListViewBreadcrumb />
              <SubmissionsTable />
            </>
          ))}
        {hasError && <ListError />}
        {!isLoaded && !hasError && (
          <div className="w-100 h-100 text-center">
            <Spinner animation="border" variant="primary" />
            <h4>
              <FormattedMessage {...messages.loadingResponses} />
            </h4>
          </div>
        )}
        <ReviewModal />
      </Container>
    );
  }
}
ListView.defaultProps = {};
ListView.propTypes = {
  // redux
  courseId: PropTypes.string.isRequired,
  initializeApp: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  isEmptySubmissionData: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  courseId: selectors.app.courseId(state),
  isLoaded: selectors.requests.isCompleted(state, {
    requestKey: RequestKeys.initialize,
  }),
  hasError: selectors.requests.isFailed(state, {
    requestKey: RequestKeys.initialize,
  }),
  isEmptySubmissionData: selectors.submissions.isEmptySubmissionData(state),
});

export const mapDispatchToProps = {
  initializeApp: thunkActions.app.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
