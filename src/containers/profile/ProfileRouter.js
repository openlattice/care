// @flow
import React from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import CRCContainer from './crc/CRCContainer';
import Helpline from './helpline/Helpline';
import PremiumProfileRouter from './premium/PremiumProfileRouter';

import { useAppSettings } from '../../components/hooks';
import { HOME_PATH, PROFILE_VIEW_PATH } from '../../core/router/Routes';
import { CRC, CRISIS, HELPLINE } from '../../shared/ModuleConstants';

const ProfileRouter = () => {
  const [settings] = useAppSettings();
  const profileModule = settings.get('profileModule', 'crisis');

  let profileComponent = PremiumProfileRouter;
  switch (profileModule) {
    case CRISIS:
      profileComponent = PremiumProfileRouter;
      break;
    case CRC:
      profileComponent = CRCContainer;
      break;
    case HELPLINE:
      profileComponent = Helpline;
      break;
    default:
      profileComponent = PremiumProfileRouter;
  }

  return (
    <Switch>
      <Route strict path={PROFILE_VIEW_PATH} component={profileComponent} />
      <Redirect to={HOME_PATH} />
    </Switch>
  );
};

// $FlowFixMe
export default ProfileRouter;
