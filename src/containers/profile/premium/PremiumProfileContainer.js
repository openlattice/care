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
  Colors,
  SearchResults
} from 'lattice-ui-kit';
import { faPortrait } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Match } from 'react-router';

import AboutCard from './AboutCard';
import BackgroundInformationCard from './BackgroundInformationCard';
import BehaviorCard from './BehaviorCard';
import DeescalationCard from './DeescalationCard';
import OfficerSafetyCard from './OfficerSafetyCard';
import ReportsSummary from './ReportsSummary';
import ResponsePlanCard from './ResponsePlanCard';
import CrisisCountCard from '../CrisisCountCard';
import ProfileBanner from '../ProfileBanner';
import ProfileResult from '../ProfileResult';
import RecentIncidentCard from '../RecentIncidentCard';
import { labelMapReport } from '../constants';
import { ContentWrapper, ContentOuterWrapper } from '../../../components/layout';
import {
  clearProfile,
  getPersonData,
  getPhysicalAppearance,
  getProfileReports,
  updateProfileAbout
} from '../ProfileActions';
import { DATE_TIME_OCCURRED_FQN } from '../../../edm/DataModelFqns';
import { getEntityKeyId } from '../../../utils/DataUtils';
import {
  PROFILE_ID_PARAM,
  REPORT_VIEW_PATH,
  REPORT_ID_PATH
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import type { RoutingAction } from '../../../core/router/RoutingActions';

const { NEUTRALS } = Colors;

// Fixed placeholder size
const PlaceholderPortrait = styled(FontAwesomeIcon)`
  height: 265px !important;
  width: 200px !important;
`;

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
    clearProfile :() => { type :string };
    getPersonData :RequestSequence;
    getPhysicalAppearance :RequestSequence;
    getProfileReports :RequestSequence;
    goToPath :(path :string) => RoutingAction;
    updateProfileAbout :RequestSequence;
  };
  fetchAppearanceState :RequestState;
  fetchPersonState :RequestState;
  fetchReportsState :RequestState;
  match :Match;
  physicalAppearance :Map;
  reports :List<Map>;
  selectedPerson :Map;
};

type State = {
  showEdit :boolean;
};

class PremiumProfileContainer extends Component<Props, State> {

  componentDidMount() {
    const {
      actions,
      match,
      physicalAppearance,
      selectedPerson
    } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    if (selectedPerson.isEmpty()) {
      actions.getPersonData(personEKID); // gets both person and physical appearance
    }
    else if (physicalAppearance.isEmpty()) {
      actions.getPhysicalAppearance(personEKID); // only get physical appearance
    }
    actions.getProfileReports(personEKID);
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
      actions.getPersonData(personEKID);
      actions.getProfileReports(personEKID);
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
      fetchReportsState,
      fetchAppearanceState,
      fetchPersonState,
      physicalAppearance,
      reports,
      selectedPerson
    } = this.props;
    const { recent, total } = this.countCrisisCalls();

    const isLoadingReports = fetchReportsState === RequestStates.PENDING;
    const isLoadingAbout = (
      fetchPersonState === RequestStates.PENDING
      || fetchAppearanceState === RequestStates.PENDING
    );

    return (
      <ContentOuterWrapper>
        <ProfileBanner selectedPerson={selectedPerson} />
        <ContentWrapper>
          <ProfileGrid>
            <Aside>
              <CardStack>
                <Card>
                  <CardSegment padding="sm">
                    <PlaceholderPortrait icon={faPortrait} color={NEUTRALS[5]} />
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
                    physicalAppearance={physicalAppearance} />
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
                    isLoading={isLoadingReports} />
              </BehaviorAndSafetyGrid>
              <DeescalationCard />
              <ResponsePlanCard />
              <BackgroundInformationCard />
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

const mapStateToProps = state => ({
  fetchAppearanceState: state.getIn(['profile', 'fetchAppearanceState'], RequestStates.STANDBY),
  fetchPersonState: state.getIn(['profile', 'fetchPersonState'], RequestStates.STANDBY),
  fetchReportsState: state.getIn(['profile', 'fetchReportsState'], RequestStates.STANDBY),
  physicalAppearance: state.getIn(['profile', 'physicalAppearance'], Map()),
  reports: state.getIn(['profile', 'reports'], List()),
  selectedPerson: state.getIn(['profile', 'selectedPerson'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearProfile,
    getPersonData,
    getPhysicalAppearance,
    getProfileReports,
    goToPath,
    updateProfileAbout,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PremiumProfileContainer);
