/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Data of «Проверка по учащимся»: the course (assignments, learners) and the selected learner's
 * responses. Both reload quietly when a grade is submitted or grading stops, so counters and
 * statuses stay current.
 */
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from 'data/redux';

import * as api from './api';

export const loadStates = {
  loading: 'loading',
  loaded: 'loaded',
  failed: 'failed',
};

/**
 * Fetch with a quiet reload: a reload keeps the shown data while it runs, and only the
 * newest request may update the state (fast switching between learners).
 */
const useFetched = (fetcher, key) => {
  const [state, setState] = useState({ status: loadStates.loading, data: null });
  const requestSeq = useRef(0);

  const load = useCallback(({ quiet = false } = {}) => {
    if (key === null) {
      return;
    }
    requestSeq.current += 1;
    const seq = requestSeq.current;
    if (!quiet) {
      setState({ status: loadStates.loading, data: null });
    }
    fetcher()
      .then((data) => {
        if (seq === requestSeq.current) {
          setState({ status: loadStates.loaded, data });
        }
      })
      .catch(() => {
        if (seq === requestSeq.current) {
          setState((current) => (quiet && current.data ? current : { status: loadStates.failed, data: null }));
        }
      });
  }, [fetcher, key]);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
};

export const useCourse = (courseId) => {
  const dispatch = useDispatch();
  const fetcher = useCallback(() => api.fetchCourse(courseId).then((data) => {
    // The stock header and demo mode read these from the app state.
    dispatch(actions.app.loadCourseMetadata(data.courseMetadata));
    dispatch(actions.app.loadIsEnabled(data.isEnabled));
    return data;
  }), [courseId, dispatch]);
  return useFetched(fetcher, courseId);
};

export const useLearner = (courseId, username) => {
  const fetcher = useCallback(() => api.fetchLearner(courseId, username), [courseId, username]);
  return useFetched(fetcher, username);
};

const searchParams = () => new URLSearchParams(window.location.search);

/**
 * Selected learner, kept in `?learner=` so a reload or a shared link opens the same learner.
 * Defaults to the first learner of the list (the API puts those waiting for a grade first).
 */
export const useSelectedLearner = (learners) => {
  const [username, setUsername] = useState(() => searchParams().get('learner'));

  useEffect(() => {
    if (!username && learners?.length) {
      setUsername(learners[0].username);
    }
  }, [learners, username]);

  useEffect(() => {
    if (!username) {
      return;
    }
    const params = searchParams();
    if (params.get('learner') !== username) {
      params.set('learner', username);
      window.history.replaceState(window.history.state, '', `${window.location.pathname}?${params}`);
    }
  }, [username]);

  return [username, setUsername];
};

/** Whether a response of this page is being graded (locked by this grader). */
export const useIsGrading = () => useSelector(selectors.grading.selected.isGrading);

/** Calls `onEnd` when grading of a response ends: grade submitted or grading stopped. */
export const useGradingEnd = (onEnd) => {
  const isGrading = useIsGrading();
  const wasGrading = useRef(isGrading);
  useEffect(() => {
    if (wasGrading.current && !isGrading) {
      onEnd();
    }
    wasGrading.current = isGrading;
  }, [isGrading, onEnd]);
};
