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
      <Route exact strict path={"/:page"} component={FormContainer} />
      <Redirect to="/1" />
    </Switch>
  );
};

export default AppContainer;
