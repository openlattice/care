/*
 * @flow
 */

import React from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import SearchReportsContainer from './SearchReportsContainer';
import CrisisReportView from './CrisisReportView';
import {
  REPORT_VIEW_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';

const LegitReportsRouter = () => (
  <Switch>
    <Route exact path={REPORTS_PATH} component={SearchReportsContainer} />
    <Route path={REPORT_VIEW_PATH} component={CrisisReportView} />
    <Redirect to={REPORTS_PATH} />
  </Switch>
);

export default LegitReportsRouter;
