// @flow
import React, { useEffect, useState } from 'react';

import { List } from 'immutable';
import {
  PaginationToolbar,
  SearchResults,
  Spinner,
  Typography,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import FileResult from './FileResult';
import { exploreFile } from './ExploreActions';
import { ExploreResultsWrapper, NoResults } from './styled';

import Accordion from '../../components/accordion';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { FILE_FQN } = APP_TYPES_FQNS;

const MAX_HITS = 10;

const ExploreFileResults = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((store) => store.getIn(['explore', FILE_FQN, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['explore', FILE_FQN, 'totalHits'], 0));
  const searchTerm = useSelector((store) => store.getIn(['explore', FILE_FQN, 'searchTerm']));
  const fetchState = useSelector((store) => store.getIn(['explore', FILE_FQN, 'fetchState']));
  const [page, setPage] = useState(0);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const dispatchSearch = (start = 0) => {
    if (searchTerm.trim().length) {
      dispatch(exploreFile({
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

  const caption = isLoading ? <Spinner /> : `(${totalHits} results)`;

  if (hasSearched) {
    return (
      <div>
        <Accordion>
          <div caption={caption} headline="Files" defaultOpen={false}>
            <ExploreResultsWrapper>
              <Typography color="textSecondary" gutterBottom>
                For security purposes, all download links expire after 5 minutes from generation.
              </Typography>
              <SearchResults
                  hasSearched={hasSearched}
                  isLoading={isLoading}
                  noResults={NoResults}
                  resultComponent={FileResult}
                  results={searchResults} />
              <PaginationToolbar
                  count={totalHits}
                  onPageChange={onPageChange}
                  page={page}
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
