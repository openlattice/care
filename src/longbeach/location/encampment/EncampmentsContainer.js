// @flow

import React, {
  useCallback,
  useEffect,
  useReducer,
  useState
} from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  PaginationToolbar,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { LangUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import EncampmentMap from './EncampmentMap';
import EncampmentResult from './EncampmentResult';
import { getGeoOptions, searchEncampmentLocations } from './EncampmentActions';
import { ENCAMPMENT_STORE_PATH } from './constants';

import SearchErrorSplash from '../SearchErrorSplash';
import SelectLocationSplash from '../SelectLocationSplash';
import { usePosition, useTimeout } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { FlexRow, MapWrapper, ResultSegment } from '../../styled';

const { isNonEmptyString } = LangUtils;

const MAX_HITS = 20;
const INITIAL_STATE = {
  page: 0,
  start: 0,
  selectedOption: undefined
};

const SearchIcon = <FontAwesomeIcon icon={faSearch} fixedWidth />;
const GroupHeading = () => (<div style={{ borderBottom: '1px solid #E6E6EB' }} />);

const StyledContentWrapper = styled(ContentWrapper)`
  justify-content: space-between;
`;

const StyledSearchResults = styled(SearchResults)`
  margin: auto 0;
`;

const AbsoluteWrapper = styled.div`
  position: absolute;
  top: 0;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'selectLocation': {
      return {
        page: 0,
        selectedOption: action.payload,
        start: 0
      };
    }
    case 'page': {
      const { page, start } = action.payload;
      return { ...state, page, start };
    }
    default:
      throw new Error();
  }
};

const EncampmentsContainer = () => {

  const searchResults = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'fetchState']));
  const optionsFetchState = useSelector((store) => store
    .getIn([...ENCAMPMENT_STORE_PATH, 'options', 'geo', 'fetchState']));
  const options = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'options', 'geo', 'data']));
  const dispatch = useDispatch();
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);

  const {
    page,
    start,
    selectedOption
  } = state;
  const [address, setAddress] = useState();
  const [currentPosition] = usePosition();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions({ address, currentPosition }));
    }
  }, [dispatch, address, currentPosition]);

  useTimeout(fetchGeoOptions, 300);

  useEffect(() => {
    if (currentPosition.coords) {
      const { latitude, longitude } = currentPosition.coords;
      stateDispatch({
        type: 'selectLocation',
        payload: {
          label: 'Current Location',
          value: `${latitude},${longitude}`,
          lat: latitude,
          lon: longitude
        }
      });
    }
  }, [
    currentPosition
  ]);

  useEffect(() => {
    const newSearchInputs = Map({
      selectedOption
    });
    const hasValues = isPlainObject(selectedOption);

    if (hasValues) {
      dispatch(searchEncampmentLocations({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  }, [dispatch, selectedOption, start]);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;
  const error = fetchState === RequestStates.FAILURE;
  const isFetchingOptions = optionsFetchState === RequestStates.PENDING;
  const hasPosition = !!currentPosition.coords;

  const filterOption = () => true;

  const handleChange = (payload) => {
    stateDispatch({ type: 'selectLocation', payload });
  };

  const onPageChange = ({ page: newPage, start: startRow }) => {
    stateDispatch({
      type: 'page',
      payload: { page: newPage, start: startRow }
    });
  };

  const optionsWithMyLocation = options.toJS();
  optionsWithMyLocation.push({
    options: [
      { label: 'Current Location', value: 'Current Location' }
    ]
  });

  return (
    <ContentOuterWrapper>
      <ContentWrapper padding="none">
        <MapWrapper>
          <EncampmentMap
              currentPosition={currentPosition}
              selectedOption={selectedOption}
              searchResults={searchResults} />
        </MapWrapper>
        <AbsoluteWrapper>
          <ContentWrapper>
            <Card>
              <ResultSegment vertical>
                <form>
                  <div>
                    <FlexRow>
                      <Select
                          components={{ GroupHeading }}
                          filterOption={filterOption}
                          hideDropdownIcon
                          inputIcon={SearchIcon}
                          inputId="address"
                          inputValue={address}
                          isClearable
                          isLoading={isFetchingOptions}
                          onChange={handleChange}
                          onInputChange={setAddress}
                          options={optionsWithMyLocation}
                          placeholder="Search Locations"
                          value={selectedOption} />
                    </FlexRow>
                  </div>
                </form>
              </ResultSegment>
            </Card>
          </ContentWrapper>
        </AbsoluteWrapper>
        <StyledContentWrapper>
          {
            (!hasPosition && !hasSearched) && (
              <SelectLocationSplash />
            )
          }
          {
            error
              ? <SearchErrorSplash />
              : (
                <StyledSearchResults
                    hasSearched={hasSearched}
                    isLoading={isLoading}
                    resultComponent={EncampmentResult}
                    results={searchResults} />
              )
          }
          {
            hasSearched && (
              <PaginationToolbar
                  page={page}
                  count={totalHits}
                  onPageChange={onPageChange}
                  rowsPerPage={MAX_HITS} />
            )
          }
        </StyledContentWrapper>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default EncampmentsContainer;
