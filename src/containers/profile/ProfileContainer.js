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

import ProfileBanner from './ProfileBanner';
import ProfileDetails from './ProfileDetails';
import ProfileResult from './ProfileResult';
import CrisisCountCard from './CrisisCountCard';
import { labelMapReport } from './constants';
import { ContentWrapper, ContentOuterWrapper } from '../../components/layout';
import { clearProfile, getPersonData, getProfileReports } from './ProfileActions';
import { DATE_TIME_OCCURRED_FQN } from '../../edm/DataModelFqns';
import {
  PROFILE_ID_PARAM,
  REPORT_VIEW_PATH,
  REPORT_ID_PATH
} from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;
const { NEUTRALS } = Colors;

const MarginButton = styled(Button)`
  margin-bottom: 10px;
`;

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

type Props = {
  actions :{
    clearProfile :() => { type :string };
    getPersonData :RequestSequence;
    getProfileReports :RequestSequence;
    goToPath :RequestSequence;
  };
  fetchPersonState :RequestState;
  fetchReportsState :RequestState;
  selectedPerson :Map;
  reports :List<Map>;
  match :Match;
};

class ProfileContainer extends Component<Props> {
  componentDidMount() {
    const { actions, match, selectedPerson } = this.props;
    const personEKID = selectedPerson.get([OPENLATTICE_ID_FQN, 0]) || match.params[PROFILE_ID_PARAM];
    if (selectedPerson.isEmpty()) {
      actions.getPersonData(personEKID);
    }
    actions.getProfileReports(personEKID);
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.clearProfile();
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
      fetchPersonState,
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
                  <MarginButton
                      mode="primary">
                    New Crisis Template
                  </MarginButton>
                  <Button>
                    Edit Profile
                  </Button>
                </CardSegment>
              </Card>
            </Aside>
            <div>
              <CardStack>
                <CrisisCountCard
                    count={count}
                    isLoading={fetchReportsState === RequestStates.PENDING} />
                <ProfileDetails
                    isLoading={fetchPersonState === RequestStates.PENDING}
                    selectedPerson={selectedPerson} />
                <SearchResults
                    isLoading={fetchReportsState === RequestStates.PENDING}
                    onResultClick={this.handleResultClick}
                    results={reports}
                    resultLabels={labelMapReport}
                    resultComponent={ProfileResult} />
              </CardStack>
            </div>
          </ProfileGrid>
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

const mapStateToProps = state => ({
  selectedPerson: state.getIn(['profile', 'selectedPerson'], Map()),
  fetchReportsState: state.getIn(['profile', 'fetchReportsState'], RequestStates.STANDBY),
  fetchPersonState: state.getIn(['profile', 'fetchPersonState'], RequestStates.STANDBY),
  reports: state.getIn(['profile', 'reports'], List())
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearProfile,
    getPersonData,
    getProfileReports,
    goToPath
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
