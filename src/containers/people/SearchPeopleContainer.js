// @flow

import React, { useEffect, useReducer, useState } from 'react';

import styled from 'styled-components';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { List, Map } from 'immutable';
import {
  Banner,
  Button,
  CardStack,
  Checkbox,
  Colors,
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

import AdvancedHeader from './AdvancedHeader';
import MetaphoneLabel from './MetaphoneLabel';
import PersonResult from './PersonResult';
import ReportSelectionModal from './ReportSelectionModal';
import { clearSearchResults, searchPeople } from './PeopleActions';

import Accordion from '../../components/accordion';
import { BreadcrumbLink } from '../../components/breadcrumbs';
import { useAppSettings, useInput } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { NEW_PERSON_PATH } from '../../core/router/Routes';
import { refreshPermissions } from '../../core/sagas/permissions/PermissionsActions';
import { media } from '../../utils/StyleUtils';
import { ethnicityOptions, raceOptions, sexOptions } from '../profile/constants';

const { isNonEmptyString } = LangUtils;

const { NEUTRALS } = Colors;
const CANT_FIND_MSG = 'Can\'t find the person you\'re looking for? ';
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

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexEnd = styled.div`
  align-self: flex-end;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid ${NEUTRALS[4]};
`;

const StyledAccordion = styled(Accordion)`
  padding: 10px 0 0;
  justify-content: start;
`;

const BannerContent = styled.span`
  font-size: 0.875rem;
`;

const Centered = styled.div`
  text-align: center;
  font-size: 0.875rem;
`;

const MAX_HITS = 20;

const INITIAL_STATE = {
  selectedPerson: undefined,
  isVisible: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'open': {
      return {
        selectedPerson: action.payload,
        isVisible: true
      };
    }
    case 'close':
      return INITIAL_STATE;
    default:
      return state;
  }
};

const SearchPeopleContainer = () => {

  const searchResults = useSelector((store) => store.getIn(['people', 'hits'], List()));
  const totalHits = useSelector((store) => store.getIn(['people', 'totalHits'], 0));
  const fetchState = useSelector((store) => store.getIn(['people', 'fetchState']));
  const searchInputs = useSelector((store) => store.getIn(['people', 'searchInputs']));
  const dispatch = useDispatch();
  const appSettings = useAppSettings();
  const integratedRMS = appSettings.get('integratedRMS', false);

  const [modalState, modalDispatch] = useReducer(reducer, INITIAL_STATE);
  const [dob, setDob] = useState(searchInputs.get('dob'));
  const [ethnicity, setEthnicity] = useState(searchInputs.get('ethnicity'));
  const [firstName, setFirstName] = useInput(searchInputs.get('firstName'));
  const [lastName, setLastName] = useInput(searchInputs.get('lastName'));
  const [metaphone, setSimilar] = useState(searchInputs.get('metaphone', false));
  const [page, setPage] = useState(0);
  const [race, setRace] = useState(searchInputs.get('race'));
  const [sex, setSex] = useState(searchInputs.get('sex'));
  const [includeRMS, setRMS] = useState(searchInputs.get('includeRMS', !integratedRMS));

  useEffect(() => () => {
    dispatch(clearSearchResults(!integratedRMS));
  }, [dispatch, integratedRMS]);

  const hasSearched = fetchState !== RequestStates.STANDBY;
  const isLoading = fetchState === RequestStates.PENDING;

  const dispatchSearch = (start = 0, rmsFlag = includeRMS) => {
    const newSearchInputs = Map({
      dob,
      ethnicity,
      firstName,
      lastName,
      metaphone,
      race,
      includeRMS: rmsFlag,
      sex,
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

  const handleToggleRMS = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSearch(0, !includeRMS);
    setRMS(!includeRMS);
    setPage(0);
  };

  const handleOnSimilar = (e :SyntheticEvent<HTMLInputElement>) => {
    const { currentTarget } = e;
    setSimilar(currentTarget.checked);
  };

  const onPageChange = ({ page: newPage, start }) => {
    dispatchSearch(start);
    setPage(newPage);
  };

  const handleOpenReportSelection = (result :Map) => {
    modalDispatch({ type: 'open', payload: result });
  };

  const handleCloseReportSelection = () => {
    modalDispatch({ type: 'close' });
  };

  let searchTip = 'Try the advanced search filters';
  const rmsAction = includeRMS ? 'Exclude' : 'Include';
  if (integratedRMS) {
    searchTip = (
      <BreadcrumbLink to="#" onClick={handleToggleRMS}>
        {`${rmsAction} RMS Search Results`}
      </BreadcrumbLink>
    );
  }

  return (
    <ContentOuterWrapper>
      <Button color="error" onClick={() => dispatch(refreshPermissions())}>Refresh Permissions</Button>
      <Panel>
        <ContentWrapper>
          <div>
            <form>
              <InputGrid>
                <FlexColumn>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                      id="last-name"
                      value={lastName}
                      onChange={setLastName} />
                </FlexColumn>
                <FlexColumn>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                      id="first-name"
                      value={firstName}
                      onChange={setFirstName} />
                </FlexColumn>
                <FlexColumn>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <DatePicker id="dob" value={dob} onChange={setDob} />
                </FlexColumn>
                <FlexColumn>
                  <Label stealth>Submit</Label>
                  <Button
                      type="submit"
                      isLoading={isLoading}
                      color="primary"
                      onClick={handleOnSearch}>
                    Search
                  </Button>
                </FlexColumn>
              </InputGrid>
            </form>
          </div>
          <StyledAccordion>
            <div headline="Advanced Search" titleComponent={AdvancedHeader}>
              <InputGrid>
                <FlexColumn>
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                      id="sex"
                      isClearable
                      onChange={(option) => setSex(option)}
                      value={sex}
                      options={sexOptions} />
                </FlexColumn>
                <FlexColumn>
                  <Label htmlFor="race">Race</Label>
                  <Select
                      id="race"
                      isClearable
                      onChange={(option) => setRace(option)}
                      value={race}
                      options={raceOptions} />
                </FlexColumn>
                <FlexColumn>
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Select
                      id="ethnicity"
                      isClearable
                      onChange={(option) => setEthnicity(option)}
                      value={ethnicity}
                      options={ethnicityOptions} />
                </FlexColumn>
                <FlexEnd>
                  <Checkbox
                      id="similar"
                      checked={metaphone}
                      onChange={handleOnSimilar}
                      label={MetaphoneLabel} />
                </FlexEnd>
              </InputGrid>
            </div>
          </StyledAccordion>
        </ContentWrapper>
      </Panel>
      <Banner
          icon={faExclamationTriangle}
          mode="default"
          isOpen={integratedRMS && includeRMS}>
        <BannerContent>These results include RMS-integrated entries</BannerContent>
      </Banner>
      <ContentWrapper>
        <CardStack>
          <SearchResults
              hasSearched={hasSearched}
              isLoading={isLoading}
              resultComponent={PersonResult}
              onResultClick={handleOpenReportSelection}
              results={searchResults} />
          {
            (hasSearched && !isLoading)
              ? (
                <Centered>
                  {CANT_FIND_MSG}
                  <span>
                    {searchTip}
                    {' or '}
                    <BreadcrumbLink to={NEW_PERSON_PATH}>Create a new person</BreadcrumbLink>
                  </span>
                </Centered>
              )
              : null
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
        </CardStack>
        <ReportSelectionModal
            selectedPerson={modalState.selectedPerson}
            isVisible={modalState.isVisible}
            onClose={handleCloseReportSelection} />
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SearchPeopleContainer;
