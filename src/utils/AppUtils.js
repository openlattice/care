import React from 'react';
import { Map } from 'immutable';

import { APP_TYPES_FQNS, STRING_ID_FQN } from '../shared/Consts';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

export const getSelectedOrganizationId = (app :Map) => app.get('selectedOrganizationId');

export const getPeopleESId :string = (app :Map) => app.getIn([
  PEOPLE_FQN.toString(),
  'entitySetsByOrganization',
  getSelectedOrganizationId(app)
]);

export const getReportESId :string = (app :Map) => app.getIn([
  BEHAVIORAL_HEALTH_REPORT_FQN.toString(),
  'entitySetsByOrganization',
  getSelectedOrganizationId(app)
]);
