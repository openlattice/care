// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { Map, List } from 'immutable';
import { getFormDataFromEntityArray } from '../../../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import * as FQN from '../../../../../edm/DataModelFqns';

const { OFFICER_SAFETY_CONCERNS_FQN } = APP_TYPES_FQNS;

const { getPageSectionKey } = DataProcessingUtils;

const constructFormData = (safetyConcerns :List<Map>) => {
  const properties = List([
    FQN.DESCRIPTION_FQN,
    FQN.CATEGORY_FQN
  ]);

  const safetyConcernsFormData = getFormDataFromEntityArray(
    safetyConcerns,
    OFFICER_SAFETY_CONCERNS_FQN,
    properties,
    -1
  );

  if (safetyConcernsFormData.isEmpty()) {
    return Map();
  }

  return Map().set(getPageSectionKey(1, 1,), safetyConcernsFormData);
};

const constructEntityIndexToIdMap = (safetyConcernsEKIDs :List<UUID>) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (!safetyConcernsEKIDs.isEmpty()) {
      mutable.setIn([OFFICER_SAFETY_CONCERNS_FQN, -1], safetyConcernsEKIDs);
    }
  });

  return entityIndexToIdMap;
};

export {
  constructEntityIndexToIdMap,
  constructFormData,
};
