/*
 * @flow
 */

import React, { useState } from 'react';

import styled from 'styled-components';
import {
  Button,
  DatePicker,
  Label,
  Select,
  StyleUtils
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import ExportBulkModal from './ExportBulkModal';
import { exportCrisisCSVByDateRange, exportCrisisXMLByDateRange } from './ExportActions';

import { Header } from '../../../components/layout';
import { REPORT_TYPE_OPTIONS } from '../crisis/schemas/constants';

const { isPending } = ReduxUtils;
const { media } = StyleUtils;

const DateRangeContainer = styled.div`
  align-items: flex-start;
  display: grid;
  flex: 1;
  grid-auto-flow: column;
  grid-gap: 10px;
  ${media.phone`
    grid-gap: 5px;
    grid-auto-flow: row;
    grid-template-columns: none;
  `}
`;

const ButtonRow = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;
const CSV = 'CSV';
const XML = 'XML';
const FORMAT_OPTIONS = [
  { label: XML, value: XML },
  { label: CSV, value: CSV },
];

const ExportBulkContainer = () => {
  const dispatch = useDispatch();
  const [dateEnd, setDateEnd] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [reportType, setReportType] = useState(REPORT_TYPE_OPTIONS[0]);
  const [format, setFormat] = useState(FORMAT_OPTIONS[0]);
  const [isVisible, setIsVisible] = useState(false);
  const fetchState :RequestState = useSelector((state) => state.getIn(['exportBulk', 'fetchState']));

  const handleExport = () => {
    setIsVisible(true);
    if (format.value === CSV) {
      dispatch(exportCrisisCSVByDateRange({
        dateEnd,
        dateStart,
        reportType: reportType.value
      }));
    }
    else {
      dispatch(exportCrisisXMLByDateRange({ dateEnd, dateStart }));
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const pending = isPending(fetchState);

  return (
    <>
      <Header>
        Crisis Downloads
      </Header>
      <form>
        <DateRangeContainer>
          <DatePickerWrapper>
            <Label htmlFor="format">Format</Label>
            <Select
                inputId="format"
                onChange={(option) => setFormat(option)}
                options={FORMAT_OPTIONS}
                value={format} />
          </DatePickerWrapper>
          <DatePickerWrapper>
            <Label htmlFor="start-date">Start Date</Label>
            <DatePicker
                id="start-date"
                onChange={(date) => setDateStart(date)}
                value={dateStart} />
          </DatePickerWrapper>
          <DatePickerWrapper>
            <Label htmlFor="end-date">End Date</Label>
            <DatePicker
                id="end-date"
                onChange={(date) => setDateEnd(date)}
                value={dateEnd} />
          </DatePickerWrapper>
          {
            format.value === CSV && (
              <DatePickerWrapper>
                <Label htmlFor="report-type">Report Type</Label>
                <Select
                    inputId="report-type"
                    onChange={(option) => setReportType(option)}
                    options={REPORT_TYPE_OPTIONS}
                    value={reportType} />
              </DatePickerWrapper>
            )
          }
        </DateRangeContainer>
        <ButtonRow>
          <Button
              color="primary"
              disabled={pending || !dateStart || !dateEnd}
              isLoading={pending}
              onClick={handleExport}
              type="submit">
            Download
          </Button>
        </ButtonRow>
      </form>
      <ExportBulkModal isVisible={isVisible} onClose={handleClose} />
    </>
  );
};

// $FlowFixMe
export default ExportBulkContainer;
