// @flow

import React, { useCallback, useState } from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { faLocation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  CardStack,
  IconButton,
  Label,
  PaginationToolbar,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import LongBeachLocationResult from './LongBeachLocationResult';
import { getGeoOptions, searchLBLocations } from './LongBeachLocationsActions';

import { usePosition, useTimeout } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { isNonEmptyString } from '../../utils/LangUtils';
import { media } from '../../utils/StyleUtils';
import { FlexRow } from '../styled';

const InputGrid = styled.div`
  align-items: flex-start;
  display: grid;
  flex: 1;
  grid-auto-flow: column;
  grid-gap: 10px;
  grid-template-columns: 3fr 1fr;
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

const MAX_HITS = 20;

const LocationIcon = <FontAwesomeIcon icon={faLocation} fixedWidth />;

const LongBeachLocationContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['longBeach', 'locations', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['longBeach', 'locations', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['longBeach', 'locations', 'fetchState']));
  const searchInputs = useSelector((store) => store.getIn(['longBeach', 'locations', 'searchInputs']));
  const optionsFetchState = useSelector((store) => store.getIn(['longBeach', 'locations', 'options', 'fetchState']));
  const options = useSelector((store) => store.getIn(['longBeach', 'locations', 'options', 'data']));
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [address, setAddress] = useState();
  const [selectedOption, setSelectedOption] = useState(searchInputs.get('selectedOption'));
  const [currentLocation, setCurrentLocation] = useState(searchInputs.get('currentLocation'));
  const position = usePosition();

  const fetchGeoOptions = useCallback(() => {
    if (isNonEmptyString(address)) {
      dispatch(getGeoOptions(address));
    }
  }, [dispatch, address]);

  useTimeout(fetchGeoOptions, 300);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;
  const isFetchingOptions = optionsFetchState === RequestStates.PENDING;

  const filterOption = () => true;

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      selectedOption,
      currentLocation
    });

    const hasValues = isPlainObject(selectedOption) || isNonEmptyString(currentLocation);

    if (hasValues) {
      dispatch(searchLBLocations({
        searchInputs: newSearchInputs,
        start,
        maxHits: MAX_HITS
      }));
    }
  };

  const handleCurrentLocation = () => {
    const { latitude, longitude } = position;
    if (latitude && longitude) {
      setSelectedOption({
        label: 'Current Location',
        value: `${latitude},${longitude}`,
        lat: latitude,
        lon: longitude
      });
      dispatchSearch();
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
              <Title>
                Search By Location
              </Title>
              <form>
                <InputGrid>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <FlexRow>
                      <Select
                          autoFocus
                          filterOption={filterOption}
                          inputId="address"
                          inputValue={address}
                          isClearable
                          isLoading={isFetchingOptions}
                          onChange={setSelectedOption}
                          onInputChange={setAddress}
                          options={options.toJS()}
                          value={selectedOption} />
                      <IconButton
                          disabled={!!position.error}
                          icon={LocationIcon}
                          onClick={handleCurrentLocation} />
                    </FlexRow>
                  </div>
                  <div>
                    <Label stealth>Submit</Label>
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        mode="primary"
                        onClick={handleOnSearch}>
                      Search
                    </Button>
                  </div>
                </InputGrid>
              </form>
            </CardSegment>
          </Card>
          <SearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={LongBeachLocationResult}
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

export default LongBeachLocationContainer;
