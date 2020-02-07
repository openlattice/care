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
  StyleUtils
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import ReportResult from './ReportResult';
import { getReportsByDateRange } from './ReportsActions';
import { reportLabels } from './constants';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { isNonEmptyString } from '../../utils/LangUtils';

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
  const [page, setPage] = useState(0);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      dateEnd,
      dateStart,
      maxHits: MAX_HITS,
      start,
    });

    const hasValues = newSearchInputs.some(isNonEmptyString);

    if (hasValues) {
      dispatch(getReportsByDateRange({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  };

  const handleOnSearch = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSearch();
    setPage(0);
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
                  <FlexColumn>
                    <Label stealth>Search</Label>
                    <Button
                        mode="primary"
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
