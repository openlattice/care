/*
 * @flow
 */

import React from 'react';

import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import CrisisReportClinicianContainer from './crisis/CrisisReportClinicianContainer';
import CrisisReportContainer from './crisis/CrisisReportContainer';
import CrisisReportV2Container from './crisis/CrisisReportV2Container';
import CrisisReportView from './CrisisReportView';
import FollowupReportContainer from './crisis/FollowupReportContainer';
import SearchReportsContainer from './SearchReportsContainer';

import { useAppSettings } from '../../components/hooks';
import {
  CRISIS_REPORT_CLINICIAN_PATH,
  CRISIS_REPORT_PATH,
  FOLLOW_UP_REPORT_PATH,
  REPORTS_PATH,
  REPORT_VIEW_PATH,
} from '../../core/router/Routes';
import { CLINICIAN_REPORTS, V2 } from '../settings/constants';

const LegitReportsRouter = () => {
  const [settings] = useAppSettings();
  const isV2 = settings.get(V2, false);
  const hasClinicianReports = settings.get(CLINICIAN_REPORTS, true);

  return (
    <Switch>
      <Route exact path={REPORTS_PATH} component={SearchReportsContainer} />
      <Route path={REPORT_VIEW_PATH} component={CrisisReportView} />
      {
        isV2
          ? <Route exact path={CRISIS_REPORT_PATH} component={CrisisReportV2Container} />
          : <Route exact path={CRISIS_REPORT_PATH} component={CrisisReportContainer} />
      }
      {
        (isV2 && hasClinicianReports) && (
          <Route exact path={CRISIS_REPORT_CLINICIAN_PATH} component={CrisisReportClinicianContainer} />
        )
      }
      {
        isV2 && <Route exact path={FOLLOW_UP_REPORT_PATH} component={FollowupReportContainer} />
      }
      <Redirect to={REPORTS_PATH} />
    </Switch>
  );
};

export default LegitReportsRouter;
