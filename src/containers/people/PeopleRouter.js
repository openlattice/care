/*
 * @flow
 */

import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import SearchPeopleContainer from './SearchPeopleContainer';
import ProfileContainer from '../profile/ProfileContainer';
import { PEOPLE_PATH, PROFILE_PATH } from '../../core/router/Routes';


const PeopleRouter = () => (
  <Switch>
    <Route exact path={PEOPLE_PATH} component={SearchPeopleContainer} />
    <Route path={PROFILE_PATH} component={ProfileContainer} />
    <Redirect to={PEOPLE_PATH} />
  </Switch>
);

// $FlowFixMe
export default PeopleRouter;
