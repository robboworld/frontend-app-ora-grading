// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import { getConfig, getPath } from '@edx/frontend-platform';

const publicPath = getPath(getConfig().PUBLIC_PATH);
export const routePath = () => `${publicPath}:courseId`;

// Robbo: the page path is an assignment (block-v1:…) or, for «Проверка по учащимся», a course
// (course-v1:…, src/robbo/learners). There answers of several assignments share one page, so the
// grading API targets the assignment of the answer being graded (setOraLocation).
let oraLocation = null;
export const pathId = () => decodeURIComponent(window.location.pathname).replace(publicPath, '');
export const setOraLocation = (id) => { oraLocation = id; };
export const locationId = () => oraLocation || pathId();
