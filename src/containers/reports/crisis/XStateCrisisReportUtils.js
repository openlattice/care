// @flow
import { get } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { COMPLETED_DT_FQN } from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';

const { getPageSectionKey } = DataProcessingUtils;

const getCrisisReportAssociations = (formData :Object, existingEntityKeyIds :Object) => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];
  const now = DateTime.local().toISO();

  const NOW_DATA = { [COMPLETED_DT_FQN]: [now] };
  // static assocations
  const associations :any[][] = [
    [APP.INVOLVED_IN_FQN, personEKID, APP.PEOPLE_FQN, 0, APP.INCIDENT_FQN, {}],
    [APP.LOCATED_AT_FQN, 0, APP.INCIDENT_FQN, 0, APP.LOCATION_FQN, {}],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.INCIDENT_FQN, {}],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.CLINICIAN_REPORT_FQN, {}],
    [APP.PART_OF_FQN, 0, APP.INCIDENT_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.NATURE_OF_CRISIS_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.BEHAVIOR_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SUBSTANCE_HISTORY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.WEAPON_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.VIOLENT_BEHAVIOR_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INJURY_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.SELF_HARM_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.HOUSING_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INCOME_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 0, APP.INSURANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
    [APP.PART_OF_FQN, 1, APP.INSURANCE_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA],
  ];

  const diagnosis = get(formData, getPageSectionKey(4, 1), []);
  const medications = get(formData, getPageSectionKey(4, 2), []);

  for (let i = 0; i < diagnosis.length; i += 1) {
    associations.push([APP.PART_OF_FQN, i, APP.DIAGNOSIS_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA]);
  }

  for (let i = 0; i < medications.length; i += 1) {
    associations.push([APP.PART_OF_FQN, i, APP.MEDICATION_STATEMENT_FQN, 0, APP.CLINICIAN_REPORT_FQN, NOW_DATA]);
  }

  return associations;
};

export { getCrisisReportAssociations };
