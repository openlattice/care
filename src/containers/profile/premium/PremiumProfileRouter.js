// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import PremiumProfileContainer from './PremiumProfileContainer';
import EditProfileContainer from '../edit/EditProfileContainer';
import { PROFILE_PATH, PROFILE_EDIT_PATH } from '../../../core/router/Routes';


const PremiumProfileRouter = () => (
  <Switch>
    <Redirect strict exact from={`${PROFILE_PATH}/`} to={PROFILE_PATH} />
    <Route
        // authorize={actions.getAuthorization}
        component={PremiumProfileContainer}
        exact
        // feature="profile"
        path={PROFILE_PATH} />
    <Route path={PROFILE_EDIT_PATH} component={EditProfileContainer} />
    <Redirect to={PROFILE_PATH} />
  </Switch>
);

export default PremiumProfileRouter;
