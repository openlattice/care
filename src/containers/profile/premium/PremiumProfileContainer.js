// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Constants } from 'lattice';
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

import BehaviorCard from './BehaviorCard';
import DeescalationCard from './DeescalationCard';
import OfficerSafetyCard from './OfficerSafetyCard';
import CrisisCountCard from '../CrisisCountCard';
import ProfileBanner from '../ProfileBanner';
import ProfileResult from '../ProfileResult';
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
import {
  PROFILE_ID_PARAM,
  REPORT_VIEW_PATH,
  REPORT_ID_PATH
} from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';
import type { RoutingAction } from '../../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;
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

const BehaviorAndHistoryGrid = styled.div`
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
  updateAboutState :RequestState;
  match :Match;
  physicalAppearance :Map;
  reports :List<Map>;
  selectedPerson :Map;
};

type State = {
  showEdit :boolean;
};

class ProfileContainer extends Component<Props, State> {

  componentDidMount() {
    const {
      actions,
      match,
      selectedPerson
    } = this.props;
    const personEKID = selectedPerson.get([OPENLATTICE_ID_FQN, 0]) || match.params[PROFILE_ID_PARAM];
    // always get fresh data
    actions.getPersonData(personEKID);
    actions.getProfileReports(personEKID);
  }

  countCrisisCalls = () => {
    const { reports } = this.props;
    let count = 0;
    reports.forEach((report :Map) => {
      const occurred = report.getIn([DATE_TIME_OCCURRED_FQN, 0], '');
      const dtOccurred = DateTime.fromISO(occurred);
      if (dtOccurred.isValid) {
        const durationInYears = dtOccurred
          .until(DateTime.local()).toDuration(['years'])
          .toObject()
          .years;

        if (durationInYears <= 1) count += 1;
      }
    });

    return count;
  }

  handleResultClick = (result :Map) => {
    const { actions } = this.props;
    const reportEKID = result.getIn([OPENLATTICE_ID_FQN, 0]);
    actions.goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID));
  }

  render() {
    const {
      fetchReportsState,
      reports,
      selectedPerson
    } = this.props;
    const count = this.countCrisisCalls();
    return (
      <ContentOuterWrapper>
        <ProfileBanner selectedPerson={selectedPerson} />
        <ContentWrapper>
          <ProfileGrid>
            <Aside>
              <Card>
                <CardSegment padding="sm">
                  <PlaceholderPortrait icon={faPortrait} color={NEUTRALS[5]} />
                </CardSegment>
                <CardSegment vertical padding="sm">
                  <Button mode="primary">
                    New Crisis Template
                  </Button>
                </CardSegment>
              </Card>
            </Aside>
            <CardStack>
              <CrisisCountCard
                  count={count}
                  isLoading={fetchReportsState === RequestStates.PENDING} />
              <BehaviorAndHistoryGrid>
                <BehaviorCard reports={reports} />
                <OfficerSafetyCard />
              </BehaviorAndHistoryGrid>
              <DeescalationCard />
              <SearchResults
                  hasSearched={fetchReportsState !== RequestStates.STANDBY}
                  isLoading={fetchReportsState === RequestStates.PENDING}
                  onResultClick={this.handleResultClick}
                  results={reports}
                  resultLabels={labelMapReport}
                  resultComponent={ProfileResult} />
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
  updateAboutState: state.getIn(['profile', 'updateAboutState'], RequestStates.STANDBY),
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
