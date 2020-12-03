// @flow
import React from 'react';

// import { AppContainer } from '@openlattice/lattice-community-restorative-court';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import CRCContainer from './crc/CRCContainer';
// import Helpline from './helpline/Helpline';
import PremiumProfileRouter from './premium/PremiumProfileRouter';
import ProfileContainer from './ProfileContainer';

import { useAppSettings } from '../../components/hooks';
import { HOME_PATH, PROFILE_VIEW_PATH } from '../../core/router/Routes';

const ProfileRouter = () => {
  const settings = useAppSettings();
  const premium = settings.get('premium', false);
  const profileModule = settings.get('profileModule', 'crisis');
  const crisisComponent = premium ? PremiumProfileRouter : ProfileContainer;

  // const profileComponent = profileModule === 'crc' ? AppContainer : crisisComponent;

  return (
    <Switch>
      <Route strict path={PROFILE_VIEW_PATH} component={CRCContainer} />
      <Redirect to={HOME_PATH} />
    </Switch>
  );
};

// $FlowFixMe
export default ProfileRouter;
