// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Colors,
  Input,
  Typography,
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import ContactInformationResult from './ContactInformationResult';
import ExploreFileResults from './ExploreFileResults';
import ExploreGenericResults from './ExploreGenericResults';
import ExploreIncidentResults from './ExploreIncidentResults';
import ExplorePeopleResults from './ExplorePeopleResults';
import IdentifyingCharacteristicsResult from './IdentifyingCharacteristicsResult';
import LocationResult from './LocationResult';
import PhysicalAppearanceResult from './PhysicalAppearanceResult';
import {
  clearExploreResults,
  exploreContactInformation,
  exploreFile,
  exploreIdentifyingCharacteristics,
  exploreIncidents,
  exploreLocation,
  explorePeople,
  explorePhysicalAppearances,
} from './ExploreActions';

import { useInput } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  CONTACT_INFORMATION_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
  LOCATION_FQN,
  PHYSICAL_APPEARANCE_FQN,
} = APP_TYPES_FQNS;

const { NEUTRAL } = Colors;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid ${NEUTRAL.N100};
`;

const FlexRow = styled.div`
  display: flex;
  margin: 12px 0;
`;

const StyledInput = styled(Input)`
  > .MuiOutlinedInput-root {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const SearchButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const MAX_HITS = 10;

const ExploreContainer = () => {

  const dispatch = useDispatch();
  useEffect(() => () => dispatch(clearExploreResults()), [dispatch]);
  const [searchTerm, setSearchTerm] = useInput('');

  const dispatchSearch = (start = 0) => {
    if (searchTerm.trim().length) {
      const payload = {
        searchTerm: searchTerm.trim(),
        start,
        maxHits: MAX_HITS
      };

      dispatch(exploreContactInformation(payload));
      dispatch(exploreFile(payload));
      dispatch(exploreIdentifyingCharacteristics(payload));
      dispatch(exploreIncidents(payload));
      dispatch(exploreLocation(payload));
      dispatch(explorePeople(payload));
      dispatch(explorePhysicalAppearances(payload));
    }
  };

  const handleOnSearch = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchSearch();
  };

  return (
    <ContentOuterWrapper>
      <Panel>
        <ContentWrapper>
          <div>
            <Typography variant="h1">Explore</Typography>
          </div>
          <form>
            <FlexRow>
              <StyledInput
                  variant="outlined"
                  id="search-input"
                  value={searchTerm}
                  placeholder="Search by keyword"
                  onChange={setSearchTerm} />
              <SearchButton
                  color="primary"
                  onClick={handleOnSearch}
                  type="submit">
                <FontAwesomeIcon icon={faSearch} fixedWidth />
              </SearchButton>
            </FlexRow>
          </form>
        </ContentWrapper>
      </Panel>
      <ContentWrapper>
        <ExplorePeopleResults />
        <ExploreFileResults />
        <ExploreIncidentResults />
        <ExploreGenericResults
            appType={CONTACT_INFORMATION_FQN}
            resultComponent={ContactInformationResult}
            searchAction={exploreContactInformation}
            title="Contact Information" />
        <ExploreGenericResults
            appType={LOCATION_FQN}
            resultComponent={LocationResult}
            searchAction={exploreLocation}
            title="Location" />
        <ExploreGenericResults
            appType={IDENTIFYING_CHARACTERISTICS_FQN}
            resultComponent={IdentifyingCharacteristicsResult}
            searchAction={exploreIdentifyingCharacteristics}
            title="Identifying Characteristics" />
        <ExploreGenericResults
            appType={PHYSICAL_APPEARANCE_FQN}
            resultComponent={PhysicalAppearanceResult}
            searchAction={explorePhysicalAppearances}
            title="Physical Appearance" />
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default ExploreContainer;
