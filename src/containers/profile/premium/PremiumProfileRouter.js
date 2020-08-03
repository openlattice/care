// @flow
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import PremiumProfileContainer from './PremiumProfileContainer';

import EditProfileContainer from '../edit/EditProfileContainer';
import HelplineContainer from '../helpline/HelplineContainer';
import { PROFILE_EDIT_PATH, PROFILE_PATH, PROFILE_VIEW_PATH } from '../../../core/router/Routes';
import { clearProfile } from '../ProfileActions';

const PremiumProfileRouter = () => {

  const dispatch = useDispatch();

  useEffect(() => () => dispatch(clearProfile()), [dispatch]);

  return (
    <Switch>
      <Route component={HelplineContainer} path={`${PROFILE_VIEW_PATH}/helpline`} />
      <Redirect strict exact from={`${PROFILE_VIEW_PATH}/`} to={PROFILE_VIEW_PATH} />
      <Route
          component={PremiumProfileContainer}
          exact
          path={PROFILE_VIEW_PATH} />
      <Route path={PROFILE_EDIT_PATH} component={EditProfileContainer} />
      <Redirect to={PROFILE_VIEW_PATH} />
    </Switch>
  );
};

export default PremiumProfileRouter;
