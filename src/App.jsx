// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { FooterSlot } from '@edx/frontend-component-footer';
import { LearningHeader as Header } from '@edx/frontend-component-header';

import { selectors } from 'data/redux';

import DemoWarning from 'containers/DemoWarning';
import NotificationsBanner from 'containers/NotificationsBanner';
import ListView from 'containers/ListView';
import LearnersView, { isLearnersRoute } from 'robbo/learners';

import './App.scss';
import Head from './components/Head';

export const App = ({ courseMetadata, isEnabled }) => (
  <Router>
    <div>
      <Head />
      <Header
        courseTitle={courseMetadata.title}
        courseNumber={courseMetadata.number}
        courseOrg={courseMetadata.org}
        data-testid="header"
      />
      {/* Robbo: only once the server said grading is off (null — not known yet). */}
      {isEnabled === false && <DemoWarning />}
      <NotificationsBanner />
      <main data-testid="main">
        {/* Robbo: a course path (course-v1:…) opens «Проверка по учащимся». */}
        {isLearnersRoute() ? <LearnersView /> : <ListView />}
      </main>
      <FooterSlot />
    </div>
  </Router>
);
App.defaultProps = {
  isEnabled: null,
  courseMetadata: {
    title: '',
    number: null,
    org: '',
  },
};
App.propTypes = {
  courseMetadata: PropTypes.shape({
    title: PropTypes.string,
    number: PropTypes.string,
    org: PropTypes.string,
  }),
  isEnabled: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  courseMetadata: selectors.app.courseMetadata(state),
  isEnabled: selectors.app.isEnabled(state),
});

export default connect(mapStateToProps)(App);
