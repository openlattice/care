// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { List, Map } from 'immutable';

import { getFormDataFromEntity } from '../../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { NOTES_FQN } from '../../../../edm/DataModelFqns';
import { isValidUuid } from '../../../../utils/Utils';

const { ASSIGNED_TO_FQN, RESPONSE_PLAN_FQN, STAFF_FQN } = APP_TYPES_FQNS;
const { getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;

const getOptionsFromEntityList = (entities :List<Map>, property :string) => {

  const values = [];
  const labels = [];
  entities.forEach((entity :Map) => {
    const label = entity.getIn([property, 0]) || '';
    const value = entity.getIn([OPENLATTICE_ID_FQN, 0]);

    labels.push(label);
    values.push(value);
  });

  return [values, labels];
};

const constructFormData = (responsePlan :Map, responsibleUser :Map) => {
  console.log(responsePlan);
  const responsePlanFormData = getFormDataFromEntity(
    responsePlan,
    RESPONSE_PLAN_FQN,
    [NOTES_FQN],
    0
  );

  const responsibleUserFormData = getFormDataFromEntity(
    responsibleUser,
    STAFF_FQN,
    [OPENLATTICE_ID_FQN],
    0
  );

  return Map().withMutations((mutable) => {
    const page = getPageSectionKey(1, 1);
    if (!responsePlanFormData.isEmpty()) mutable.mergeIn([page], responsePlanFormData);
    if (!responsibleUserFormData.isEmpty()) mutable.mergeIn([page], responsibleUserFormData);
  });
};

const constructEntityIndexToIdMap = (
  responsePlanEKID :UUID,
  assignedToEKID :UUID
) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (isValidUuid(responsePlanEKID)) {
      mutable.setIn([RESPONSE_PLAN_FQN.toString(), 0], responsePlanEKID);
    }
    if (isValidUuid(assignedToEKID)) {
      mutable.setIn([ASSIGNED_TO_FQN.toString(), 0], assignedToEKID);
    }
  });

  return entityIndexToIdMap;
};

export {
  constructEntityIndexToIdMap,
  constructFormData,
  getOptionsFromEntityList
};
