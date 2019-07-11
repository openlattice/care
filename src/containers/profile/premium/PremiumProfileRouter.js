import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PROFILE_PATH, PROFILE_EDIT_PATH } from '../../../core/router/Routes';

import PremiumProfileContainer from './PremiumProfileContainer';
import EditProfileContainer from '../edit/EditProfileContainer';

const PremiumProfileRouter = () => (
  <Switch>
    <Route path={PROFILE_EDIT_PATH} component={EditProfileContainer} />
    <Route path={PROFILE_PATH} component={PremiumProfileContainer} />
  </Switch>
);

export default PremiumProfileRouter;
