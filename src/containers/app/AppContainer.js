/*
 * @flow
 */

import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import FormContainer from '../form/FormContainer';
import * as Routes from '../../core/router/Routes';

const AppContainer = () => {

  return (
    <Switch>
      <Route exact strict path={Routes.FORM_PAGE} component={FormContainer} />
      <Redirect to={Routes.FORM} />
    </Switch>
  );
};

export default AppContainer;
