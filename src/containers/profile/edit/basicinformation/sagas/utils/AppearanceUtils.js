// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { Map } from 'immutable';
import { getFormDataFromEntity } from '../../../../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../../../../shared/Consts';
import * as FQN from '../../../../../../edm/DataModelFqns';
import { isValidUuid } from '../../../../../../utils/Utils';

const {
  PHYSICAL_APPEARANCE_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
} = APP_TYPES_FQNS;

const { getPageSectionKey } = DataProcessingUtils;

const constructFormData = (
  appearance :Map,
  marks :Map,
) => {

  const appearanceProperties = [
    FQN.EYE_COLOR_FQN,
    FQN.HAIR_COLOR_FQN,
    FQN.HEIGHT_FQN,
    FQN.WEIGHT_FQN,
  ];

  const marksProperties = [FQN.DESCRIPTION_FQN];

  const appearanceFormData = getFormDataFromEntity(
    appearance,
    PHYSICAL_APPEARANCE_FQN,
    appearanceProperties,
    0
  );

  const marksFormData = getFormDataFromEntity(
    marks,
    IDENTIFYING_CHARACTERISTICS_FQN,
    marksProperties,
    0
  );

  return Map().withMutations((mutable) => {
    if (!appearanceFormData.isEmpty()) mutable.mergeIn([getPageSectionKey(1, 1)], appearanceFormData);
    if (!marksFormData.isEmpty()) mutable.mergeIn([getPageSectionKey(1, 1)], marksFormData);
  });

};

const constructEntityIndexToIdMap = (
  apperanceEKID :UUID,
  marksEKID :UUID,
) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (isValidUuid(apperanceEKID)) {
      mutable.setIn([PHYSICAL_APPEARANCE_FQN.toString(), 0], apperanceEKID);
    }
    if (isValidUuid(marksEKID)) mutable.setIn([IDENTIFYING_CHARACTERISTICS_FQN.toString(), 0], marksEKID);
  });

  return entityIndexToIdMap;
};

export {
  constructFormData,
  constructEntityIndexToIdMap,
};
