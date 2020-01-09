// @flow
import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import LongBeachHome from './LongBeachHome';

/* <===== BEGIN LONG BEACH HACK =====> */
export const HOME_PATH :string = '/home';
export const PEOPLE_PATH :string = '/people';
export const LOCATION_PATH :string = '/location';
export const PROVIDER_PATH :string = '/provider';
export const PROFILE_PATH :string = '/profile';
/* <===== END LONG BEACH HACK =====> */

const LongBeachRouter = () => (
  <Switch>
    <Route exact strict path={HOME_PATH} component={LongBeachHome} />
    <Route path={LOCATION_PATH} component={LongBeachHome} />
    <Route path={PEOPLE_PATH} component={LongBeachHome} />
    <Route path={PROFILE_PATH} component={LongBeachHome} />
    <Route path={PROVIDER_PATH} component={LongBeachHome} />
    <Redirect to={HOME_PATH} />
  </Switch>
);

export default LongBeachRouter;
