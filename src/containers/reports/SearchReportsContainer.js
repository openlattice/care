// @flow

import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  CardStack,
  DatePicker,
  Label,
  PaginationToolbar,
  SearchResults,
  Select,
  StyleUtils
} from 'lattice-ui-kit';
import { LangUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import ReportResult from './ReportResult';
import { getReportsByDateRange, getReportsByDateRangeV2 } from './ReportsActions';
import { reportLabels } from './constants';
import { REPORT_TYPE_OPTIONS } from './crisis/schemas/constants';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';

const { isNonEmptyString } = LangUtils;
const { media } = StyleUtils;

const InputGrid = styled.div`
  align-items: flex-start;
  display: grid;
  flex: 1;
  grid-auto-flow: column;
  grid-gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  ${media.phone`
    grid-gap: 5px;
    grid-auto-flow: row;
    grid-template-columns: none;
  `}
`;

const Title = styled.h1`
  display: flex;
  font-size: 18px;
  font-weight: normal;
  margin: 0;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const MAX_HITS = 20;

const SearchReportsContainer = () => {

  const dispatch = useDispatch();
  const totalHits = useSelector((store) => store.getIn(['reports', 'totalHits'], 0));
  const searchResults = useSelector((store) => store.getIn(['reports', 'reportsByDateRange'], List()));
  const fetchState = useSelector((store) => store.getIn(['reports', 'fetchState']));
  const [dateEnd, setDateEnd] = useState();
  const [dateStart, setDateStart] = useState();
  const [reportType, setReportType] = useState(REPORT_TYPE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [settings] = useAppSettings();

  const getReportsAction = settings.get('v2') ? getReportsByDateRangeV2 : getReportsByDateRange;

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      dateEnd,
      dateStart,
      reportType,
      maxHits: MAX_HITS,
      start,
    });

    const hasValues = newSearchInputs.some(isNonEmptyString);

    if (hasValues) {
      dispatch(getReportsAction({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  };

  const handleOnSearch = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSearch();
    setPage(1);
  };

  const onPageChange = ({ page: newPage, start }) => {
    dispatchSearch(start);
    setPage(newPage);
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Card>
            <CardSegment vertical>
              <Title>Search Reports</Title>
              <form>
                <InputGrid>
                  <FlexColumn>
                    <Label htmlFor="date-start">Date Start</Label>
                    <DatePicker id="date-start" onChange={setDateStart} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="date-end">Date End</Label>
                    <DatePicker id="date-end" onChange={setDateEnd} />
                  </FlexColumn>
                  {
                    settings.get('v2') && (
                      <FlexColumn>
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select
                            inputId="report-type"
                            options={REPORT_TYPE_OPTIONS}
                            onChange={(option) => setReportType(option)}
                            value={reportType} />
                      </FlexColumn>
                    )
                  }
                  <FlexColumn>
                    <Label stealth>Search</Label>
                    <Button
                        color="primary"
                        isLoading={isLoading}
                        type="submit"
                        onClick={handleOnSearch}>
                      Search
                    </Button>
                  </FlexColumn>
                </InputGrid>
              </form>
            </CardSegment>
          </Card>
          <SearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={ReportResult}
              resultLabels={reportLabels}
              results={searchResults} />
          {
            hasSearched && (
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            )
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SearchReportsContainer;
