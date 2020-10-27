// @flow
import {
  List,
  Map,
  Set,
  getIn,
  isImmutable,
  setIn,
} from 'immutable';
import { Constants, Models } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { LangUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

const { isDefined } = LangUtils;
const { getEntityAddressKey } = DataProcessingUtils;
const { FQN } = Models;
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

  const newEntity = { ...entity };
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
const simulateResponseData = (properties :Map, entityKeyId :UUID, propertyTypesById :Map) => {
  const transformedIds = Map().withMutations((mutable :Map) => {
    properties.mapKeys((propertyTypeId :UUID, value :any) => {
      const fqnObj = propertyTypesById.getIn([propertyTypeId, 'type']);
      const fqn = FQN.of(fqnObj);
      if (!value.isEmpty()) {
        mutable.set(fqn.toString(), value);
      }
    });

    mutable.set(OPENLATTICE_ID_FQN, List([entityKeyId]));
  });

  return transformedIds;
};

const replacePropertyTypeIdsWithFqns = (
  entity :Object,
  propertyTypesById :Map
) => Object.fromEntries<string, Object>(Object.entries(entity).map(([propertyTypeId, value]) => {
  const fqnObj = propertyTypesById.getIn([propertyTypeId, 'type']);
  return [FQN.toString(fqnObj), value];
}));

type Entity = {
  [key :string] :any[]
};

type DataGraph = {|
  associationEntityData :{
    [key :string] :Entity[]
  };
  entityData :{
    [key :string] :Entity[]
  };
|};

type SubmitDataGraphResponse = {|
  data :{
    entityKeyIds :{ [key :string] :string[] },
    entitySetIds :{ [key :string] :string[] },
   };
  error ?:Object;
|};

const indexSubmittedDataGraph = (
  dataGraph :DataGraph,
  response :SubmitDataGraphResponse,
  propertyTypesById :Map
) :Object => {
  const { associationEntityData, entityData } = dataGraph;

  const indexedEntityEntries = Object.entries(entityData).map(([entitySetId, entities]) => {
    if (Array.isArray(entities)) {
      const indexedEntities :Object[] = entities.map((entity :Object, index :number) => {
        const { entityKeyIds } = response.data;
        const entityKeyId :UUID = getIn(entityKeyIds, [entitySetId, index]);
        const entityWithFqns = replacePropertyTypeIdsWithFqns(entity, propertyTypesById);
        return setIn(entityWithFqns, [OPENLATTICE_ID_FQN], [entityKeyId]);
      });
      return [entitySetId, indexedEntities];
    }

    throw new Error("entityData 'entities' is not an array");
  });

  const indexedAssociationEntityEntries = Object.entries(associationEntityData).map(([entitySetId, entities]) => {
    if (Array.isArray(entities)) {
      const indexedEntities = entities.map((entity :Object, index :number) => {
        const { entitySetIds } = response.data;
        const entityKeyId = getIn(entitySetIds, [entitySetId, index]);
        const entityWithFqns = replacePropertyTypeIdsWithFqns(entity.data, propertyTypesById);
        return setIn(entityWithFqns, [OPENLATTICE_ID_FQN], [entityKeyId]);
      });
      return [entitySetId, indexedEntities];
    }

    throw new Error("associationEntitiyData 'entities' is not an array");
  });

  const indexedEntities = Object.fromEntries(indexedEntityEntries);
  const indexedAssociations = Object.fromEntries(indexedAssociationEntityEntries);

  return {
    entities: indexedEntities,
    associations: indexedAssociations
  };
};

const inchesToFeetString = (inches :number) => {
  const remainder = inches % 12;
  const feet = Math.floor(inches / 12);
  return `${feet}'${remainder}"`;
};

const getEntityKeyId = (entity :Map | Object) :string => getIn(entity, [OPENLATTICE_ID_FQN, 0], '');

const getEntityKeyIdsFromList = (entityList :List) => entityList
  .map((entity) => getIn(entity, [OPENLATTICE_ID_FQN, 0]));

const getFormDataFromEntity = (
  entity :Map | Object,
  esn :string,
  properties :List<FQN> | FQN[],
  index :number
) :Map => {
  const entityFormData = Map().withMutations((entityMutator) => {
    properties.forEach((fqn :FQN) => {
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
  properties :List<FQN> | FQN[],
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

const groupNeighborsByEntitySetIds = (
  neighbors :List<Map>,
  byAssociation :boolean = false,
  withEdge :boolean = false
) :Map => {
  const entitySetType = byAssociation ? 'associationEntitySet' : 'neighborEntitySet';
  const neighborsByESID = Map().withMutations((mutable) => {
    neighbors.forEach((neighbor) => {
      const neighborESID = neighbor.getIn([entitySetType, 'id']);
      const neighborData = withEdge ? neighbor : neighbor.get('neighborDetails');

      if (mutable.has(neighborESID)) {
        const entitySetCount = mutable.get(neighborESID).count();
        mutable.setIn([neighborESID, entitySetCount], neighborData);
      }
      else {
        mutable.set(neighborESID, List([neighborData]));
      }

    });
  });

  return neighborsByESID;
};

const groupNeighborsByFQNs = (
  neighbors :List<Map>,
  appTypeFqnsByIds :Map = Map(),
  byAssociation :boolean = false,
  entityOnly :boolean = false
) :Map => {
  const entitySetType = byAssociation ? 'associationEntitySet' : 'neighborEntitySet';
  const neighborsByFQN = Map().withMutations((mutable) => {
    neighbors.forEach((neighbor) => {
      const neighborESID = neighbor.getIn([entitySetType, 'id']);
      const neighborData = entityOnly ? neighbor.get('neighborDetails') : neighbor;
      const appTypeFqn = appTypeFqnsByIds.get(neighborESID);

      if (mutable.has(appTypeFqn)) {
        const entitySetCount = mutable.get(appTypeFqn).count();
        mutable.setIn([appTypeFqn, entitySetCount], neighborData);
      }
      else {
        mutable.set(appTypeFqn, List([neighborData]));
      }

    });
  });

  return neighborsByFQN;
};

const formatDataGraphResponse = (responseData :Map, app :Map) => {
  const newEntityKeyIdsByEntitySetId = responseData.get('entityKeyIds');
  const newAssociationKeyIdsByEntitySetId = responseData.get('entitySetIds');

  const selectedOrgEntitySetIds = app.get('selectedOrgEntitySetIds', Map());
  const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

  const entities = newEntityKeyIdsByEntitySetId
    .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

  const associations = newAssociationKeyIdsByEntitySetId
    .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

  return {
    entities,
    associations,
  };
};

const removeEntitiesFromEntityIndexToIdMap = (
  deletedEntityData :Object,
  entityIndexToIdMap :Map
) => {
  const newEntityIndexToIdMap = entityIndexToIdMap.map((entityType :Map) => {
    const newEntityType = entityType.map((entityKeyIds) => {
      const entityKeyIdSet = Set(entityKeyIds).asMutable();
      Object.values(deletedEntityData).forEach((deletedEntityKeyIds) => {
        entityKeyIdSet.subtract(deletedEntityKeyIds);
      });
      return entityKeyIdSet.toList();
    });
    return newEntityType;
  });
  return newEntityIndexToIdMap.asImmutable();
};

const mapFirstEntityDataFromNeighbors = (entityNeighbors :Map) => entityNeighbors
  .map((neighbors) => neighbors.first(Map()).get('neighborDetails'));

const getEKIDsFromEntryValues = (neighborMap :Map) => neighborMap
  .valueSeq()
  .map((neighbor) => neighbor.getIn([OPENLATTICE_ID_FQN, 0]));

// returns a list of neighboring entity key ids for each entity of a filtered neighbor search
// Map({
//   <entityKeyId>: List([<neighborEntityKeyId>])
// })
const getEKIDsFromNeighborResponseData = (neighborResponseData) => neighborResponseData
  .map((neighbors) => neighbors.map((neighbor) => getEntityKeyId(neighbor.get('neighborDetails'))));

// returns a flat map of all neighboring entity of a filtered neighbor search keyed by the neighboring entity key id
// Map({
//   <neighborEntityKeyId>: Map(<neighborDetails>)
// })
const getNeighborDetailsFromNeighborResponseData = (neighborResponseData) => Map()
  .withMutations((mutable) => {
    neighborResponseData.forEach((neighbors) => {
      neighbors.forEach((neighbor) => {
        const details = neighbor.get('neighborDetails');
        const entityKeyId = getEntityKeyId(details);
        mutable.set(entityKeyId, details);
      });
    });
  });

export {
  SEARCH_PREFIX,
  formatDataGraphResponse,
  getEKIDsFromEntryValues,
  getEKIDsFromNeighborResponseData,
  getEntityKeyId,
  getEntityKeyIdsFromList,
  getFormDataFromEntity,
  getFormDataFromEntityArray,
  getFqnObj,
  getNeighborDetailsFromNeighborResponseData,
  getSearchTerm,
  groupNeighborsByEntitySetIds,
  groupNeighborsByFQNs,
  inchesToFeetString,
  indexSubmittedDataGraph,
  keyIn,
  mapFirstEntityDataFromNeighbors,
  removeEntitiesFromEntityIndexToIdMap,
  replacePropertyTypeIdsWithFqns,
  simulateResponseData,
  stripIdField,
};
