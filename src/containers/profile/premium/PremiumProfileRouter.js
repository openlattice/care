import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PROFILE_PATH } from '../../../core/router/Routes';

import PremiumProfileContainer from './PremiumProfileContainer';
import EditProfileContainer from '../edit/EditProfileContainer';

const PremiumProfileRouter = () => (
  <Switch>
    <Route exact path={PROFILE_PATH} component={PremiumProfileContainer} />
    <Route component={EditProfileContainer} />
  </Switch>
);

export default PremiumProfileRouter;
