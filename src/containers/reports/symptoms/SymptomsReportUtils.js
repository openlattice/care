// @flow
import { DateTime } from 'luxon';

import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';

const getNewSymptomsReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };

  // static assocations
  const associations :any[][] = [
    [APP.INVOLVED_IN_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.INCIDENT_FQN, NOW_DATA],
    [APP.LOCATED_AT_FQN, 0, APP.INCIDENT_FQN, 0, APP.LOCATION_FQN, NOW_DATA],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.INCIDENT_FQN, NOW_DATA],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.SYMPTOMS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCIDENT_FQN, 0, APP.SYMPTOMS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.NATURE_OF_CRISIS_FQN, 0, APP.SYMPTOMS_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SYMPTOM_FQN, 0, APP.SYMPTOMS_REPORT_FQN, NOW_DATA],
  ];

  return associations;
};

export {
  getNewSymptomsReportAssociations
};
