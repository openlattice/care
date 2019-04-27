/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { EntityDataModelApiActions } from 'lattice-sagas';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import AppHeaderContainer from './AppHeaderContainer';
import CrisisTemplateContainer from '../crisis/CrisisTemplateContainer';
import DownloadsContainer from '../downloads/DownloadsContainer';
import HomeContainer from '../home/HomeContainer';
import PeopleContainer from '../people/PeopleContainer';
import Spinner from '../../components/spinner/Spinner';
import LegitReportsRouter from '../reports/LegitReportsRouter';
import DashboardContainer from '../dashboard/DashboardContainer';
import SubscribeContainer from '../subscribe/SubscribeContainer';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';
import { loadApp, loadHospitals, switchOrganization } from './AppActions';
import {
  CRISIS_PATH,
  DASHBOARD_PATH,
  DOWNLOADS_PATH,
  HOME_PATH,
  PEOPLE_PATH,
  REPORTS_PATH,
  SUBSCRIBE_PATH
} from '../../core/router/Routes';
import {
  APP_CONTAINER_MAX_WIDTH,
  APP_CONTENT_PADDING,
  MEDIA_QUERY_TECH_SM,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_LG
} from '../../core/style/Sizes';

const { getAllPropertyTypes } = EntityDataModelApiActions;

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_BG :string = '#f8f8fb';

const { HOSPITALS_FQN } = APP_TYPES_FQNS;

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
  flex: 1 0 auto;
  flex-direction: column;
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
    getAllPropertyTypes :RequestSequence;
    loadApp :RequestSequence;
    loadHospitals :RequestSequence;
    switchOrganization :(orgId :string) => Object;
  };
  app :Map<*, *>;
};

class AppContainer extends Component<Props> {

  componentDidMount() {

    const { actions } = this.props;
    actions.loadApp();
    actions.getAllPropertyTypes();
  }

  componentWillReceiveProps(nextProps) {

    // TODO: should this be moved out of AppContainer...?

    const { app, actions } = this.props;
    const prevOrgId = app.get('selectedOrganizationId');
    const nextOrgId = nextProps.app.get('selectedOrganizationId');

    // check if the selected organization has changed
    if (prevOrgId !== nextOrgId) {

      const selectedOrgId :string = nextOrgId;
      const hospitalsEntitySetId = nextProps.app.getIn(
        [HOSPITALS_FQN.toString(), 'entitySetsByOrganization', selectedOrgId]
      );
      if (isValidUuid(hospitalsEntitySetId)) {
        actions.loadHospitals({
          entitySetId: hospitalsEntitySetId,
          organizationId: selectedOrgId,
        });
      }

      /*
       * loadApp() is called once on page load in componentDidMount(), and then only needs to be called again when
       * switching organizations. to avoid calling it twice on page load, we need to check if "prevOrgId" has been
       * already set (it is initially set to the empty string in the reducer)
       */
      if (isValidUuid(prevOrgId)) {
        actions.loadApp(); // this is not entirely necessary
      }
    }
  }

  renderMissingOrgs = () => (
    <MissingOrgsWrapper>
      <span>It seems that you are not a member of any organizations. Please check with an administrator.</span>
    </MissingOrgsWrapper>
  )

  wrapComponent = AppComponent => () => <AppContentInnerWrapper><AppComponent /></AppContentInnerWrapper>;

  renderAppContent = () => {

    const { app } = this.props;
    const isLoadingApp :boolean = app.get('isLoadingApp', false);

    if (isLoadingApp) {
      return (
        <Spinner />
      );
    }

    const orgs :Map<*, *> = app.get('organizations', Map());
    const selectedOrganizationId :string = app.get('selectedOrganizationId', '');
    if (orgs.isEmpty() || !selectedOrganizationId) {
      // TODO: this might be problematic
      return (
        <Switch>
          <Route exact strict path={HOME_PATH} render={this.renderMissingOrgs} />
          <Redirect to={HOME_PATH} />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route exact strict path={HOME_PATH} render={this.wrapComponent(HomeContainer)} />
        <Route path={CRISIS_PATH} component={CrisisTemplateContainer} />
        <Route path={REPORTS_PATH} component={LegitReportsRouter} />
        <Route path={DASHBOARD_PATH} render={this.wrapComponent(DashboardContainer)} />
        <Route path={DOWNLOADS_PATH} render={this.wrapComponent(DownloadsContainer)} />
        <Route path={PEOPLE_PATH} render={this.wrapComponent(PeopleContainer)} />
        <Route path={SUBSCRIBE_PATH} render={this.wrapComponent(SubscribeContainer)} />
        <Redirect to={HOME_PATH} />
      </Switch>
    );
  }

  render() {

    return (
      <AppContainerWrapper>
        <AppHeaderContainer />
        <AppContentOuterWrapper>
          { this.renderAppContent() }
        </AppContentOuterWrapper>
      </AppContainerWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Map())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    getAllPropertyTypes,
    loadApp,
    loadHospitals,
    switchOrganization
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
