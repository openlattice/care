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

const SearchPeopleContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['people', 'peopleSearchResults'], List()));
  const fetchState = useSelector((store) => store.getIn(['people', 'fetchState']));
  const searchFields = useSelector((store) => store.getIn(['people', 'searchFields']));
  const dispatch = useDispatch();

  const [dob, setDob] = useState(searchFields.get('dob'));
  const [firstName, setFirstName] = useInput(searchFields.get('firstName'));
  const [lastName, setLastName] = useInput(searchFields.get('lastName'));

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

  const handleOnSearch = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const searchInputs = Map({
      lastName,
      firstName,
      dob
    });

    const hasValues = searchInputs.some(isNonEmptyString);

    if (hasValues) {
      dispatch(searchPeople(searchInputs));
    }
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
              hasSearched={fetchState !== RequestStates.STANDBY}
              isLoading={isLoading}
              resultComponent={PersonResult}
              results={searchResults}
              title="Search People" />
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SearchPeopleContainer;
