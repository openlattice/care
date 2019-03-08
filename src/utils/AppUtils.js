import React from 'react';
import { Map } from 'immutable';

import { APP_TYPES_FQNS, STRING_ID_FQN } from '../shared/Consts';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN,
  STAFF_FQN
} = APP_TYPES_FQNS;

export const getSelectedOrganizationId = (app :Map) => app.get('selectedOrganizationId');

const getEntitySetId :string = (app :Map, fqn :FullyQualifiedName) => app.getIn([
  fqn.toString(),
  'entitySetsByOrganization',
  getSelectedOrganizationId(app)
]);

export const getPeopleESId :string = (app :Map) => getEntitySetId(app, PEOPLE_FQN);

export const getReportESId :string = (app :Map) => getEntitySetId(app, BEHAVIORAL_HEALTH_REPORT_FQN);

export const getAppearsInESId :string = (app :Map) => getEntitySetId(app, APPEARS_IN_FQN);

export const getStaffESId :string = (app :Map) => getEntitySetId(app, STAFF_FQN);
