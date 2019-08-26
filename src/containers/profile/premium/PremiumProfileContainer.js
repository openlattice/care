// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import {
  Button,
  Card,
  CardSegment,
  CardStack,
  SearchResults
} from 'lattice-ui-kit';

import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Match } from 'react-router';

import AboutCard from './AboutCard';
import BackgroundInformationCard from './BackgroundInformationCard';
import BehaviorCard from './BehaviorCard';
import AddressCard from '../../../components/premium/address/AddressCard';
import DeescalationCard from './DeescalationCard';
import OfficerSafetyCard from './OfficerSafetyCard';
import ReportsSummary from './ReportsSummary';
import ResponsePlanCard from './ResponsePlanCard';
import CrisisCountCard from '../CrisisCountCard';
import ProfileBanner from '../ProfileBanner';
import ProfileResult from '../ProfileResult';
import RecentIncidentCard from '../RecentIncidentCard';
import { labelMapReport } from '../constants';
import Portrait from '../styled/Portrait';
import { ContentWrapper, ContentOuterWrapper } from '../../../components/layout';
import { getProfileReports } from '../ProfileActions';
import {
  getAppearance,
  getBasicInformation,
  getBasics,
} from '../edit/basicinformation/actions/BasicInformationActions';
import { getAddress } from '../edit/basicinformation/actions/AddressActions';
import { getResponsePlan } from '../edit/responseplan/ResponsePlanActions';
import { getOfficerSafety } from '../edit/officersafety/OfficerSafetyActions';
import { DATE_TIME_OCCURRED_FQN } from '../../../edm/DataModelFqns';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { reduceRequestStates } from '../../../utils/StateUtils';
import { getNameFromPerson } from '../../../utils/PersonUtils';
import {
  PROFILE_ID_PARAM,
  REPORT_VIEW_PATH,
  REPORT_ID_PATH
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

const BehaviorAndSafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
`;

type Props = {
  actions :{
    getAddress :RequestSequence;
    getAppearance :RequestSequence;
    getBasicInformation :RequestSequence;
    getBasics :RequestSequence;
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
    const {
      actions,
      match,
      reports,
      responsePlan,
      selectedPerson,
    } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    if (selectedPerson.isEmpty()) {
      actions.getBasicInformation(personEKID);
    }
    else {
      actions.getAppearance(personEKID); // only get physical appearance
      actions.getAddress(personEKID); // only get address
    }

    if (responsePlan.isEmpty()) actions.getOfficerSafety(personEKID);
    if (reports.isEmpty()) actions.getProfileReports(personEKID);
  }

  componentDidUpdate(prevProps :Props) {
    const {
      actions,
      match,
    } = this.props;
    const { match: prevMatch } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      actions.getBasics(personEKID);
      actions.getProfileReports(personEKID);
      actions.getOfficerSafety(personEKID);
    }
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
      reports,
      responsePlan,
      selectedPerson,
      techniques,
      triggers,
    } = this.props;
    const { recent, total } = this.countCrisisCalls();

    const isLoadingReports = fetchReportsState === RequestStates.PENDING;
    const isLoadingOfficerSafety = fetchOfficerSafetyState === RequestStates.PENDING;
    const isLoadingAbout = fetchAboutState === RequestStates.PENDING;
    const isLoadingResponsePlan = fetchResponsePlanState === RequestStates.PENDING;

    const formattedName = getNameFromPerson(selectedPerson);
    const isMalfoy = formattedName === 'Malfoy, Scorpius H.';

    return (
      <ContentOuterWrapper>
        <ProfileBanner selectedPerson={selectedPerson} />
        <ContentWrapper>
          <ProfileGrid>
            <Aside>
              <CardStack>
                <Card>
                  <CardSegment padding="sm">
                    <Portrait isMalfoy={isMalfoy} />
                  </CardSegment>
                  <CardSegment vertical padding="sm">
                    <Button mode="primary">
                      New Crisis Report
                    </Button>
                  </CardSegment>
                </Card>
                <AboutCard
                    isLoading={isLoadingAbout}
                    selectedPerson={selectedPerson}
                    appearance={appearance} />
                <AddressCard
                    isLoading={isLoadingAbout}
                    address={address} />
              </CardStack>
            </Aside>
            <CardStack>
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
              <SearchResults
                  hasSearched={fetchReportsState !== RequestStates.STANDBY}
                  isLoading={isLoadingReports}
                  onResultClick={this.handleResultClick}
                  results={reports}
                  resultLabels={labelMapReport}
                  resultComponent={ProfileResult} />
              <ReportsSummary reports={reports} />
            </CardStack>
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
    appearance: state.getIn(['profile', 'basicInformation', 'appearance', 'data'], Map()),
    address: state.getIn(['profile', 'basicInformation', 'address', 'data'], Map()),
    officerSafety: state.getIn(['profile', 'officerSafety', 'data', 'officerSafetyConcerns'], List()),
    triggers: state.getIn(['profile', 'officerSafety', 'data', 'behaviors'], List()),
    techniques: state.getIn(['profile', 'officerSafety', 'data', 'interactionStrategies'], List()),
    fetchAboutState: reduceRequestStates(fetchAboutStates),
    fetchOfficerSafetyState: reduceRequestStates(fetchOfficerSafetyStates),
    fetchReportsState: state.getIn(['profile', 'reports', 'fetchState'], RequestStates.STANDBY),
    fetchResponsePlanState: state.getIn(['profile', 'responsePlan', 'fetchState'], RequestStates.STANDBY),
    interactionStrategies: state.getIn(['profile', 'responsePlan', 'interactionStrategies'], List()),
    reports: state.getIn(['profile', 'reports', 'data'], List()),
    responsePlan: state.getIn(['profile', 'responsePlan', 'data'], Map()),
    selectedPerson: state.getIn(['profile', 'basicInformation', 'basics', 'data'], Map()),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAddress,
    getAppearance,
    getBasics,
    getOfficerSafety,
    getBasicInformation,
    getProfileReports,
    getResponsePlan,
    goToPath,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PremiumProfileContainer);
