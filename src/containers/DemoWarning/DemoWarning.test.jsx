// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { DemoWarning, mapStateToProps } from '.';

jest.mock('data/redux', () => ({
  selectors: {
    app: { isEnabled: (state) => state.isEnabled },
  },
}));

let el;

describe('DemoWarning component', () => {
  describe('snapshots', () => {
    test('does not render if disabled flag is missing', () => {
      el = shallow(<DemoWarning hide />);
      expect(el.snapshot).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot: disabled flag is present', () => {
      el = shallow(<DemoWarning hide={false} />);
      expect(el.snapshot).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(false);
    });
  });
  // Robbo: the warning shows only once the server said grading is off (null — not known yet).
  describe('mapStateToProps', () => {
    test('shown when grading is off', () => {
      expect(mapStateToProps({ isEnabled: false }).hide).toEqual(false);
    });
    test('hidden when grading is on', () => {
      expect(mapStateToProps({ isEnabled: true }).hide).toEqual(true);
    });
    test('hidden while the server has not answered yet', () => {
      expect(mapStateToProps({ isEnabled: null }).hide).toEqual(true);
    });
  });
});
