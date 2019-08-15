// @flow
import {
  getIn,
  isImmutable,
  List,
  Map,
  Set,
} from 'immutable';
import { Constants, Models } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { isDefined } from './LangUtils';

const { getEntityAddressKey } = DataProcessingUtils;
const { FullyQualifiedName } = Models;
const { OPENLATTICE_ID_FQN } = Constants;

const SEARCH_PREFIX = 'entity';

const getFqnObj = (fqnStr :string) => {
  const splitStr = fqnStr.split('.');
  return {
    namespace: splitStr[0],
    name: splitStr[1]
  };
};

const stripIdField = (entity :Object) => {
  if (isImmutable(entity)) {
    return entity.delete(OPENLATTICE_ID_FQN).delete('id');
  }

  const newEntity = Object.assign({}, entity);
  if (newEntity[OPENLATTICE_ID_FQN]) {
    delete newEntity[OPENLATTICE_ID_FQN];
  }
  if (newEntity.id) {
    delete newEntity.id;
  }
  return newEntity;
};

const getSearchTerm = (propertyTypeId :UUID, searchString :string, exact :boolean = false) => {
  const searchTerm = exact ? `"${searchString}"` : searchString;
  return `${SEARCH_PREFIX}.${propertyTypeId}:${searchTerm}`;
};

// https://github.com/immutable-js/immutable-js/wiki/Predicates#pick--omit
const keyIn = (keys :string[]) => {
  const keySet = Set(keys);
  return (v :any, k :string) => keySet.has(k);
};

// Help simulate response data from submitted data by replacing fqn with ids
const simulateResponseData = (properties :Map, entityKeyId :UUID, edm :Map) => {
  const transformedIds = Map().withMutations((mutable :Map) => {
    properties.mapKeys((propertyTypeId :UUID, value :any) => {
      const fqnObj = edm.getIn(['propertyTypesById', propertyTypeId, 'type']);
      const fqn = new FullyQualifiedName(fqnObj);
      if (!value.isEmpty()) {
        mutable.set(fqn.toString(), value);
      }
    });

    mutable.set(OPENLATTICE_ID_FQN, List([entityKeyId]));
  });

  return transformedIds;
};

const inchesToFeetString = (inches :number) => {
  const remainder = inches % 12;
  const feet = Math.floor(inches / 12);
  return `${feet}'${remainder}"`;
};

const getEntityKeyId = (entity :Map | Object) :string => getIn(entity, [OPENLATTICE_ID_FQN, 0], '');

const getEntityKeyIdsFromList = (entityList :List) => entityList.map(entity => getIn(entity, [OPENLATTICE_ID_FQN, 0]));

const getFormDataFromEntity = (
  entity :Map | Object,
  esn :string,
  properties :List<FullyQualifiedName> | FullyQualifiedName[],
  index :number
) :Map => {
  const entityFormData = Map().withMutations((entityMutator) => {
    properties.forEach((fqn :FullyQualifiedName) => {
      const value = getIn(entity, [fqn, 0]);
      if (isDefined(value)) {
        entityMutator.set(getEntityAddressKey(index, esn, fqn), value);
      }
    });
  });

  return entityFormData;
};

const getFormDataFromEntityArray = (
  data :List<Map> | Object[],
  esn :string,
  properties :List<FullyQualifiedName> | FullyQualifiedName[],
  index :number
) :List<Map> => {
  const entityFormDataList = List().withMutations((mutator :List) => {
    data.forEach((entity :Map) => {
      const entityFormData = getFormDataFromEntity(entity, esn, properties, index);
      mutator.push(entityFormData);
    });
  });

  return entityFormDataList;
};

const groupNeighborsByEntitySetIds = (neighbors :List<Map>) :Map => {
  const neighborsByESID = Map().withMutations((mutable) => {
    neighbors.forEach((neighbor) => {
      const neighborESID = neighbor.getIn(['neighborEntitySet', 'id']);
      const neighborDetails = neighbor.get('neighborDetails');

      if (mutable.has(neighborESID)) {
        const entitySetCount = mutable.get(neighborESID).count();
        mutable.setIn([neighborESID, entitySetCount], neighborDetails);
      }
      else {
        mutable.set(neighborESID, List([neighborDetails]));
      }

    });
  });

  return neighborsByESID;
};


export {
  SEARCH_PREFIX,
  getEntityKeyIdsFromList,
  getEntityKeyId,
  getFormDataFromEntity,
  getFormDataFromEntityArray,
  getFqnObj,
  getSearchTerm,
  inchesToFeetString,
  keyIn,
  simulateResponseData,
  groupNeighborsByEntitySetIds,
  stripIdField,
};
