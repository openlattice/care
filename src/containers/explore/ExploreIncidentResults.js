// @flow
import React, { useEffect, useState } from 'react';

import { List } from 'immutable';
import {
  PaginationToolbar,
  SearchResults,
  Spinner,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import IncidentResult from './IncidentResult';
import { exploreIncidents } from './ExploreActions';
import { ExploreResultsWrapper, NoResults } from './styled';

import Accordion from '../../components/accordion';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { INCIDENT_FQN } = APP_TYPES_FQNS;

const MAX_HITS = 10;

const ExploreIncidentResults = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((store) => store.getIn(['explore', INCIDENT_FQN, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['explore', INCIDENT_FQN, 'totalHits'], 0));
  const searchTerm = useSelector((store) => store.getIn(['explore', INCIDENT_FQN, 'searchTerm']));
  const fetchState = useSelector((store) => store.getIn(['explore', INCIDENT_FQN, 'fetchState']));
  const [page, setPage] = useState(0);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const dispatchSearch = (start = 0) => {
    if (searchTerm.trim().length) {
      dispatch(exploreIncidents({
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
          <div caption={caption} headline="Incidents" defaultOpen={false}>
            <ExploreResultsWrapper>
              <SearchResults
                  hasSearched={hasSearched}
                  isLoading={isLoading}
                  noResults={NoResults}
                  resultComponent={IncidentResult}
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

export default ExploreIncidentResults;
