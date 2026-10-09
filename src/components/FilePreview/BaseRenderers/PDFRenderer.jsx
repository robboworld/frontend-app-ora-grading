// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Icon, Form, ActionRow, IconButton,
} from '@openedx/paragon';
import { ChevronLeft, ChevronRight } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import robboMessages from 'robbo/messages';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { rendererHooks } from './pdfHooks';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/**
 * <PDFRenderer />
 */
export const PDFRenderer = ({
  onError,
  onSuccess,
  url,
}) => {
  const intl = useIntl();
  const {
    pageNumber,
    numPages,
    relativeHeight,
    wrapperRef,
    onDocumentLoadSuccess,
    onLoadPageSuccess,
    onDocumentLoadError,
    onInputPageChange,
    onNextPageButtonClick,
    onPrevPageButtonClick,
    hasNext,
    hasPrev,
  } = rendererHooks({ onError, onSuccess });

  return (
    <div ref={wrapperRef} className="pdf-renderer">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {/* <Outline /> */}
        <div className="page-wrapper" style={{ height: relativeHeight }}>
          <Page pageNumber={pageNumber} onLoadSuccess={onLoadPageSuccess} />
        </div>
      </Document>
      <ActionRow className="d-flex justify-content-center m-0">
        <IconButton
          size="inline"
          alt={intl.formatMessage(robboMessages.pdfPrevious)}
          iconAs={Icon}
          src={ChevronLeft}
          disabled={!hasPrev}
          onClick={onPrevPageButtonClick}
        />
        <Form.Group className="d-flex align-items-center m-0">
          <Form.Label isInline>{intl.formatMessage(robboMessages.pdfPage)}&nbsp;</Form.Label>
          <Form.Control
            type="number"
            min={0}
            max={numPages}
            value={pageNumber}
            onChange={onInputPageChange}
          />
          <Form.Label isInline>&nbsp;{intl.formatMessage(robboMessages.pdfPageOf, { numPages })}</Form.Label>
        </Form.Group>
        <IconButton
          size="inline"
          alt={intl.formatMessage(robboMessages.pdfNext)}
          iconAs={Icon}
          src={ChevronRight}
          disabled={!hasNext}
          onClick={onNextPageButtonClick}
        />
      </ActionRow>
    </div>
  );
};

PDFRenderer.defaultProps = {};

PDFRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PDFRenderer;
