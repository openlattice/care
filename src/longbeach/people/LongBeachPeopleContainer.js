// @flow

import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardStack,
  Checkbox,
  DatePicker,
  Input,
  Label,
  PaginationToolbar,
  SearchResults,
  Select,
} from 'lattice-ui-kit';
import { LangUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import PersonResult from './LongBeachPersonResult';
import { searchLBPeople } from './LongBeachPeopleActions';

import Accordion from '../../components/accordion';
import AdvancedHeader from '../../containers/people/AdvancedHeader';
import MetaphoneLabel from '../../containers/people/MetaphoneLabel';
import { useInput } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { ethnicityOptions, raceOptions, sexOptions } from '../../containers/profile/constants';
import { media } from '../../utils/StyleUtils';
import { ResultSegment } from '../styled';

const { isNonEmptyString } = LangUtils;

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

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexEnd = styled.div`
  align-self: flex-end;
`;

const MAX_HITS = 20;

const LongBeachPeopleContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['longBeach', 'people', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['longBeach', 'people', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['longBeach', 'people', 'fetchState']));
  const searchInputs = useSelector((store) => store.getIn(['longBeach', 'people', 'searchInputs']));
  const dispatch = useDispatch();

  const [dob, setDob] = useState(searchInputs.get('dob'));
  const [ethnicity, setEthnicity] = useState(searchInputs.get('ethnicity'));
  const [firstName, setFirstName] = useInput(searchInputs.get('firstName'));
  const [lastName, setLastName] = useInput(searchInputs.get('lastName'));
  const [metaphone, setSimilar] = useState(searchInputs.get('metaphone', false));
  const [page, setPage] = useState(1);
  const [race, setRace] = useState(searchInputs.get('race'));
  const [sex, setSex] = useState(searchInputs.get('sex'));

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      dob,
      ethnicity,
      firstName,
      lastName,
      metaphone,
      race,
      sex,
    });

    const hasValues = newSearchInputs.some(isNonEmptyString);

    if (hasValues) {
      dispatch(searchLBPeople({
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

  const handleOnSimilar = (e :SyntheticEvent<HTMLInputElement>) => {
    const { currentTarget } = e;
    setSimilar(currentTarget.checked);
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
            <ResultSegment>
              <Title>
                Search People
              </Title>
              <form>
                <InputGrid>
                  <FlexColumn>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                        autoFocus
                        id="last-name"
                        onChange={setLastName}
                        value={lastName} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                        id="first-name"
                        onChange={setFirstName}
                        value={firstName} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <DatePicker id="dob" onChange={setDob} value={dob} />
                  </FlexColumn>
                  <FlexColumn>
                    <Label stealth>Submit</Label>
                    <Button
                        color="primary"
                        fullWidth
                        isLoading={isLoading}
                        onClick={handleOnSearch}
                        type="submit">
                      Search
                    </Button>
                  </FlexColumn>
                </InputGrid>
              </form>
            </ResultSegment>
            <ResultSegment>
              <Accordion>
                <div headline="Additional Fields" titleComponent={AdvancedHeader}>
                  <InputGrid>
                    <FlexColumn>
                      <Label htmlFor="sex">Sex</Label>
                      <Select
                          id="sex"
                          isClearable
                          onChange={(option) => setSex(option)}
                          options={sexOptions}
                          value={sex} />
                    </FlexColumn>
                    <FlexColumn>
                      <Label htmlFor="race">Race</Label>
                      <Select
                          id="race"
                          isClearable
                          onChange={(option) => setRace(option)}
                          options={raceOptions}
                          value={race} />
                    </FlexColumn>
                    <FlexColumn>
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Select
                          id="ethnicity"
                          isClearable
                          onChange={(option) => setEthnicity(option)}
                          options={ethnicityOptions}
                          value={ethnicity} />
                    </FlexColumn>
                    <FlexEnd>
                      <Checkbox
                          checked={metaphone}
                          id="similar"
                          label={MetaphoneLabel}
                          onChange={handleOnSimilar} />
                    </FlexEnd>
                  </InputGrid>
                </div>
              </Accordion>
            </ResultSegment>
          </Card>
          <SearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={PersonResult}
              results={searchResults} />
          {
            hasSearched && (
              <PaginationToolbar
                  count={totalHits}
                  onPageChange={onPageChange}
                  page={page}
                  rowsPerPage={MAX_HITS} />
            )
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default LongBeachPeopleContainer;
