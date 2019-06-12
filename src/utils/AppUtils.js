// @flow
import { Map } from 'immutable';
import type { FullyQualifiedName } from 'lattice';

import { APP_TYPES_FQNS } from '../shared/Consts';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN,
  STAFF_FQN,
  REPORTED_FQN,
  PHYSICAL_APPEARANCE_FQN,
  HAS_FQN,
} = APP_TYPES_FQNS;

export const getSelectedOrganizationId = (app :Map) => app.get('selectedOrganizationId');

const getEntitySetId = (app :Map, fqn :FullyQualifiedName) :string => app.getIn([
  fqn.toString(),
  'entitySetsByOrganization',
  getSelectedOrganizationId(app)
]);

export const getAppearsInESId = (app :Map) :string => getEntitySetId(app, APPEARS_IN_FQN);
export const getHasESId = (app :Map) :string => getEntitySetId(app, HAS_FQN);
export const getPeopleESId = (app :Map) :string => getEntitySetId(app, PEOPLE_FQN);
export const getPhysicalAppearanceESId = (app :Map) :string => getEntitySetId(app, PHYSICAL_APPEARANCE_FQN);
export const getReportedESId = (app :Map) :string => getEntitySetId(app, REPORTED_FQN);
export const getReportESId = (app :Map) :string => getEntitySetId(app, BEHAVIORAL_HEALTH_REPORT_FQN);
export const getStaffESId = (app :Map) :string => getEntitySetId(app, STAFF_FQN);
