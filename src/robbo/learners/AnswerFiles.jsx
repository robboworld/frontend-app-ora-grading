/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Files of a response: every file can be downloaded under its own name (the LMS storage
 * names downloads after the assignment id), previewable ones are shown in full width below.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';

import { Button, Icon } from '@openedx/paragon';
import { Download } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { FileRenderer, isSupported } from 'components/FilePreview';
import { downloadFile } from 'data/redux/thunkActions/download';

import { formatFileSize } from '../fileSize';
import messages from './messages';

const FileDownloadButton = ({ file }) => {
  const intl = useIntl();
  const [isPending, setIsPending] = useState(false);
  const size = typeof file.size === 'number' ? formatFileSize(intl, file.size) : '';
  const save = () => {
    setIsPending(true);
    downloadFile(file)
      // The type comes from the learner's upload; saved as plain bytes it is never opened as a
      // page of this site, even where FileSaver falls back to opening the blob.
      .then((blob) => FileSaver.saveAs(new Blob([blob], { type: 'application/octet-stream' }), file.name))
      // The storage link still works on its own (an attachment: the page stays), named after
      // the assignment id.
      .catch(() => window.location.assign(file.downloadUrl))
      .finally(() => setIsPending(false));
  };
  return (
    <Button
      variant="outline-primary"
      size="sm"
      className="robbo-file-download"
      disabled={isPending}
      onClick={save}
      aria-label={intl.formatMessage(messages.downloadFile, { name: file.name, size })}
    >
      <Icon src={Download} className="robbo-file-download__icon" />
      <span className="robbo-file-download__name">{file.name}</span>
      {size && <span className="robbo-file-download__size">{size}</span>}
    </Button>
  );
};

FileDownloadButton.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    downloadUrl: PropTypes.string.isRequired,
    size: PropTypes.number,
  }).isRequired,
};

const AnswerFiles = ({ files }) => {
  const intl = useIntl();
  if (!files.length) {
    return null;
  }
  return (
    <section className="robbo-answer-files">
      <h4 className="robbo-answer__section-heading">
        {intl.formatMessage(messages.filesHeading, { count: files.length })}
      </h4>
      <ul className="robbo-answer-files__downloads">
        {files.map((file) => (
          <li key={file.downloadUrl || file.name}><FileDownloadButton file={file} /></li>
        ))}
      </ul>
      {files.filter(isSupported).map((file) => (
        <FileRenderer key={file.downloadUrl || file.name} file={file} />
      ))}
    </section>
  );
};

AnswerFiles.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    downloadUrl: PropTypes.string.isRequired,
    description: PropTypes.string,
    size: PropTypes.number,
  })).isRequired,
};

export default AnswerFiles;
