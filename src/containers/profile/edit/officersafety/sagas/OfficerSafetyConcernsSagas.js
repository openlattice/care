// @flow
import {
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../../utils/Logger';
import {
  GET_OFFICER_SAFETY_CONCERNS,
  SUBMIT_OFFICER_SAFETY_CONCERNS,
  UPDATE_OFFICER_SAFETY_CONCERNS,
  getOfficerSafetyConcerns,
  submitOfficerSafetyConcerns,
  updateOfficerSafetyConcerns,
  DELETE_OFFICER_SAFETY_CONCERNS,
  deleteOfficerSafetyConcerns,
} from '../OfficerSafetyActions';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isDefined } from '../../../../../utils/LangUtils';
import { isValidUuid } from '../../../../../utils/Utils';
import { getESIDFromApp } from '../../../../../utils/AppUtils';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
} from '../../../../../core/sagas/data/DataActions';
import {
  deleteBulkEntitiesWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../../core/sagas/data/DataSagas';
import { getResponsePlan } from '../../responseplan/ResponsePlanActions';
import { constructFormData, constructEntityIndexToIdMap } from '../utils/OfficerSafetyConcernsUtils';
import { TECHNIQUES_FQN } from '../../../../../edm/DataModelFqns';
import { getEntityKeyIdsFromList, groupNeighborsByEntitySetIds } from '../../../../../utils/DataUtils';

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('OfficerSafetyConcernsSagas');

const {
  BEHAVIOR_FQN,
  INCLUDES_FQN,
  INTERACTION_STRATEGY_FQN,
  OFFICER_SAFETY_CONCERNS_FQN,
  RESPONSE_PLAN_FQN,
} = APP_TYPES_FQNS;

function* getOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getOfficerSafetyConcerns.request(action.id));

    const app :Map = yield select(state => state.get('app', Map()));
    const includesESID :UUID = getESIDFromApp(app, INCLUDES_FQN);
    const officerSafetyConcernsESID :UUID = getESIDFromApp(app, OFFICER_SAFETY_CONCERNS_FQN);
    const responsePlanESID :UUID = getESIDFromApp(app, RESPONSE_PLAN_FQN);
    const interactionStrategiesESID :UUID = getESIDFromApp(app, INTERACTION_STRATEGY_FQN);
    const behaviorESID :UUID = getESIDFromApp(app, BEHAVIOR_FQN);

    const safetyConcernsSearchParams = {
      entitySetId: responsePlanESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [includesESID],
        destinationEntitySetIds: [
          behaviorESID,
          interactionStrategiesESID,
          officerSafetyConcernsESID
        ],
        sourceEntitySetIds: []
      }
    };

    const safetyConcernsNeighbors = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(safetyConcernsSearchParams)
    );

    if (safetyConcernsNeighbors.error) throw safetyConcernsNeighbors.error;
    const neighbors = fromJS(safetyConcernsNeighbors.data)
      .get(entityKeyId, List());

    const neighborsByESID = groupNeighborsByEntitySetIds(neighbors);

    const safetyConcerns = neighborsByESID.get(officerSafetyConcernsESID, List());
    const behaviors = neighborsByESID.get(behaviorESID, List());

    // only strategies with techniques should appear as a safety concern
    const interactionStrategies = neighborsByESID
      .get(interactionStrategiesESID, List())
      .filter((strategy :Map) => strategy.has(TECHNIQUES_FQN));

    const safetyConcernsEKIDs = getEntityKeyIdsFromList(safetyConcerns);
    const behaviorsEKIDs = getEntityKeyIdsFromList(behaviors);
    const interactionStrategiesEKIDs = getEntityKeyIdsFromList(interactionStrategies);

    const formData = constructFormData(
      safetyConcerns,
      behaviors,
      interactionStrategies
    );
    const entityIndexToIdMap = constructEntityIndexToIdMap(
      safetyConcernsEKIDs,
      behaviorsEKIDs,
      interactionStrategiesEKIDs
    );

    yield put(getOfficerSafetyConcerns.success(action.id, {
      data: safetyConcerns,
      entityIndexToIdMap,
      formData,
      behaviors,
      interactionStrategies,
    }));
  }
  catch (error) {
    LOG.error('getOfficerSafetyConcernsWorker', error);
    yield put(getOfficerSafetyConcerns.failure(action.id));
  }
  finally {
    yield put(getOfficerSafetyConcerns.finally(action.id));
  }
}

function* getOfficerSafetyConcernsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_OFFICER_SAFETY_CONCERNS, getOfficerSafetyConcernsWorker);
}

function* submitOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitOfficerSafetyConcerns.request(action.id));

    const submitSafetyConcernsResponse = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (submitSafetyConcernsResponse.error) throw submitSafetyConcernsResponse.error;

    const newEntityKeyIdsByEntitySetId = fromJS(submitSafetyConcernsResponse.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select(state => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys(entitySetId => entitySetNamesByEntitySetId.get(entitySetId));

    // set blank response plan if created
    const responsePlanEKID = newEntityKeyIdsByEntitySetName.getIn([RESPONSE_PLAN_FQN, 0]);

    if (isValidUuid(responsePlanEKID)) {
      const responsePlanPayload = {
        responsePlan: fromJS({
          [OPENLATTICE_ID_FQN]: [responsePlanEKID]
        }),
        entityIndexToIdMap: Map().setIn([RESPONSE_PLAN_FQN.toString(), 0], responsePlanEKID),
        formData: Map(),
        interactionStrategies: List()
      };


      yield put({
        type: getResponsePlan.SUCCESS,
        value: responsePlanPayload
      });

      // yield put(getResponsePlan.success(action.id, responsePlanPayload));
    }

    const safetyConcernsEKIDs = newEntityKeyIdsByEntitySetName.get(OFFICER_SAFETY_CONCERNS_FQN, List());
    const behaviorsEKIDs = newEntityKeyIdsByEntitySetName.get(BEHAVIOR_FQN, List());
    const interactionStrategiesEKIDs = newEntityKeyIdsByEntitySetName.get(INTERACTION_STRATEGY_FQN, List());

    const safetyConcernsIndexToIdMap = constructEntityIndexToIdMap(
      safetyConcernsEKIDs,
      behaviorsEKIDs,
      interactionStrategiesEKIDs,
    );

    const entityIndexToIdMap = yield select(
      state => state.getIn([
        'profile',
        'officerSafety',
        'officerSafetyConcerns',
        'entityIndexToIdMap'
      ])
    );

    const newEntityIndexToIdMap = entityIndexToIdMap.mergeDeep(safetyConcernsIndexToIdMap);
    const { path, properties } = value;

    yield put(submitOfficerSafetyConcerns.success(action.id, {
      entityIndexToIdMap: newEntityIndexToIdMap,
      path,
      properties: fromJS(properties)
    }));
  }
  catch (error) {
    LOG.error('submitOfficerSafetyConcernsWorker', error);
    yield put(submitOfficerSafetyConcerns.failure(action.id));
  }
  finally {
    yield put(submitOfficerSafetyConcerns.finally(action.id));
  }
}

function* submitOfficerSafetyConcernsWatcher() :Generator<any, any, any> {
  yield takeLatest(SUBMIT_OFFICER_SAFETY_CONCERNS, submitOfficerSafetyConcernsWorker);
}

function* updateOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateOfficerSafetyConcerns.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateOfficerSafetyConcerns.success(action.id));
  }
  catch (error) {
    LOG.error('updateOfficerSafetyConcernsWorker', error);
    yield put(updateOfficerSafetyConcerns.failure(action.id, error));
  }
  finally {
    yield put(updateOfficerSafetyConcerns.finally(action.id));
  }
}

function* updateOfficerSafetyConcernsWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_OFFICER_SAFETY_CONCERNS, updateOfficerSafetyConcernsWorker);
}

function* deleteOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteOfficerSafetyConcerns.request(action.id));
    const { entityData, path } = value;
    const response = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(entityData));

    if (response.error) throw response.error;

    yield put(deleteOfficerSafetyConcerns.success(action.id, { path }));
  }
  catch (error) {
    LOG.error('deleteOfficerSafetyConcernsWorker', error);
    yield put(deleteOfficerSafetyConcerns.failure(action.id, error));
  }
  finally {
    yield put(deleteOfficerSafetyConcerns.finally(action.id));
  }
}

function* deleteOfficerSafetyConcernsWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_OFFICER_SAFETY_CONCERNS, deleteOfficerSafetyConcernsWorker);
}

export {
  deleteOfficerSafetyConcernsWatcher,
  deleteOfficerSafetyConcernsWorker,
  getOfficerSafetyConcernsWatcher,
  getOfficerSafetyConcernsWorker,
  submitOfficerSafetyConcernsWatcher,
  submitOfficerSafetyConcernsWorker,
  updateOfficerSafetyConcernsWatcher,
  updateOfficerSafetyConcernsWorker
};
