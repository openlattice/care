// @flow

import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map, fromJS } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  CardStack,
  DatePicker,
  Input,
  Label,
  PaginationToolbar,
  PlusButton,
  SearchResults,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import PersonResult from './PersonResult';
import { searchPeople } from './PeopleActions';

import { useInput } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { CRISIS_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import { isNonEmptyString } from '../../utils/LangUtils';
import { media } from '../../utils/StyleUtils';
import { SUBJECT_INFORMATION } from '../../utils/constants/CrisisReportConstants';
import { setInputValues } from '../pages/subjectinformation/Actions';

const NewPersonButton = styled(PlusButton)`
  margin-left: auto;
  margin-bottom: 10px;
  padding: 5px 20px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-gap: 20px 30px;
  flex: 1;

  grid-auto-flow: column;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: flex-start;

  ${media.phone`
    grid-gap: 10px;
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

const SearchPeopleContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['people', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['people', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['people', 'fetchState']));
  const searchInputs = useSelector((store) => store.getIn(['people', 'searchInputs']));
  const dispatch = useDispatch();

  const [dob, setDob] = useState(searchInputs.get('dob'));
  const [page, setPage] = useState(0);
  const [firstName, setFirstName] = useInput(searchInputs.get('firstName'));
  const [lastName, setLastName] = useInput(searchInputs.get('lastName'));

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const handleNewPerson = () => {
    const person = fromJS({
      [SUBJECT_INFORMATION.DOB]: dob,
      [SUBJECT_INFORMATION.FIRST]: firstName,
      [SUBJECT_INFORMATION.LAST]: lastName,
      [SUBJECT_INFORMATION.IS_NEW_PERSON]: true
    });

    dispatch(setInputValues(person));
    dispatch(goToPath(`${CRISIS_PATH}/1`));
  };

  const dispatchSearch = (start = 0) => {
    const newSearchInputs = Map({
      lastName,
      firstName,
      dob
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
                <NewPersonButton
                    disabled={fetchState !== RequestStates.SUCCESS}
                    onClick={handleNewPerson}>
                  New Person
                </NewPersonButton>
              </Title>
              <form>
                <InputGrid>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                        id="last-name"
                        value={lastName}
                        onChange={setLastName} />
                  </div>
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                        id="first-name"
                        value={firstName}
                        onChange={setFirstName} />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <DatePicker id="dob" value={dob} onChange={setDob} />
                  </div>
                  <div>
                    <Label stealth>Submit</Label>
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        mode="primary"
                        onClick={handleOnSearch}>
                      Search People
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

export default SearchPeopleContainer;
