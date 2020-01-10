// @flow

import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  CardStack,
  Input,
  Label,
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import PersonResult from '../people/LongBeachPersonResult';
import { useInput } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { searchPeople } from '../../containers/people/PeopleActions';
import { isNonEmptyString } from '../../utils/LangUtils';
import { media } from '../../utils/StyleUtils';

const InputGrid = styled.div`
  align-items: flex-start;
  display: grid;
  flex: 1;
  grid-auto-flow: column;
  grid-gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

const LongBeachLocationContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['location', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['location', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['location', 'fetchState']));
  const searchInputs = useSelector((store) => store.getIn(['location', 'searchInputs']));
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [locationName, setLocationName] = useInput(searchInputs.get('locationName'));
  const [address, setAddress] = useInput(searchInputs.get('address'));
  const [address2, setAddress2] = useInput(searchInputs.get('address2'));
  const [city, setCity] = useInput(searchInputs.get('city'));
  const [stateInitials, setStateInitials] = useInput(searchInputs.get('stateInitials'));
  const [zip, setZip] = useInput(searchInputs.get('zip'));

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      address,
      address2,
      city,
      locationName,
      stateInitials,
      zip,
    });

    const hasValues = newSearchInputs.some(isNonEmptyString);

    if (hasValues) {
      dispatch(searchPeople({
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
              <Title>
                Search People
              </Title>
              <form>
                <InputGrid>
                  <div>
                    <Label htmlFor="location-name">Location Name</Label>
                    <Input
                        id="location-name"
                        value={locationName}
                        onChange={setLocationName} />
                  </div>
                  <div>
                    <Label htmlFor="address-line-1">Address Line 1</Label>
                    <Input
                        id="address-line-1"
                        value={address}
                        onChange={setAddress} />
                  </div>
                  <div>
                    <Label htmlFor="address-line-2">Address Line 2</Label>
                    <Input
                        id="address-line-2"
                        value={address2}
                        onChange={setAddress2} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={city}
                        onChange={setCity} />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        value={stateInitials}
                        onChange={setStateInitials} />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip</Label>
                    <Input
                        id="zip"
                        value={zip}
                        onChange={setZip} />
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
              resultComponent={PersonResult}
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
