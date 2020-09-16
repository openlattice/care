// @flow
import { Map } from 'immutable';
import type { FQN } from 'lattice';

import { APP_TYPES_FQNS } from '../shared/Consts';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  FILES_FQN,
  HAS_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

export const getSelectedOrganizationId = (app :Map) => app.get('selectedOrganizationId');

export const getESIDFromApp = (app :Map, fqn :FQN) :string => app.getIn([
  'selectedOrgEntitySetIds',
  fqn.toString(),
]);

export const getAppearsInESId = (app :Map) :string => getESIDFromApp(app, APPEARS_IN_FQN);
export const getFilesESId = (app :Map) :string => getESIDFromApp(app, FILES_FQN);
export const getHasESId = (app :Map) :string => getESIDFromApp(app, HAS_FQN);
export const getPeopleESId = (app :Map) :string => getESIDFromApp(app, PEOPLE_FQN);
export const getPhysicalAppearanceESId = (app :Map) :string => getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);
export const getReportedESId = (app :Map) :string => getESIDFromApp(app, REPORTED_FQN);
export const getReportESId = (app :Map) :string => getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
export const getStaffESId = (app :Map) :string => getESIDFromApp(app, STAFF_FQN);

export const getESIDsFromApp = (app :Map, fqns :Array<FQN>) :string[] => fqns
  .map((fqn :FQN) => getESIDFromApp(app, fqn));
