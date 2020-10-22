// @flow
import React from 'react';

import ContactInformationResult from './ContactInformationResult';
import ExploreFileResults from './ExploreFileResults';
import ExploreGenericResults from './ExploreGenericResults';
import ExploreIncidentResults from './ExploreIncidentResults';
import ExplorePeopleResults from './ExplorePeopleResults';
import ExploreSearchBar from './ExploreSearchBar';
import IdentifyingCharacteristicsResult from './IdentifyingCharacteristicsResult';
import LocationResult from './LocationResult';
import PhysicalAppearanceResult from './PhysicalAppearanceResult';
import {
  exploreContactInformation,
  exploreIdentifyingCharacteristics,
  exploreLocation,
  explorePhysicalAppearances,
} from './ExploreActions';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  CONTACT_INFORMATION_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
  LOCATION_FQN,
  PHYSICAL_APPEARANCE_FQN,
} = APP_TYPES_FQNS;

const ExploreContainer = () => (
  <ContentOuterWrapper>
    <ExploreSearchBar />
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

export default ExploreContainer;
