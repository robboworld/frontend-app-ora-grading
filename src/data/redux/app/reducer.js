// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import { StrictDict } from 'utils';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courseMetadata: {
    name: '',
    number: '',
    org: '',
    courseId: '',
  },
  // Robbo: null until the server answers (initialize or the «Проверка по учащимся» API), so the
  // demo warning does not flash on every page load while the request is in flight.
  isEnabled: null,
  isGrading: false,
  oraMetadata: {
    prompt: '',
    name: '',
    type: '',
    rubricConfig: null,
  },
  showReview: false,
  showRubric: false,
};

// eslint-disable-next-line no-unused-vars
const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loadIsEnabled: (state, { payload }) => ({ ...state, isEnabled: payload }),
    loadCourseMetadata: (state, { payload }) => ({ ...state, courseMetadata: payload }),
    loadOraMetadata: (state, { payload }) => ({ ...state, oraMetadata: payload }),
    setShowReview: (state, { payload }) => ({
      ...state,
      showReview: payload,
      showRubric: state.showRubric && payload, // Hide rubric when closing review window
    }),
    setShowRubric: (state, { payload }) => ({ ...state, showRubric: payload }),
    toggleShowRubric: (state) => ({ ...state, showRubric: !state.showRubric }),
  },
});

const actions = StrictDict(app.actions);

const { reducer } = app;

export {
  actions,
  initialState,
  reducer,
};
