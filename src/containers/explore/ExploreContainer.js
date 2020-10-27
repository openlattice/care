// @flow
import React from 'react';

import CitationResult from './CitationResult';
import ContactInformationResult from './ContactInformationResult';
import ExploreFileResults from './ExploreFileResults';
import ExploreGenericResults from './ExploreGenericResults';
import ExploreIncidentResults from './ExploreIncidentResults';
import ExplorePeopleResults from './ExplorePeopleResults';
import ExploreSearchBar from './ExploreSearchBar';
import IdentifyingCharacteristicsResult from './IdentifyingCharacteristicsResult';
import LocationResult from './LocationResult';
import PhysicalAppearanceResult from './PhysicalAppearanceResult';
import PoliceCADResult from './PoliceCADResult';
import {
  exploreCitations,
  exploreContactInformation,
  exploreIdentifyingCharacteristics,
  exploreLocation,
  explorePhysicalAppearances,
  explorePoliceCAD,
} from './ExploreActions';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  CITATION_FQN,
  CONTACT_INFORMATION_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
  LOCATION_FQN,
  PHYSICAL_APPEARANCE_FQN,
  POLICE_CAD_FQN,
} = APP_TYPES_FQNS;

const ExploreContainer = () => (
  <ContentOuterWrapper>
    <ExploreSearchBar />
    <ContentWrapper>
      <ExplorePeopleResults />
      <ExploreGenericResults
          appType={CITATION_FQN}
          resultComponent={CitationResult}
          searchAction={exploreCitations}
          title="Citations" />
      <ExploreGenericResults
          appType={CONTACT_INFORMATION_FQN}
          resultComponent={ContactInformationResult}
          searchAction={exploreContactInformation}
          title="Contact Information" />
      <ExploreFileResults />
      <ExploreGenericResults
          appType={IDENTIFYING_CHARACTERISTICS_FQN}
          resultComponent={IdentifyingCharacteristicsResult}
          searchAction={exploreIdentifyingCharacteristics}
          title="Identifying Characteristics" />
      <ExploreIncidentResults />
      <ExploreGenericResults
          appType={LOCATION_FQN}
          resultComponent={LocationResult}
          searchAction={exploreLocation}
          title="Location" />
      <ExploreGenericResults
          appType={PHYSICAL_APPEARANCE_FQN}
          resultComponent={PhysicalAppearanceResult}
          searchAction={explorePhysicalAppearances}
          title="Physical Appearance" />
      <ExploreGenericResults
          appType={POLICE_CAD_FQN}
          resultComponent={PoliceCADResult}
          searchAction={explorePoliceCAD}
          title="Records" />
    </ContentWrapper>
  </ContentOuterWrapper>
);

export default ExploreContainer;
