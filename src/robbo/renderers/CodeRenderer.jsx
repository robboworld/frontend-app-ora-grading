/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 *
 * Text files and program code in answers (.txt, .py, .ino, .cpp, .js, .html…): shown as text,
 * code with syntax highlighting (highlight.js loads on demand). Only the first PREVIEW_LIMIT
 * bytes are read, so a huge file cannot freeze the grader's tab; the rest is in the download.
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useIntl } from '@edx/frontend-platform/i18n';

import { ErrorStatuses } from 'data/constants/requests';

import { formatFileSize } from '../fileSize';
import { languageOf } from './languages';
import messages from './messages';

export const PREVIEW_LIMIT = 1024 * 1024;
// Highlighting a long text would freeze the page: above this it stays plain.
const HIGHLIGHT_LIMIT = 300000;

class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

/**
 * The first `limit` bytes of the file as text: { text, truncated }.
 * Stops the download once the limit is read.
 */
export const fetchTextHead = async (url, limit, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new HttpError(response.status);
  }
  const decoder = new TextDecoder();
  if (!response.body || !response.body.getReader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    return { text: decoder.decode(bytes.subarray(0, limit)), truncated: bytes.length > limit };
  }
  const reader = response.body.getReader();
  let text = '';
  let received = 0;
  for (;;) {
    // eslint-disable-next-line no-await-in-loop -- chunks arrive one after another
    const { done, value } = await reader.read();
    if (done) {
      return { text: text + decoder.decode(), truncated: false };
    }
    if (received >= limit) { // a file of exactly `limit` bytes ends with `done` above
      reader.cancel();
      return { text: text + decoder.decode(), truncated: true };
    }
    const chunk = value.subarray(0, limit - received);
    received += chunk.length;
    text += decoder.decode(chunk, { stream: true });
    if (chunk.length < value.length) {
      reader.cancel();
      return { text: text + decoder.decode(), truncated: true };
    }
  }
};

const CodeRenderer = ({
  url, fileName, onError, onSuccess,
}) => {
  const intl = useIntl();
  const [content, setContent] = useState(null);
  const [highlighted, setHighlighted] = useState(null);
  // FileRenderer passes new callbacks on every render; the file is fetched once per url.
  const callbacks = useRef({ onError, onSuccess });
  callbacks.current = { onError, onSuccess };

  useEffect(() => {
    const controller = new AbortController();
    setContent(null);
    setHighlighted(null);
    fetchTextHead(url, PREVIEW_LIMIT, controller.signal)
      .then((head) => {
        setContent(head);
        callbacks.current.onSuccess();
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          callbacks.current.onError(error.status || ErrorStatuses.serverError);
        }
      });
    return () => controller.abort();
  }, [url]);

  const language = languageOf(fileName);
  useEffect(() => {
    if (!content || !language || content.text.length > HIGHLIGHT_LIMIT) {
      return undefined;
    }
    let cancelled = false;
    import(/* webpackChunkName: "robbo-highlight" */ './highlighter')
      .then(({ default: hljs }) => {
        if (!cancelled) {
          setHighlighted(hljs.highlight(content.text, { language, ignoreIllegals: true }).value);
        }
      })
      .catch(() => {}); // plain text stays
    return () => { cancelled = true; };
  }, [content, language]);

  if (content === null) {
    return null;
  }
  return (
    <>
      {content.truncated && (
        <p className="robbo-code-renderer__truncated">
          {intl.formatMessage(messages.previewTruncated, { size: formatFileSize(intl, PREVIEW_LIMIT) })}
        </p>
      )}
      <pre className={classNames('robbo-code-renderer', { 'is-plain': !language })}>
        {highlighted === null ? (
          <code>{content.text}</code>
        ) : (
          // highlight.js escapes the source; the markup is its own <span class="hljs-…">.
          // eslint-disable-next-line react/no-danger
          <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted }} />
        )}
      </pre>
    </>
  );
};

CodeRenderer.defaultProps = {
  fileName: '',
};

CodeRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CodeRenderer;
