// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { App } from './App';

jest.mock('data/redux', () => ({
  app: {
    selectors: {
      isEnabled: (state) => ({ isEnabled: state }),
    },
  },
}));

jest.mock('./robbo-layout', () => ({
  RobboHeader: 'RobboHeader',
  RobboFooter: 'RobboFooter',
}));

jest.mock('containers/DemoWarning', () => 'DemoWarning');
jest.mock('containers/ListView', () => 'ListView');
// Robbo: «Проверка по учащимся» is chosen by the page path (course-v1:…), here an assignment.
jest.mock('robbo/learners', () => ({
  __esModule: true,
  default: 'LearnersView',
  isLearnersRoute: () => false,
}));
jest.mock('components/Head', () => 'Head');

let el;

describe('App router component', () => {
  const props = {
    isEnabled: true,
  };
  test('snapshot: enabled', () => {
    expect(shallow(<App {...props} />).snapshot).toMatchSnapshot();
  });
  test('snapshot: disabled (show demo warning)', () => {
    expect(shallow(<App {...props} isEnabled={false} />).snapshot).toMatchSnapshot();
  });
  describe('component', () => {
    beforeEach(() => {
      el = shallow(<App {...props} />);
    });
    describe('Router', () => {
      test('Routing - ListView is only route', () => {
        expect(el.instance.findByTestId('main')[0].children).toHaveLength(1);
        expect(el.instance.findByTestId('main')[0].children[0].type).toBe('ListView');
      });
    });

    // Robbo: the site header (src/robbo-layout) instead of the course title header.
    test('Robbo site header', () => {
      expect(el.instance.findByType('RobboHeader')).toHaveLength(1);
    });
  });
});
