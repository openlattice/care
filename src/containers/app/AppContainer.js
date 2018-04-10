/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';
import { AuthActionFactory, AuthUtils } from 'lattice-auth';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import OpenLatticeLogo from '../../assets/images/logo_and_name.png';
import FollowUpReportManager from '../followup/FollowUpReportManager';
import FormContainer from '../form/FormContainer';
import HomeContainer from '../home/HomeContainer';
import Loading from '../../components/Loading';
import OrganizationButton from './OrganizationButton';
import StyledButton from '../../components/buttons/StyledButton';
import * as Routes from '../../core/router/Routes';
import { loadApp, loadHospitals, selectOrganization } from '../form/AppActionFactory';
import { APP_TYPES_FQNS } from '../../shared/Consts';

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
  app :Immutable.Map;
};

class AppContainer extends React.Component<Props> {

  componentDidMount() {
    this.props.actions.loadApp();
  }

  componentWillReceiveProps(nextProps) {

    // check if the selected organization has changed
    if (this.props.app.get('selectedOrganization') !== nextProps.app.get('selectedOrganization')) {
      const selectedOrg :string = nextProps.app.get('selectedOrganization');
      const hospitalsEntitySetId = nextProps.app.getIn(
        [HOSPITALS_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', selectedOrg]
      );
      this.props.actions.loadHospitals(hospitalsEntitySetId);
      this.props.actions.loadApp(); // this is not entirely necessary
    }
  }

  renderMissingOrgs = () => (
    <MissingOrgsWrapper>
      <span>It seems that you are not a member of any organizations. Please check with an administrator.</span>
    </MissingOrgsWrapper>
  )

  renderApp = () => {

    const orgs :Map<*, *> = this.props.app.get('organizations', Immutable.Map());
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
        <Redirect to={Routes.HOME} />
      </Switch>
    );
  }

  render() {

    const orgs :Map<*, *> = this.props.app.get('organizations', Immutable.Map());
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
                      organizations={this.props.app.get('organizations', Immutable.Map())}
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
    app: state.get('app', Immutable.Map())
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
