import { getIn, setIn } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
// @flow
import { DateTime } from 'luxon';

import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

const postProcessSymptoms = (
  formData :Object,
  position :Position,
) => {
  const sectionKey = getPageSectionKey(1, 1);
  const { coords } = position;
  if (coords) {
    const { latitude, longitude } = coords;
    const property = getEntityAddressKey(0, APP.LOCATION_FQN, FQN.LOCATION_COORDINATES_FQN);
    return setIn(formData, [sectionKey, property], `${latitude},${longitude}`);
  }
  return formData;
};

const getSymptomsReportAssociations = (
  formData :Object,
  existingEntityKeyIds :Object,
  createdDateTime :string = DateTime.local().toISO()
) :any[][] => {
  const personEKID = existingEntityKeyIds[APP.PEOPLE_FQN];
  const staffEKID = existingEntityKeyIds[APP.STAFF_FQN];

  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [createdDateTime] };
  const INTERACTED_DATA = {
    [FQN.DATE_TIME_FQN]: [createdDateTime],
    [FQN.CONTACT_DATE_TIME_FQN]: [createdDateTime]
  };

  // static assocations
  const associations :any[][] = [
    [APP.OBSERVED_IN_FQN, 0, APP.SYMPTOM_FQN, personEKID, APP.PEOPLE_FQN, NOW_DATA],
    [APP.INTERACTED_WITH_FQN, staffEKID, APP.STAFF_FQN, personEKID, APP.PEOPLE_FQN, INTERACTED_DATA],
    [APP.REPORTED_FQN, staffEKID, APP.STAFF_FQN, 0, APP.SYMPTOM_FQN, NOW_DATA],
  ];

  const sectionKey = getPageSectionKey(1, 1);
  const property = getEntityAddressKey(0, APP.LOCATION_FQN, FQN.LOCATION_COORDINATES_FQN);
  const hasPosition = getIn(formData, [sectionKey, property]);

  if (hasPosition) {
    associations.push([APP.LOCATED_AT_FQN, 0, APP.SYMPTOM_FQN, 0, APP.LOCATION_FQN, NOW_DATA]);
  }
  return associations;
};

export {
  postProcessSymptoms,
  getSymptomsReportAssociations
};
