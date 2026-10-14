/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Video answers (mp4, webm, mov…) play in the preview. The LMS file storage sends the whole
 * file without Range support, so seeking may only work once the video has loaded.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { ErrorStatuses } from 'data/constants/requests';

const VideoRenderer = ({
  url, fileName, onError, onSuccess,
}) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption -- learners upload videos without captions
  <video
    aria-label={fileName}
    className="robbo-video-renderer"
    controls
    preload="metadata"
    src={url}
    onLoadedMetadata={() => onSuccess()}
    onError={() => onError(ErrorStatuses.serverError)}
  />
);

VideoRenderer.defaultProps = {
  fileName: '',
};

VideoRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default VideoRenderer;
