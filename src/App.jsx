// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { selectors } from 'data/redux';

import DemoWarning from 'containers/DemoWarning';
import NotificationsBanner from 'containers/NotificationsBanner';
import ListView from 'containers/ListView';
import LearnersView, { isLearnersRoute } from 'robbo/learners';
import { RobboFooter, RobboHeader } from './robbo-layout';

import './App.scss';
import Head from './components/Head';

export const App = ({ isEnabled }) => (
  <Router>
    {/* Robbo: the site header and footer of the instructor dashboard and the gradebook (src/robbo-layout). */}
    <div className="robbo-layout-page">
      <Head />
      <RobboHeader collapseNavIntoUserMenuOnNarrow />
      {/* Robbo: only once the server said grading is off (null — not known yet). */}
      {isEnabled === false && <DemoWarning />}
      <NotificationsBanner />
      <main data-testid="main">
        {/* Robbo: a course path (course-v1:…) opens «Проверка по учащимся». */}
        {isLearnersRoute() ? <LearnersView /> : <ListView />}
      </main>
      <RobboFooter />
    </div>
  </Router>
);
App.defaultProps = {
  isEnabled: null,
};
App.propTypes = {
  isEnabled: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  isEnabled: selectors.app.isEnabled(state),
});

export default connect(mapStateToProps)(App);
