/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '@edx/frontend-platform/react';

import store from 'data/store';
import {
  APP_READY,
  APP_INIT_ERROR,
  initialize,
  subscribe,
  mergeConfig,
} from '@edx/frontend-platform';

import messages from './i18n';
import {
  initRobboErrors, RobboErrorBoundary, RobboErrorPage, robboErrorsMiddleware,
} from './robbo-errors';

import App from './App';

// Robbo: human-readable errors with a code and number (src/robbo-errors).
initRobboErrors({ app: 'ora-grading', audience: 'staff' });

subscribe(APP_READY, () => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <AppProvider store={store} wrapWithRouter={false}>
        <RobboErrorBoundary>
          <App />
        </RobboErrorBoundary>
      </AppProvider>
    </StrictMode>,
  );
});

// PubSub calls back with (topic, data): the error is the second argument.
subscribe(APP_INIT_ERROR, (message, error) => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <RobboErrorPage error={error} startup />
    </StrictMode>,
  );
});

export const appName = 'OraGradingAppConfig';

initialize({
  authMiddleware: [robboErrorsMiddleware],
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL || null,
      }, appName);
    },
  },
  messages,
  requireAuthenticatedUser: true,
});
