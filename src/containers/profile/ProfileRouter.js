// @flow
import React from 'react';

import { Map } from 'immutable';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import HelplineContainer from './helpline/HelplineContainer';
import PremiumProfileRouter from './premium/PremiumProfileRouter';
import ProfileContainer from './ProfileContainer';

import { useAppSettings } from '../../components/hooks';
import {
  HOME_PATH,
  PROFILE_PATH,
  PROFILE_VIEW_PATH
} from '../../core/router/Routes';

const ProfileRouter = () => {
  const settings = useAppSettings();
  const premium = settings.get('premium', false);
  const profileModule = settings.get('profileModule', 'crisis');
  const crisisComponent = premium ? PremiumProfileRouter : ProfileContainer;

  const profileComponent = profileModule === 'crisis' ? crisisComponent : HelplineContainer;

  return (
    <Switch>
      <Route strict path={PROFILE_VIEW_PATH} component={profileComponent} />
      <Redirect to={HOME_PATH} />
    </Switch>
  );
};

// $FlowFixMe
export default ProfileRouter;
