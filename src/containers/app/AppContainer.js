/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Spinner } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import AppHeaderContainer from './AppHeaderContainer';
import {
  initializeApplication,
} from './AppActions';

import CrisisReportContainer from '../reports/CrisisReportContainer';
import DashboardContainer from '../dashboard/DashboardContainer';
import DownloadsContainer from '../downloads/DownloadsContainer';
import IssuesContainer from '../issues/IssuesContainer';
import LegitReportsRouter from '../reports/LegitReportsRouter';
import LongBeachRouter from '../longbeach/LongBeachRouter';
import ProfileRouter from '../profile/ProfileRouter';
import SearchPeopleContainer from '../people/SearchPeopleContainer';
import {
  CRISIS_PATH,
  DASHBOARD_PATH,
  DOWNLOADS_PATH,
  HOME_PATH,
  ISSUES_PATH,
  PROFILE_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';
import {
  APP_CONTAINER_MAX_WIDTH,
  APP_CONTENT_PADDING,
  MEDIA_QUERY_LG,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_TECH_SM
} from '../../core/style/Sizes';

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_BG :string = '#f8f8fb';

/*
 * styled components
 */

const AppContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  min-width: 300px;
  padding: 0;

  @media only screen and (min-width: ${MEDIA_QUERY_TECH_SM}px) {
    min-width: ${MEDIA_QUERY_TECH_SM};
  }

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    min-width: ${MEDIA_QUERY_MD};
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    min-width: ${MEDIA_QUERY_LG};
  }
`;

const AppContentOuterWrapper = styled.main`
  background-color: ${APP_BG};
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  position: relative;
`;

const AppContentInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: flex-start;
  max-width: ${APP_CONTAINER_MAX_WIDTH}px;
  padding: ${APP_CONTENT_PADDING}px;
  position: relative;
`;

const MissingOrgsWrapper = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

type Props = {
  actions :{
    initializeApplication :RequestSequence;
  };
  initializeState :RequestState;
  organizations :Map;
  selectedOrganizationId :UUID;
  selectedOrganizationSettings :Map;
};

class AppContainer extends Component<Props> {

  componentDidMount() {
    const { actions } = this.props;
    actions.initializeApplication();
  }

  renderMissingOrgs = () => (
    <MissingOrgsWrapper>
      <span>It seems that you are not a member of any organizations. Please check with an administrator.</span>
    </MissingOrgsWrapper>
  )

  wrapComponent = (AppComponent) => () => <AppContentInnerWrapper><AppComponent /></AppContentInnerWrapper>;

  renderAppContent = () => {

    const {
      organizations,
      selectedOrganizationSettings,
      selectedOrganizationId,
      initializeState
    } = this.props;

    if (initializeState === RequestStates.PENDING) {
      return <Spinner size="3x" />;
    }
    if (organizations.isEmpty() || !selectedOrganizationId) {
      return (
        <Switch>
          <Route render={this.renderMissingOrgs} />
        </Switch>
      );
    }

    /* <===== BEGIN LONG BEACH HACK =====> */
    if (selectedOrganizationSettings.get('longBeach', false)) {
      return (<LongBeachRouter />);
    }
    /* <===== END LONG BEACH HACK =====> */

    return (
      <Switch>
        <Route exact strict path={HOME_PATH} component={SearchPeopleContainer} />
        <Route path={CRISIS_PATH} component={CrisisReportContainer} />
        <Route path={REPORTS_PATH} component={LegitReportsRouter} />
        <Route path={DASHBOARD_PATH} render={this.wrapComponent(DashboardContainer)} />
        <Route path={DOWNLOADS_PATH} render={this.wrapComponent(DownloadsContainer)} />
        <Route path={PROFILE_PATH} component={ProfileRouter} />
        <Route path={ISSUES_PATH} component={IssuesContainer} />
        <Redirect to={HOME_PATH} />
      </Switch>
    );
  }

  render() {
    const { organizations } = this.props;

    return (
      <AppContainerWrapper>
        <AppHeaderContainer organizations={organizations} />
        <AppContentOuterWrapper>
          { this.renderAppContent() }
        </AppContentOuterWrapper>
      </AppContainerWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    initializeState: state.getIn(['app', 'initializeState']),
    organizations: state.getIn(['app', 'organizations'], Map()),
    selectedOrganizationId: state.getIn(['app', 'selectedOrganizationId'], ''),
    selectedOrganizationSettings: state.getIn(['app', 'selectedOrganizationSettings'], Map()),
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    initializeApplication,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(AppContainer);
