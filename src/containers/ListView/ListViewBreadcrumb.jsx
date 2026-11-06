// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Launch } from '@openedx/paragon/icons';
import { Hyperlink, Icon } from '@openedx/paragon';

import { selectors } from 'data/redux';
import { locationId } from 'data/constants/app';
import urls from 'data/services/lms/urls';

/**
 * <ListViewBreadcrumb />
 * Robbo: the arrow back moved under the header (robbo/BackToInstructor).
 */
export const ListViewBreadcrumb = ({ courseId, oraName }) => (
  <p className="py-4">
    <span className="h3">{oraName}</span>
    <Hyperlink className="align-middle" destination={urls.ora(courseId, locationId())}>
      <Icon src={Launch} className="d-inline-block" />
    </Hyperlink>
  </p>
);
ListViewBreadcrumb.defaultProps = {
  courseId: '',
  oraName: '',
};
ListViewBreadcrumb.propTypes = {
  courseId: PropTypes.string,
  oraName: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  courseId: selectors.app.courseId(state),
  oraName: selectors.app.ora.name(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListViewBreadcrumb);
