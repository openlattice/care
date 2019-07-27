/*
 * @flow
 */

import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { Models, Types } from 'lattice';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_WORKER_SAGA } from '../../../utils/Errors';
import {
  DELETE_BULK_ENTITIES,
  SUBMIT_DATA_GRAPH,
  SUBMIT_PARTIAL_REPLACE,
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
} from './DataActions';

const LOG = new Logger('DataSagas');
const { DataGraphBuilder } = Models;
const { UpdateTypes, DeleteTypes } = Types;
const {
  createEntityAndAssociationData,
  deleteEntitiesAndNeighbors,
  updateEntityData,
} = DataApiActions;
const {
  createEntityAndAssociationDataWorker,
  deleteEntitiesAndNeighborsWorker,
  updateEntityDataWorker,
} = DataApiSagas;

/*
 *
 * DataActions.submitDataGraph()
 *
 */

function* submitDataGraphWorker(action :SequenceAction) :Generator<*, *, *> {

  const sagaResponse :Object = {};

  const { id, value } = action;
  if (value === null || value === undefined) {
    sagaResponse.error = ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(submitDataGraph.failure(id, sagaResponse.error));
    return sagaResponse;
  }

  try {
    yield put(submitDataGraph.request(action.id, value));

    const dataGraph = (new DataGraphBuilder())
      .setAssociations(value.associationEntityData)
      .setEntities(value.entityData)
      .build();

    const response = yield call(createEntityAndAssociationDataWorker, createEntityAndAssociationData(dataGraph));
    if (response.error) throw response.error;
    sagaResponse.data = response.data;

    yield put(submitDataGraph.success(action.id, response.data));
  }
  catch (error) {
    sagaResponse.error = error;
    LOG.error(ERR_WORKER_SAGA, error);
    yield put(submitDataGraph.failure(action.id, error));
  }
  finally {
    yield put(submitDataGraph.finally(action.id));
  }

  return sagaResponse;
}

function* submitDataGraphWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_DATA_GRAPH, submitDataGraphWorker);
}

/*
 *
 * DataActions.submitPartialReplace()
 *
 */

function* submitPartialReplaceWorker(action :SequenceAction) :Generator<*, *, *> {

  const sagaResponse :Object = {};

  const { id, value } = action;
  if (value === null || value === undefined) {
    sagaResponse.error = ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(submitPartialReplace.failure(id, sagaResponse.error));
    return sagaResponse;
  }

  try {
    yield put(submitPartialReplace.request(action.id, value));

    const calls = [];
    const { entityData } = value;
    Object.keys(entityData).forEach((entitySetId :UUID) => {
      calls.push(
        call(
          updateEntityDataWorker,
          updateEntityData({
            entitySetId,
            entities: entityData[entitySetId],
            updateType: UpdateTypes.PartialReplace,
          }),
        )
      );
    });

    const updateResponses = yield all(calls);
    const responseErrors = updateResponses.reduce((acc, response) => {
      if (response.error) {
        acc.push(response.error);
      }
      return acc;
    }, []);
    const errors = {
      errors: responseErrors
    };

    if (responseErrors.length) throw errors;

    yield put(submitPartialReplace.success(action.id));
  }
  catch (error) {
    sagaResponse.error = error;
    LOG.error(ERR_WORKER_SAGA, error);
    yield put(submitPartialReplace.failure(action.id, error));
  }
  finally {
    yield put(submitPartialReplace.finally(action.id));
  }

  return sagaResponse;
}

function* submitPartialReplaceWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_PARTIAL_REPLACE, submitPartialReplaceWorker);
}

/*
 *
 * DataActions.deleteBulkEntities()
 *
 */

function* deleteBulkEntitiesWorker(action :SequenceAction) :Generator<*, *, *> {

  const sagaResponse :Object = {};

  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteBulkEntities.request(action.id));

    const deleteRequests = Object.keys(value).map((entitySetId) => {
      const entityKeyIds = Array.from(value[entitySetId]);

      const filter = {
        entityKeyIds,
        destinationEntitySetIds: [],
        sourceEntitySetIds: []
      };

      return call(
        deleteEntitiesAndNeighborsWorker,
        deleteEntitiesAndNeighbors({
          entitySetId,
          filter,
          deleteType: DeleteTypes.SOFT
        })
      );
    });

    const deleteResponses = yield all(deleteRequests);
    const reducedError = deleteResponses.reduce((error, response) => error || response.error);
    if (reducedError) throw reducedError;

    yield put(deleteBulkEntities.success(action.id));
  }
  catch (error) {
    sagaResponse.error = error;
    yield put(deleteBulkEntities.failure(action.id, error));
  }
  finally {
    yield put(deleteBulkEntities.finally(action.id));
  }

  return sagaResponse;
}

function* deleteBulkEntitiesWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_BULK_ENTITIES, deleteBulkEntitiesWorker);
}

export {
  deleteBulkEntitiesWatcher,
  deleteBulkEntitiesWorker,
  submitDataGraphWatcher,
  submitDataGraphWorker,
  submitPartialReplaceWatcher,
  submitPartialReplaceWorker,
};
