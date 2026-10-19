import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';

import messages from './i18n';
import { initRobboErrors } from './robbo-errors';
import * as app from '.';

// These need to be var not let so they get hoisted
// and can be used by jest.mock (which is also hoisted)
var mockRender; // eslint-disable-line no-var
var mockCreateRoot; // eslint-disable-line no-var
jest.mock('react-dom/client', () => {
  mockRender = jest.fn();
  mockCreateRoot = jest.fn(() => ({
    render: mockRender,
  }));

  return ({
    createRoot: mockCreateRoot,
  });
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  StrictMode: 'React Strict Mode',
}));

jest.mock('@edx/frontend-component-footer', () => ({
  messages: 'frontend-footer-messages',
}));
jest.mock('@edx/frontend-component-header', () => ({
  messages: 'frontend-header-messages',
}));

jest.mock('@edx/frontend-platform', () => ({
  mergeConfig: jest.fn(),
  APP_READY: 'app-is-ready-key',
  APP_INIT_ERROR: 'app-init-error',
  initialize: jest.fn(),
  subscribe: jest.fn(),
}));
jest.mock('@edx/frontend-component-footer', () => ({
  messages: ['some', 'messages'],
}));
jest.mock('./App', () => 'App');
// Robbo: src/robbo-errors has its own tests; here only its wiring is checked (the real initRobboErrors
// would add its own APP_READY subscriber and shift subscribe.mock.calls).
jest.mock('./robbo-errors', () => ({
  initRobboErrors: jest.fn(),
  RobboErrorBoundary: 'RobboErrorBoundary',
  RobboErrorPage: 'RobboErrorPage',
  robboErrorsMiddleware: 'robboErrorsMiddleware',
}));

const testValue = 'my-test-value';
describe('app registry', () => {
  let getElement;

  beforeEach(() => {
    mockRender.mockClear();
    getElement = window.document.getElementById;
    window.document.getElementById = jest.fn(id => ({ id }));
  });
  afterAll(() => {
    window.document.getElementById = getElement;
  });

  test('subscribe: APP_READY.  links App to root element', () => {
    const callArgs = subscribe.mock.calls[0];
    expect(callArgs[0]).toEqual(APP_READY);
    callArgs[1]();
    const [rendered] = mockRender.mock.calls[0];
    expect(rendered).toMatchSnapshot();
  });
  test('subscribe: APP_INIT_ERROR.  snapshot: displays an ErrorPage to root element', () => {
    const callArgs = subscribe.mock.calls[1];
    expect(callArgs[0]).toEqual(APP_INIT_ERROR);
    const error = { message: 'test-error-message' };
    // Robbo: PubSub calls back with (topic, data), the error is the second argument.
    callArgs[1](APP_INIT_ERROR, error);
    const [rendered] = mockRender.mock.calls[0];
    expect(rendered).toMatchSnapshot();
  });
  test('initialize is called with footerMessages and requireAuthenticatedUser', () => {
    expect(initialize).toHaveBeenCalledTimes(1);
    const initializeArg = initialize.mock.calls[0][0];
    expect(initializeArg.messages).toEqual(messages);
    expect(initializeArg.requireAuthenticatedUser).toEqual(true);
  });
  test('Robbo: human-readable errors for staff, axios errors through robboErrorsMiddleware', () => {
    expect(initRobboErrors).toHaveBeenCalledWith({ app: 'ora-grading', audience: 'staff' });
    expect(initialize.mock.calls[0][0].authMiddleware).toEqual(['robboErrorsMiddleware']);
  });
  test('initialize config loads support url if available', () => {
    const oldEnv = process.env;
    const initializeArg = initialize.mock.calls[0][0];
    delete process.env.SUPPORT_URL;
    initializeArg.handlers.config();
    expect(mergeConfig).toHaveBeenCalledWith({ SUPPORT_URL: null }, app.appName);
    process.env.SUPPORT_URL = testValue;
    initializeArg.handlers.config();
    expect(mergeConfig).toHaveBeenCalledWith({ SUPPORT_URL: testValue }, app.appName);
    process.env = oldEnv;
  });
});
