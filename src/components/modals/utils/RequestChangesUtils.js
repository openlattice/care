// @flow
import { Map } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';

import { getFormDataFromEntity } from '../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { CATEGORY_FQN } from '../../../edm/DataModelFqns';

const { getPageSectionKey } = DataProcessingUtils;

const { OPENLATTICE_ID_FQN } = Constants;
const {
  STAFF_FQN,
  ISSUE_FQN,
} = APP_TYPES_FQNS;

const constructFormData = (responsibleUser :Map = Map(), defaultComponent :Map = Map()) => {

  const responsibleUserFormData = getFormDataFromEntity(
    responsibleUser,
    STAFF_FQN,
    [OPENLATTICE_ID_FQN],
    0
  );

  return Map().withMutations((mutable) => {
    const page = getPageSectionKey(1, 1);
    if (!responsibleUserFormData.isEmpty()) mutable.mergeIn([page], responsibleUserFormData);
  });
};

const handleSubmit = () => {
  
}

export {
  constructFormData
};
