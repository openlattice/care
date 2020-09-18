// @flow
import React, { useEffect, useState } from 'react';

import { List } from 'immutable';
import {
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { explorePeople } from './ExploreActions';
import { ExploreResultsWrapper } from './styled';

import Accordion from '../../components/accordion';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { FILE_FQN } = APP_TYPES_FQNS;

const MAX_HITS = 10;

const FileResult = ({ result }) => <div style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, true, 2)}</div>;

const ExploreFileResults = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((store) => store.getIn(['explore', FILE_FQN, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['explore', FILE_FQN, 'totalHits'], 0));
  const searchTerm = useSelector((store) => store.getIn(['explore', FILE_FQN, 'searchTerm']));
  const fetchState = useSelector((store) => store.getIn(['explore', FILE_FQN, 'fetchState']));
  const [page, setPage] = useState(0);
  // const [modalState, modalDispatch] = useReducer(reducer, INITIAL_STATE);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const dispatchSearch = (start = 0) => {
    if (searchTerm.trim().length) {
      dispatch(explorePeople({
        searchTerm: searchTerm.trim(),
        start,
        maxHits: MAX_HITS
      }));
    }
  };

  const onPageChange = ({ page: newPage, start }) => {
    dispatchSearch(start);
    setPage(newPage);
  };

  const caption = isLoading ? '' : `(${totalHits} results)`;

  if (hasSearched) {
    return (
      <div>
        <Accordion>
          <div caption={caption} headline="Files" defaultOpen>
            <ExploreResultsWrapper>
              <SearchResults
                  hasSearched={hasSearched}
                  isLoading={isLoading}
                  // onResultClick={handleOpenReportSelection}
                  resultComponent={FileResult}
                  results={searchResults} />
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            </ExploreResultsWrapper>
          </div>
        </Accordion>
      </div>
    );
  }
  return null;
};

export default ExploreFileResults;
