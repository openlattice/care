// @flow

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import {
  Card,
  CardSegment,
  CardStack,
  SearchResults
} from 'lattice-ui-kit';

import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import IntroCard from './IntroCard';
import AboutPlanCard from '../../../components/premium/aboutplan/AboutPlanCard';
import AddressCard from '../../../components/premium/address/AddressCard';
import BackgroundInformationCard from './BackgroundInformationCard';
import BehaviorCard from './BehaviorCard';
import ContactCarousel from '../../../components/premium/contacts/ContactCarousel';
import CrisisCountCard from '../CrisisCountCard';
import DeescalationCard from './DeescalationCard';
import OfficerSafetyCard from './OfficerSafetyCard';
import Portrait from '../../../components/portrait/Portrait';
import ProfileBanner from '../ProfileBanner';
import ProfileResult from '../ProfileResult';
import RecentIncidentCard from '../RecentIncidentCard';
import ReportsSummary from './ReportsSummary';
import ResponsePlanCard from './ResponsePlanCard';
import LinkButton from '../../../components/buttons/LinkButton';
import { countCrisisCalls } from './Utils';
import { labelMapReport } from '../constants';
import { ContentWrapper, ContentOuterWrapper } from '../../../components/layout';
import { getProfileReports } from '../ProfileActions';
import { getBasicInformation } from '../edit/basicinformation/actions/BasicInformationActions';
import { getResponsePlan } from '../edit/responseplan/ResponsePlanActions';
import { getContacts } from '../edit/contacts/ContactsActions';
import { getAboutPlan } from '../edit/about/AboutActions';
import { getOfficerSafety } from '../edit/officersafety/OfficerSafetyActions';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { reduceRequestStates } from '../../../utils/StateUtils';
import { getImageDataFromEntity } from '../../../utils/BinaryUtils';
import {
  CRISIS_PATH,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH,
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import { usePeopleRoute } from '../../../components/hooks';
import type { RoutingAction } from '../../../core/router/RoutingActions';

const Aside = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
`;

const StyledCardStack = styled(CardStack)`
  overflow-x: hidden;
`;

const BehaviorAndSafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
`;

type Props = {
  actions :{
    getAboutPlan :RequestSequence;
    getBasicInformation :RequestSequence;
    getContacts :RequestSequence;
    getOfficerSafety :RequestSequence;
    getProfileReports :RequestSequence;
    getResponsePlan :RequestSequence;
    goToPath :(path :string) => RoutingAction;
  };
  address :Map;
  appearance :Map;
  contactInfoByContactEKID :Map;
  contacts :List<Map>;
  fetchAboutPlanState :RequestState;
  fetchAboutState :RequestState;
  fetchOfficerSafetyState :RequestState;
  fetchReportsState :RequestState;
  fetchResponsePlanState :RequestState;
  interactionStrategies :List<Map>;
  isContactForByContactEKID :Map;
  officerSafety :List<Map>;
  photo :Map;
  reports :List<Map>;
  responsePlan :Map;
  responsibleUser :Map;
  selectedPerson :Map;
  techniques :List<Map>;
  triggers :List<Map>;
};

const PremiumProfileContainer = (props :Props) => {

  const {
    actions,
    address,
    appearance,
    contactInfoByContactEKID,
    contacts,
    fetchAboutPlanState,
    fetchAboutState,
    fetchOfficerSafetyState,
    fetchReportsState,
    fetchResponsePlanState,
    interactionStrategies,
    isContactForByContactEKID,
    officerSafety,
    photo,
    reports,
    responsePlan,
    responsibleUser,
    selectedPerson,
    techniques,
    triggers,
  } = props;

  usePeopleRoute(actions.getAboutPlan);
  usePeopleRoute(actions.getBasicInformation);
  usePeopleRoute(actions.getContacts);
  usePeopleRoute(actions.getOfficerSafety);
  usePeopleRoute(actions.getProfileReports);
  usePeopleRoute(actions.getResponsePlan);

  const { recent, total } = countCrisisCalls(reports);

  const isLoadingReports = fetchReportsState === RequestStates.PENDING;
  const isLoadingOfficerSafety = fetchOfficerSafetyState === RequestStates.PENDING;
  const isLoadingIntro = fetchAboutState === RequestStates.PENDING;
  const isLoadingResponsePlan = fetchResponsePlanState === RequestStates.PENDING;
  const isLoadingAboutPlan = fetchAboutPlanState === RequestStates.PENDING;

  const imageURL :string = getImageDataFromEntity(photo);

  const handleResultClick = useCallback((result :Map) => {
    const reportEKID = getEntityKeyId(result);
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID));
  }, [actions]);

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        <ProfileGrid>
          <Aside>
            <StyledCardStack>
              <Card>
                <CardSegment padding="sm">
                  <Portrait imageUrl={imageURL} />
                </CardSegment>
                <CardSegment vertical padding="sm">
                  <LinkButton mode="primary" to={`${CRISIS_PATH}/1`} state={selectedPerson}>
                    New Crisis Report
                  </LinkButton>
                </CardSegment>
              </Card>
              <IntroCard
                  isLoading={isLoadingIntro}
                  selectedPerson={selectedPerson}
                  appearance={appearance} />
              <AddressCard
                  isLoading={isLoadingIntro}
                  address={address} />
              <AboutPlanCard
                  isLoading={isLoadingAboutPlan}
                  responsibleUser={responsibleUser} />
            </StyledCardStack>
          </Aside>
          <StyledCardStack>
            <CrisisCountCard
                count={total}
                isLoading={isLoadingReports} />
            <RecentIncidentCard count={recent} />
            <BehaviorAndSafetyGrid>
              <BehaviorCard
                  reports={reports}
                  isLoading={isLoadingReports} />
              <OfficerSafetyCard
                  reports={reports}
                  triggers={triggers}
                  officerSafety={officerSafety}
                  isLoading={isLoadingOfficerSafety} />
            </BehaviorAndSafetyGrid>
            <DeescalationCard
                techniques={techniques}
                isLoading={isLoadingOfficerSafety} />
            <ResponsePlanCard
                interactionStrategies={interactionStrategies}
                isLoading={isLoadingResponsePlan} />
            <BackgroundInformationCard
                backgroundInformation={responsePlan}
                isLoading={isLoadingResponsePlan} />
            <ContactCarousel
                contacts={contacts}
                contactInfoByContactEKID={contactInfoByContactEKID}
                isContactForByContactEKID={isContactForByContactEKID} />
            <SearchResults
                hasSearched={fetchReportsState !== RequestStates.STANDBY}
                isLoading={isLoadingReports}
                onResultClick={handleResultClick}
                results={reports}
                resultLabels={labelMapReport}
                resultComponent={ProfileResult} />
            <ReportsSummary reports={reports} />
          </StyledCardStack>
        </ProfileGrid>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

const mapStateToProps = (state :Map) => {
  const fetchAboutStates = [
    state.getIn(['profile', 'basicInformation', 'basics', 'fetchState']),
    state.getIn(['profile', 'basicInformation', 'appearance', 'fetchState']),
    state.getIn(['profile', 'basicInformation', 'address', 'fetchState']),
  ];

  const fetchOfficerSafetyStates = [
    state.getIn(['profile', 'officerSafety', 'fetchState']),
    state.getIn(['profile', 'reports', 'fetchState'])
  ];

  return {
    address: state.getIn(['profile', 'basicInformation', 'address', 'data'], Map()),
    appearance: state.getIn(['profile', 'basicInformation', 'appearance', 'data'], Map()),
    contacts: state.getIn(['profile', 'contacts', 'data', 'contacts'], List()),
    contactInfoByContactEKID: state.getIn(['profile', 'contacts', 'data', 'contactInfoByContactEKID'], Map()),
    isContactForByContactEKID: state.getIn(['profile', 'contacts', 'data', 'isContactForByContactEKID'], Map()),
    fetchAboutState: reduceRequestStates(fetchAboutStates),
    fetchOfficerSafetyState: reduceRequestStates(fetchOfficerSafetyStates),
    fetchReportsState: state.getIn(['profile', 'reports', 'fetchState'], RequestStates.STANDBY),
    fetchResponsePlanState: state.getIn(['profile', 'responsePlan', 'fetchState'], RequestStates.STANDBY),
    fetchAboutPlanState: state.getIn(['profile', 'about', 'fetchState'], RequestStates.STANDBY),
    interactionStrategies: state.getIn(['profile', 'responsePlan', 'interactionStrategies'], List()),
    officerSafety: state.getIn(['profile', 'officerSafety', 'data', 'officerSafetyConcerns'], List()),
    photo: state.getIn(['profile', 'basicInformation', 'photos', 'data'], Map()),
    reports: state.getIn(['profile', 'reports', 'data'], List()),
    responsePlan: state.getIn(['profile', 'responsePlan', 'data'], Map()),
    responsibleUser: state.getIn(['profile', 'about', 'data'], Map()),
    selectedPerson: state.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()),
    techniques: state.getIn(['profile', 'officerSafety', 'data', 'interactionStrategies'], List()),
    triggers: state.getIn(['profile', 'officerSafety', 'data', 'behaviors'], List()),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAboutPlan,
    getBasicInformation,
    getContacts,
    getOfficerSafety,
    getProfileReports,
    getResponsePlan,
    goToPath,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PremiumProfileContainer);
