/*
 * @flow
 */

import React from 'react';

import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import FormContainer from '../form/FormContainer';
import * as RoutePaths from '../../core/router/RoutePaths';

const AppContainer = () => {

  return (
    <Switch>
      <Route exact strict path={RoutePaths.ROOT} component={FormContainer} />
      <Redirect to={RoutePaths.ROOT} />
    </Switch>
  );
};

export default AppContainer;
