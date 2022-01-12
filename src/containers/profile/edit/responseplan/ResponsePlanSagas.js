// @flow
import Papa from 'papaparse';
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  OrderedMap,
  Set,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  DELETE_INTERACTION_STRATEGIES,
  GET_ALL_RESPONSE_PLANS_EXPORT,
  GET_RESPONSE_PLAN,
  SUBMIT_RESPONSE_PLAN,
  UPDATE_RESPONSE_PLAN,
  deleteInteractionStrategies,
  getAllResponsePlansExport,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';
import { constructEntityIndexToIdMap, constructResponsePlanFormData } from './ResponsePlanUtils';

import FileSaver from '../../../../utils/FileSaver';
import {
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  deleteBulkEntitiesWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';
import {
  CATEGORY_FQN,
  INDEX_FQN,
  TECHNIQUES_FQN,
  TRIGGER_FQN
} from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import {
  getEntityKeyId,
  groupNeighborsByEntitySetIds,
  removeEntitiesFromEntityIndexToIdMap
} from '../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { addPropertyToRow } from '../../../reports/export/ExportUtils';

const { OPENLATTICE_ID_FQN } = Constants;
const { isDefined } = LangUtils;
const { isValidUUID } = ValidationUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;

const {
  PART_OF_FQN,
  INTERACTION_STRATEGY_FQN,
  PEOPLE_FQN,
  RESPONSE_PLAN_FQN,
  SUBJECT_OF_FQN,
  OFFICER_SAFETY_CONCERNS_FQN,
  BEHAVIOR_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ResponsePlanSagas');

export function* submitResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitResponsePlan.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const responsePlanEKID = newEntityKeyIdsByEntitySetName.getIn([RESPONSE_PLAN_FQN, 0]);
    const interactionStrategyEKIDs = newEntityKeyIdsByEntitySetName.get(INTERACTION_STRATEGY_FQN);

    const newResponsePlanEAKIDMap = constructEntityIndexToIdMap(responsePlanEKID, interactionStrategyEKIDs);
    const entityIndexToIdMap = yield select((state) => state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']));
    const newEntityIndexToIdMap = entityIndexToIdMap.mergeDeep(newResponsePlanEAKIDMap);

    const { path, properties } = value;

    yield put(submitResponsePlan.success(action.id, {
      entityIndexToIdMap: newEntityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitResponsePlan.failure(action.id, error));
  }
  finally {
    yield put(submitResponsePlan.finally(action.id));
  }
}

export function* submitResponsePlanWatcher() :Generator<*, *, *> {
  yield takeEvery(SUBMIT_RESPONSE_PLAN, submitResponsePlanWorker);
}

export function* getResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getResponsePlan.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const subjectOfESID :UUID = getESIDFromApp(app, SUBJECT_OF_FQN);
    const responsePlanESID :UUID = getESIDFromApp(app, RESPONSE_PLAN_FQN);
    const interactionStrategyESID :UUID = getESIDFromApp(app, INTERACTION_STRATEGY_FQN);
    const partOfESID :UUID = getESIDFromApp(app, PART_OF_FQN);

    const responsePlanSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [subjectOfESID],
        destinationEntitySetIds: [responsePlanESID],
        sourceEntitySetIds: [],
      }
    };

    const responsePlanResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(responsePlanSearchParams)
    );

    if (responsePlanResponse.error) throw responsePlanResponse.error;
    const responsePlans = fromJS(responsePlanResponse.data).get(entityKeyId, List());
    if (responsePlans.count() > 1) {
      LOG.warn('more than one response plan found', entityKeyId);
    }

    const responsePlan = responsePlans
      .getIn([0, 'neighborDetails'], Map());
    const responsePlanEKID :UUID = responsePlan.getIn([OPENLATTICE_ID_FQN, 0]);

    let interactionStrategies = List();
    if (responsePlanEKID) {
      const interactionStrategySearchParams = {
        entitySetId: responsePlanESID,
        filter: {
          entityKeyIds: [responsePlanEKID],
          edgeEntitySetIds: [partOfESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [interactionStrategyESID]
        }
      };
      const interactionStrategyResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(interactionStrategySearchParams)
      );

      if (interactionStrategyResponse.error) throw interactionStrategyResponse.error;

      interactionStrategies = fromJS(interactionStrategyResponse.data)
        .get(responsePlanEKID, List())
        .map((entity) => entity.get('neighborDetails', Map()))
        .filter((entity) => !entity.has(TECHNIQUES_FQN))
        .sort((stratA, stratB) => {
          const indexA = stratA.getIn([INDEX_FQN, 0]);
          const indexB = stratB.getIn([INDEX_FQN, 0]);

          if (typeof indexA === 'number' && typeof indexB === 'number') {
            return indexA - indexB;
          }
          return 0;
        });
    }

    const interactionStrategyEKIDs :UUID[] = interactionStrategies
      .map((strategy) => strategy.getIn([OPENLATTICE_ID_FQN, 0]));

    const formData = constructResponsePlanFormData(responsePlan, interactionStrategies);
    const entityIndexToIdMap = constructEntityIndexToIdMap(responsePlanEKID, interactionStrategyEKIDs);

    response.data = responsePlan;

    yield put(getResponsePlan.success(action.id, {
      entityIndexToIdMap,
      formData,
      interactionStrategies,
      responsePlan,
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getResponsePlan.failure(action.id, error));
  }
  finally {
    yield put(getResponsePlan.finally(action.id));
  }

  return response;
}

export function* getResponsePlanWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_RESPONSE_PLAN, getResponsePlanWorker);
}

export function* updateResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateResponsePlan.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateResponsePlan.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateResponsePlan.failure(action.id, error));
  }
  finally {
    yield put(updateResponsePlan.finally(action.id));
  }
}

export function* updateResponsePlanWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_RESPONSE_PLAN, updateResponsePlanWorker);
}

export function* deleteInteractionStrategiesWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteInteractionStrategies.request(action.id));
    const { entityData, path } = value;
    const response = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(entityData));

    if (response.error) throw response.error;

    const entityIndexToIdMap = yield select((state) => state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']));
    const newEntityIndexToIdMap = removeEntitiesFromEntityIndexToIdMap(entityData, entityIndexToIdMap);

    yield put(deleteInteractionStrategies.success(action.id, { entityIndexToIdMap: newEntityIndexToIdMap, path }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(deleteInteractionStrategies.failure(action.id, error));
  }
  finally {
    yield put(deleteInteractionStrategies.finally(action.id));
  }
}

export function* deleteInteractionStrategiesWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_INTERACTION_STRATEGIES, deleteInteractionStrategiesWorker);
}

function getEntitiesByEKIDFromArray(allResponsePlans :Object[]) :Map {
  const entitiesByEKID = Map().withMutations((mutable) => {
    allResponsePlans.forEach((responsePlan) => {
      const entityKeyId = getEntityKeyId(responsePlan);
      mutable.set(entityKeyId, responsePlan);
    });
  });

  return entitiesByEKID;
}

// treats properties across multiple entities as if they were a single property with multiplicity
function getConcatenatedValues(entities, propertyTypeFQN) :string {
  let concatenatedValues = List();

  if (entities && entities.size) {
    entities.forEach((entity) => {
      concatenatedValues = concatenatedValues.concat(entity.get(propertyTypeFQN));
    });
  }

  return concatenatedValues.join('; ');
}

export function* getAllResponsePlansExportWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    yield put(getAllResponsePlansExport.request(action.id));
    // fetch all response plans
    // for each response plan, fetch people, interaction strategy, behavior (trigger), officer safety

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const subjectOfESID :UUID = getESIDFromApp(app, SUBJECT_OF_FQN);
    const responsePlanESID :UUID = getESIDFromApp(app, RESPONSE_PLAN_FQN);
    const interactionStrategyESID :UUID = getESIDFromApp(app, INTERACTION_STRATEGY_FQN);
    const partOfESID :UUID = getESIDFromApp(app, PART_OF_FQN);
    const officerSafetyESID :UUID = getESIDFromApp(app, OFFICER_SAFETY_CONCERNS_FQN);
    const triggerESID :UUID = getESIDFromApp(app, BEHAVIOR_FQN);

    const esidToFQN = {
      [peopleESID]: 'general.person',
      [responsePlanESID]: 'ol.responseplan',
      [interactionStrategyESID]: 'ol.interactionstrategy',
      [officerSafetyESID]: 'ol.officersafetyconcerns',
      [triggerESID]: 'ol.behavior'
    };

    const allResponsePlansResponse = yield call(getEntitySetDataWorker, getEntitySetData({
      entitySetId: responsePlanESID
    }));
    if (allResponsePlansResponse.error) throw allResponsePlansResponse.error;

    const responsePlansByEKID = getEntitiesByEKIDFromArray(fromJS(allResponsePlansResponse.data));
    console.log(responsePlansByEKID);
    const allResponsePlanEKIDs = responsePlansByEKID.keySeq().toJS();

    const neighborsSearchParams = {
      entitySetId: responsePlanESID,
      filter: {
        entityKeyIds: allResponsePlanEKIDs,
        edgeEntitySetIds: [partOfESID, subjectOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [interactionStrategyESID, officerSafetyESID, triggerESID, peopleESID]
      }
    };

    const neighborsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(neighborsSearchParams)
    );

    if (neighborsResponse.error) throw neighborsResponse.error;
    const neighborsByESID = fromJS(neighborsResponse.data).map((neighbors) => groupNeighborsByEntitySetIds(neighbors));
    console.log(neighborsResponse.data, neighborsByESID);

    // each group of neighbors is a row
    // where the contents of the row include
    // all person properties
    // response plan ekid
    // concatenated triggers
    // concatenated officer safety
    // interaction strategy titles and descriptions sorted by index
    // response plan notes

    const getRowFromResponsePlanNeighbors = (
      neighbors :Map<UUID, List>,
      responsePlan :Map,
    ) :OrderedMap => {
      const row = OrderedMap().withMutations((mutable) => {
        // add person
        const person = neighbors.get(peopleESID).first();
        person.forEach((propertyValue, propertyType) => {
          addPropertyToRow(
            mutable,
            PEOPLE_FQN,
            propertyValue,
            propertyType,
            true
          );
        });

        // add response plan
        responsePlan.forEach((propertyValue, propertyType) => {
          addPropertyToRow(
            mutable,
            esidToFQN[responsePlanESID],
            propertyValue,
            propertyType,
            true
          );
        });

        // add triggers
        const triggerEntities = neighbors.get(triggerESID);
        const triggers = getConcatenatedValues(triggerEntities, TRIGGER_FQN);
        addPropertyToRow(
          mutable,
          esidToFQN[triggerESID],
          triggers,
          TRIGGER_FQN.toString()
        );

        // add officer safety
        const officerSafetyEntities = neighbors.get(officerSafetyESID);
        const safeties = getConcatenatedValues(officerSafetyEntities, CATEGORY_FQN);
        addPropertyToRow(
          mutable,
          esidToFQN[officerSafetyESID],
          safeties,
          CATEGORY_FQN.toString()
        );

        const interactionEntities = neighbors.get(interactionStrategyESID);
        if (interactionEntities) {
          interactionEntities.forEach((entity) => {
            entity.forEach((propertyValue, propertyType) => {
              addPropertyToRow(
                mutable,
                esidToFQN[interactionStrategyESID],
                propertyValue,
                propertyType,
                false,
                true
              );
            });
          });
        }
      });

      return row;
    };

    let csvData = List();
    let fields = Set();

    neighborsByESID.forEach((neighbors, responsePlanEKID) => {
      const responsePlan = responsePlansByEKID.get(responsePlanEKID);
      const row = getRowFromResponsePlanNeighbors(neighbors, responsePlan);
      csvData = csvData.push(row);
      fields = fields.union(row.keys());
    });

    const csv = Papa.unparse({
      fields: fields.sort().toJS(),
      data: csvData.toJS()
    });

    FileSaver.saveFile(csv, 'responseplans.csv', 'text/csv');

    workerResponse = {
      data: {}
    };
    yield put(getAllResponsePlansExport.success(action.id));
  }
  catch (error) {
    workerResponse = {
      error
    };
    yield put(getAllResponsePlansExport.failure(action.id));
  }
  finally {
    yield put(getAllResponsePlansExport.finally(action.id));
  }
  return workerResponse;
}

export function* getAllResponsePlansExportWatcher() :Saga<void> {
  yield takeLatest(GET_ALL_RESPONSE_PLANS_EXPORT, getAllResponsePlansExportWorker);
}
