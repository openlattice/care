// @flow
import {
  isImmutable,
  List,
  Map,
  Set,
} from 'immutable';
import { Constants, Models } from 'lattice';

const { FullyQualifiedName } = Models;
const { OPENLATTICE_ID_FQN } = Constants;

export const SEARCH_PREFIX = 'entity';

export const getFqnObj = (fqnStr :string) => {
  const splitStr = fqnStr.split('.');
  return {
    namespace: splitStr[0],
    name: splitStr[1]
  };
};

export const stripIdField = (entity :Object) => {
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

export const getSearchTerm = (propertyTypeId :UUID, searchString :string, exact :boolean = false) => {
  const searchTerm = exact ? `"${searchString}"` : searchString;
  return `${SEARCH_PREFIX}.${propertyTypeId}:${searchTerm}`;
};

// https://github.com/immutable-js/immutable-js/wiki/Predicates#pick--omit
export const keyIn = (keys :string[]) => {
  const keySet = Set(keys);
  return (v :any, k :string) => keySet.has(k);
};

// Help simulate response data from submitted data by replacing fqn with ids
export const simulateResponseData = (properties :Map, entityKeyId :UUID, edm :Map) => {
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
