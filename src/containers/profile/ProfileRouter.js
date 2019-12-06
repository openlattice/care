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
import type { RequestSequence } from 'redux-reqseq';

import ProfileContainer from './ProfileContainer';
import PremiumProfileRouter from './premium/PremiumProfileRouter';
import {
  PROFILE_VIEW_PATH,
  HOME_PATH
} from '../../core/router/Routes';

type Props = {
  actions :{
    clearSearchResults :RequestSequence;
  };
  selectedOrganizationSettings :Map;
};

const ProfileRouter = ({ selectedOrganizationSettings } :Props) => {
  const premium = selectedOrganizationSettings.get('premium', false);
  const profileComponent = premium ? PremiumProfileRouter : ProfileContainer;

  return (
    <Switch>
      <Route strict path={PROFILE_VIEW_PATH} component={profileComponent} />
      <Redirect to={HOME_PATH} />
    </Switch>
  );
};

const mapStateToProps = (state) => ({
  selectedOrganizationSettings: state.getIn(['app', 'selectedOrganizationSettings'], Map())
});

// $FlowFixMe
export default connect(mapStateToProps)(ProfileRouter);
