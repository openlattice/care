/*
 * @flow
 */

import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';
import { Map } from 'immutable';
import { connect } from 'react-redux';

import SearchPeopleContainer from './SearchPeopleContainer';
import ProfileContainer from '../profile/ProfileContainer';
import PremiumProfileRouter from '../profile/premium/PremiumProfileRouter';
import {
  PEOPLE_PATH,
  PROFILE_PATH
} from '../../core/router/Routes';

type Props = {
  selectedOrganizationSettings :Map;
};

const PeopleRouter = ({ selectedOrganizationSettings } :Props) => {
  const premium = selectedOrganizationSettings.get('premium', false);
  const profileComponent = premium ? PremiumProfileRouter : ProfileContainer;

  return (
    <Switch>
      <Route exact path={PEOPLE_PATH} component={SearchPeopleContainer} />
      <Route path={PROFILE_PATH} component={profileComponent} />
      <Redirect to={PEOPLE_PATH} />
    </Switch>
  );
};

const mapStateToProps = state => ({
  selectedOrganizationSettings: state.getIn(['app', 'selectedOrganizationSettings'], Map())
});
// $FlowFixMe
export default connect(mapStateToProps)(PeopleRouter);
