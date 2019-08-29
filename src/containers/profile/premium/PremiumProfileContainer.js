// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
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
import type { Match } from 'react-router';

import AboutCard from './AboutCard';
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
import { labelMapReport } from '../constants';
import { ContentWrapper, ContentOuterWrapper } from '../../../components/layout';
import { getProfileReports } from '../ProfileActions';
import { getBasicInformation } from '../edit/basicinformation/actions/BasicInformationActions';
import { getResponsePlan } from '../edit/responseplan/ResponsePlanActions';
import { getContacts } from '../edit/contacts/ContactsActions';
import { getOfficerSafety } from '../edit/officersafety/OfficerSafetyActions';
import { DATE_TIME_OCCURRED_FQN } from '../../../edm/DataModelFqns';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { reduceRequestStates } from '../../../utils/StateUtils';
import { getImageDataFromEntity } from '../../../utils/BinaryUtils';
import {
  CRISIS_PATH,
  PROFILE_ID_PARAM,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH,
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
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
    getBasicInformation :RequestSequence;
    getOfficerSafety :RequestSequence;
    getProfileReports :RequestSequence;
    getResponsePlan :RequestSequence;
    goToPath :(path :string) => RoutingAction;
  };
  address :Map;
  appearance :Map;
  fetchAboutState :RequestState;
  fetchOfficerSafetyState :RequestState;
  fetchReportsState :RequestState;
  fetchResponsePlanState :RequestState;
  interactionStrategies :List<Map>;
  match :Match;
  officerSafety :List<Map>;
  contacts :List<Map>;
  contactInfoByContactEKID :Map;
  isContactForByContactEKID :Map;
  photo :Map;
  reports :List<Map>;
  responsePlan :Map;
  selectedPerson :Map;
  techniques :List<Map>;
  triggers :List<Map>;
};

type State = {
  showEdit :boolean;
};

class PremiumProfileContainer extends Component<Props, State> {

  componentDidMount() {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    this.getProfileData(personEKID);
  }

  componentDidUpdate(prevProps :Props) {
    const { match } = this.props;
    const { match: prevMatch } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      this.getProfileData(personEKID);
    }
  }

  getProfileData = (personEKID :UUID) => {
    const { actions } = this.props;
    actions.getBasicInformation(personEKID);
    actions.getContacts(personEKID);
    actions.getOfficerSafety(personEKID);
    actions.getProfileReports(personEKID);
    actions.getResponsePlan(personEKID);
  }

  countCrisisCalls = () => {
    const { reports } = this.props;
    let total = 0;
    let recent = 0;
    reports.forEach((report :Map) => {
      const occurred = report.getIn([DATE_TIME_OCCURRED_FQN, 0], '');
      const dtOccurred = DateTime.fromISO(occurred);
      if (dtOccurred.isValid) {
        const durationInYears = dtOccurred
          .until(DateTime.local()).toDuration(['years'])
          .toObject()
          .years;

        const durationInWeeks = dtOccurred
          .until(DateTime.local()).toDuration(['weeks'])
          .toObject()
          .weeks;

        if (durationInYears <= 1) total += 1;
        if (durationInWeeks <= 1) recent += 1;
      }
    });

    return { recent, total };
  }

  handleResultClick = (result :Map) => {
    const { actions } = this.props;
    const reportEKID = getEntityKeyId(result);
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID));
  }

  render() {
    const {
      address,
      appearance,
      fetchAboutState,
      fetchOfficerSafetyState,
      fetchReportsState,
      fetchResponsePlanState,
      interactionStrategies,
      officerSafety,
      photo,
      reports,
      responsePlan,
      selectedPerson,
      contacts,
      contactInfoByContactEKID,
      isContactForByContactEKID,
      techniques,
      triggers,
    } = this.props;
    const { recent, total } = this.countCrisisCalls();

    const isLoadingReports = fetchReportsState === RequestStates.PENDING;
    const isLoadingOfficerSafety = fetchOfficerSafetyState === RequestStates.PENDING;
    const isLoadingAbout = fetchAboutState === RequestStates.PENDING;
    const isLoadingResponsePlan = fetchResponsePlanState === RequestStates.PENDING;

    const imageURL :string = getImageDataFromEntity(photo);

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
                <AboutCard
                    isLoading={isLoadingAbout}
                    selectedPerson={selectedPerson}
                    appearance={appearance} />
                <AddressCard
                    isLoading={isLoadingAbout}
                    address={address} />
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
                  onResultClick={this.handleResultClick}
                  results={reports}
                  resultLabels={labelMapReport}
                  resultComponent={ProfileResult} />
              <ReportsSummary reports={reports} />
            </StyledCardStack>
          </ProfileGrid>
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

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
    interactionStrategies: state.getIn(['profile', 'responsePlan', 'interactionStrategies'], List()),
    officerSafety: state.getIn(['profile', 'officerSafety', 'data', 'officerSafetyConcerns'], List()),
    photo: state.getIn(['profile', 'basicInformation', 'photos', 'data'], Map()),
    reports: state.getIn(['profile', 'reports', 'data'], List()),
    responsePlan: state.getIn(['profile', 'responsePlan', 'data'], Map()),
    selectedPerson: state.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()),
    techniques: state.getIn(['profile', 'officerSafety', 'data', 'interactionStrategies'], List()),
    triggers: state.getIn(['profile', 'officerSafety', 'data', 'behaviors'], List()),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getOfficerSafety,
    getBasicInformation,
    getContacts,
    getProfileReports,
    getResponsePlan,
    goToPath,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PremiumProfileContainer);
