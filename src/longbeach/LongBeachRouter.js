// @flow
import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import LongBeachHome from './LongBeachHome';
import LongBeachLocationsContainer from './location/LongBeachLocationsContainer';
import LongBeachPeopleContainer from './people/LongBeachPeopleContainer';
import LongBeachProfileContainer from './profile/LongBeachProfileContainer';
import LongBeachProviderContainer from './provider/LongBeachProviderContainer';
import {
  HOME_PATH,
  LOCATION_PATH,
  PEOPLE_PATH,
  PROFILE_VIEW_PATH,
  PROVIDER_PATH,
} from './routes';

const LongBeachRouter = () => (
  <Switch>
    <Route exact strict path={HOME_PATH} component={LongBeachHome} />
    <Route path={LOCATION_PATH} component={LongBeachLocationsContainer} />
    <Route path={PEOPLE_PATH} component={LongBeachPeopleContainer} />
    <Route path={PROVIDER_PATH} component={LongBeachProviderContainer} />
    <Route strict path={PROFILE_VIEW_PATH} component={LongBeachProfileContainer} />
    <Redirect to={HOME_PATH} />
  </Switch>
);

export default LongBeachRouter;
