/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { AuthActionFactory, AuthUtils } from 'lattice-auth';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import OpenLatticeLogo from '../../assets/images/logo_and_name.png';
import FollowUpReportManager from '../followup/FollowUpReportManager';
import FormContainer from '../form/FormContainer';
import HomeContainer from '../home/HomeContainer';
import ConsumerSummaryContainer from '../consumersummary/ConsumerSummaryContainer';
import Loading from '../../components/Loading';
import OrganizationButton from './OrganizationButton';
import StyledButton from '../../components/buttons/StyledButton';
import * as Routes from '../../core/router/Routes';
import { loadApp, loadHospitals, selectOrganization } from '../form/AppActionFactory';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';

const { HOSPITALS_FQN } = APP_TYPES_FQNS;
const { logout } = AuthActionFactory;

/*
 * styled components
 */

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 900px;
`;

const AppHeaderOuterWrapper = styled.header`
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  position: relative;
`;

const AppHeaderInnerWrapper = styled.div`
  align-items: center;
  background-color: #fefefe;
  border-bottom: 1px solid #c5d5e5;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  height: 100px;
  justify-content: center;
  min-width: 900px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: normal;
  margin: 0;
`;

const StyledActionButton = StyledButton.extend`
  display: flex;
  position: absolute;
  right: 50px;
`;

const LoginAnchor = StyledActionButton.withComponent('a');

const LogoLink = styled(Link)`
  position: absolute;
  left: 50px;
`;

const MissingOrgsWrapper = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

/*
 * types
 */

type Props = {
  actions :{
    loadApp :RequestSequence;
    loadHospitals :RequestSequence;
    logout :() => void;
    selectOrganization :() => void;
  };
  app :Map;
};

class AppContainer extends React.Component<Props> {

  componentDidMount() {
    this.props.actions.loadApp();
  }

  componentWillReceiveProps(nextProps) {

    const prevOrgId = this.props.app.get('selectedOrganization');
    const nextOrgId = nextProps.app.get('selectedOrganization');

    // check if the selected organization has changed
    if (prevOrgId !== nextOrgId) {

      const selectedOrg :string = nextOrgId;
      const hospitalsEntitySetId = nextProps.app.getIn(
        [HOSPITALS_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', selectedOrg]
      );
      this.props.actions.loadHospitals(hospitalsEntitySetId);

      /*
       * loadApp() is called once on page load in componentDidMount(), and then only needs to be called again when
       * switching organizations. to avoid calling it twice on page load, we need to check if "prevOrgId" has been
       * already set (it is initially set to the empty string in the reducer)
       */
      if (isValidUuid(prevOrgId)) {
        this.props.actions.loadApp(); // this is not entirely necessary
      }
    }
  }

  renderMissingOrgs = () => (
    <MissingOrgsWrapper>
      <span>It seems that you are not a member of any organizations. Please check with an administrator.</span>
    </MissingOrgsWrapper>
  )

  renderApp = () => {

    const orgs :Map<*, *> = this.props.app.get('organizations', Map());
    const selectedOrg :string = this.props.app.get('selectedOrganization', '');

    if (orgs.isEmpty() || !selectedOrg) {
      return (
        <Switch>
          <Route exact strict path={Routes.HOME} render={this.renderMissingOrgs} />
          <Redirect to={Routes.HOME} />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route exact strict path={Routes.HOME} component={HomeContainer} />
        <Route path={Routes.BHR} component={FormContainer} />
        <Route path={Routes.FOLLOW_UP_PATH} component={FollowUpReportManager} />
        <Route path={Routes.CONSUMER_SUMMARY} component={ConsumerSummaryContainer} />
        <Redirect to={Routes.HOME} />
      </Switch>
    );
  }

  render() {

    const orgs :Map<*, *> = this.props.app.get('organizations', Map());
    const selectedOrg :string = this.props.app.get('selectedOrganization', '');

    const isLoadingApp :boolean = this.props.app.get('isLoadingApp', false);
    const isLoadingConfigurations :boolean = this.props.app.get('isLoadingConfigurations', false);

    return (
      <AppWrapper>
        <AppHeaderOuterWrapper>
          <AppHeaderInnerWrapper>
            <LogoLink to={Routes.ROOT}>
              <img src={OpenLatticeLogo} height="50" alt="OpenLattice Logo" />
            </LogoLink>
            <Title>Behavioral Health Report</Title>
            {
              AuthUtils.isAuthenticated()
                ? (
                  <StyledActionButton onClick={this.props.actions.logout}>Logout</StyledActionButton>
                )
                : (
                  <LoginAnchor href={`${window.location.origin}${Routes.LOGIN}/`}>Login</LoginAnchor>
                )
            }
            {
              (!orgs.isEmpty() && selectedOrg)
                ? (
                  <OrganizationButton
                      organizations={this.props.app.get('organizations', Map())}
                      selectedOrganization={this.props.app.get('selectedOrganization', '')}
                      selectOrganization={this.props.actions.selectOrganization} />
                )
                : null
            }
          </AppHeaderInnerWrapper>
        </AppHeaderOuterWrapper>
        {
          isLoadingApp || isLoadingConfigurations
            ? <Loading />
            : this.renderApp()
        }
      </AppWrapper>
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
    logout,
    selectOrganization
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
