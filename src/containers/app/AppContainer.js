/*
 * @flow
 */

import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import FormContainer from '../form/FormContainer';
import * as RoutePaths from '../../core/router/RoutePaths';

const AppContainer = () => {

  return (
    <Switch>
      <Route exact strict path={RoutePaths.FORM_PAGE} component={FormContainer} />
      <Redirect to={RoutePaths.FORM} />
    </Switch>
  );
};

export default AppContainer;
