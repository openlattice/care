// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../utils/Logger';
import {
  DELETE_INTERACTION_STRATEGIES,
  GET_RESPONSE_PLAN,
  SUBMIT_RESPONSE_PLAN,
  UPDATE_RESPONSE_PLAN,
  deleteInteractionStrategies,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';
import { constructResponsePlanFormData, constructResponsePlanEAKIDMap } from './ResponsePlanUtils';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';
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
// import * as FQN from '../../../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  INCLUDES_FQN,
  INTERACTION_STRATEGY_FQN,
  PEOPLE_FQN,
  RESPONSE_PLAN_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ProfileSagas');

export function* submitResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitResponsePlan.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(action.value));
    if (response.error) throw response.error;

    const entityIndexToIdMap = yield select(state => state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']));
    console.log(entityIndexToIdMap);
    yield put(submitResponsePlan.success(action.id));
  }
  catch (error) {
    LOG.error(error);
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
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getResponsePlan.request(action.id));

    const app :Map = yield select(state => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const subjectOfESID :UUID = getESIDFromApp(app, SUBJECT_OF_FQN);
    const responsePlanESID :UUID = getESIDFromApp(app, RESPONSE_PLAN_FQN);
    const interactionStrategyESID :UUID = getESIDFromApp(app, INTERACTION_STRATEGY_FQN);
    const includesESID :UUID = getESIDFromApp(app, INCLUDES_FQN);

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
    const responsePlanEKID = responsePlan.getIn([OPENLATTICE_ID_FQN, 0]);

    let interactionStrategies = List();
    if (responsePlanEKID) {
      const interactionStrategySearchParams = {
        entitySetId: responsePlanESID,
        filter: {
          entityKeyIds: [responsePlanEKID],
          edgeEntitySetIds: [includesESID],
          destinationEntitySetIds: [interactionStrategyESID],
          sourcesEntitySetIds: []
        }
      };
      const interactionStrategyResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(interactionStrategySearchParams)
      );

      if (interactionStrategyResponse.error) throw interactionStrategyResponse.error;

      interactionStrategies = fromJS(interactionStrategyResponse.data)
        .get(responsePlanEKID, List())
        .map(entity => entity.get('neighborDetails', Map()));
    }

    const formData = constructResponsePlanFormData(responsePlan, interactionStrategies);
    const entityIndexToIdMap = constructResponsePlanEAKIDMap(responsePlan, interactionStrategies);

    yield put(getResponsePlan.success(action.id, {
      entityIndexToIdMap,
      formData,
      interactionStrategies,
      responsePlan,
    }));
  }
  catch (error) {
    LOG.error(error);
    yield put(getResponsePlan.failure(action.id, error));
  }
  finally {
    yield put(getResponsePlan.finally(action.id));
  }
}

export function* getResponsePlanWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_RESPONSE_PLAN, getResponsePlanWorker);
}

export function* updateResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateResponsePlan.request(action.id));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateResponsePlan.success(action.id, value));
  }
  catch (error) {
    LOG.error(error);
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
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteInteractionStrategies.request(action.id));
    const response = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(action.value));

    if (response.error) throw response.error;

    yield put(deleteInteractionStrategies.success(action.id));
  }
  catch (error) {
    LOG.error(error);
    yield put(deleteInteractionStrategies.failure(action.id, error));
  }
  finally {
    yield put(deleteInteractionStrategies.finally(action.id));
  }
}

export function* deleteInteractionStrategiesWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_INTERACTION_STRATEGIES, deleteInteractionStrategiesWorker);
}
