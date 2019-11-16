// @flow
import { Map, getIn } from 'immutable';
import { Constants } from 'lattice';
import { DateTime } from 'luxon';
import { DataProcessingUtils } from 'lattice-fabricate';

import { getFormDataFromEntity, getEntityKeyId } from '../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { CATEGORY_FQN, DATE_TIME_FQN, COMPLETED_DT_FQN } from '../../../edm/DataModelFqns';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

const { OPENLATTICE_ID_FQN } = Constants;
const {
  STAFF_FQN,
  ISSUE_FQN,
  SUBJECT_OF_FQN,
  REPORTED_FQN,
  ASSIGNED_TO_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const constructFormData = (responsibleUser :Map = Map(), defaultComponent :string) => {

  const responsibleUserFormData = getFormDataFromEntity(
    responsibleUser,
    STAFF_FQN,
    [OPENLATTICE_ID_FQN],
    0
  );

  const componentFormData = Map().withMutations((mutable) => {
    if (defaultComponent) {
      mutable.set(getEntityAddressKey(0, ISSUE_FQN, CATEGORY_FQN), defaultComponent);
    }
  });

  return Map().withMutations((mutable) => {
    const page = getPageSectionKey(1, 1);
    if (!responsibleUserFormData.isEmpty()) mutable.mergeIn([page], responsibleUserFormData);
    if (!componentFormData.isEmpty()) mutable.mergeIn([page], componentFormData);
  });
};

const getIssueAssociations = (formData :any, person :Map, currentUser :Map) => {

  const nowAsIsoString = DateTime.local().toISO();
  const personEKID = getEntityKeyId(person);
  const currentUserEKID = getEntityKeyId(currentUser);
  const assigneeEKID = getIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
  );

  const associations = [
    // person -> subject of -> issue
    [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, ISSUE_FQN, {
      [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
    }],
    // issue -> assigned to -> staff
    [ASSIGNED_TO_FQN, 0, ISSUE_FQN, assigneeEKID, STAFF_FQN, {
      [DATE_TIME_FQN.toString()]: [nowAsIsoString]
    }],
    // staff -> reported -> issue
    [REPORTED_FQN, currentUserEKID, STAFF_FQN, 0, ISSUE_FQN, {
      [DATE_TIME_FQN.toString()]: [nowAsIsoString]
    }]
  ];

  return associations;
};

export {
  constructFormData,
  getIssueAssociations,
};
