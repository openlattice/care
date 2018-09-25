/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import AppHeaderContainer from './AppHeaderContainer';
import FollowUpReportManager from '../followup/FollowUpReportManager';
import FormContainer from '../form/FormContainer';
import HomeContainer from '../home/HomeContainer';
import Spinner from '../../components/spinner/Spinner';
import ReportListContainer from '../reports/ReportListContainer';
import { loadApp, loadHospitals, switchOrganization } from './AppActions';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';
import {
  BHR_PATH,
  FOLLOW_UP_PATH,
  HOME_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';
import {
  APP_CONTAINER_MAX_WIDTH,
  APP_CONTAINER_WIDTH,
  APP_CONTENT_PADDING
} from '../../core/style/Sizes';

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
  min-width: ${APP_CONTAINER_WIDTH}px;
  padding: 0;
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
        [HOSPITALS_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', selectedOrgId]
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
        <Route exact strict path={HOME_PATH} component={HomeContainer} />
        <Route path={BHR_PATH} component={FormContainer} />
        <Route path={FOLLOW_UP_PATH} component={FollowUpReportManager} />
        <Route path={REPORTS_PATH} component={ReportListContainer} />
        <Redirect to={HOME_PATH} />
      </Switch>
    );
  }

  render() {

    return (
      <AppContainerWrapper>
        <AppHeaderContainer />
        <AppContentOuterWrapper>
          <AppContentInnerWrapper>
            { this.renderAppContent() }
          </AppContentInnerWrapper>
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
    loadApp,
    loadHospitals,
    switchOrganization,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
