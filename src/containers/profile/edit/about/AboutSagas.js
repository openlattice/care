// @flow
import {
  call,
  put,
  all,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { Constants } from 'lattice';
import { Map, getIn } from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { getResponsePlan } from '../responseplan/ResponsePlanActions';
import { getResponsePlanWorker } from '../responseplan/ResponsePlanSagas';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { isValidUuid } from '../../../../utils/Utils';
import * as FQN from '../../../../edm/DataModelFqns';

import {
  GET_ABOUT_PLAN,
  GET_RESPONSIBLE_USER,
  getAboutPlan,
  getResponsibleUser,
} from './AboutActions';

const { OPENLATTICE_ID_FQN } = Constants;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  HAS_RELATIONSHIP_WITH_FQN,
  OFFICERS_FQN,
  PEOPLE_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

function* getResponsibleUserWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getResponsibleUser.request(action.id));
    const app :Map = yield select(state => state.get('app', Map()));
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const officersESID = getESIDFromApp(app, OFFICERS_FQN);
    const hasRelationshipWithESID = getESIDFromApp(app, HAS_RELATIONSHIP_WITH_FQN);

    const officerSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [hasRelationshipWithESID],
        destinationEntitySetIds: [officersESID],
        sourceEntitySetIds: [],
      }
    };

    // TODO: search for employee -> assignedto -> consumer
    // then search for person associated to employee.

    // return resulting person object

    yield put(getResponsibleUser.success(action.id));
  }
  catch (error) {
    yield put(getResponsibleUser.failure(action.id));
  }
  finally {
    yield put(getResponsibleUser.finally(action.id));
  }
}

function* getResponsibleUserWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_RESPONSIBLE_USER, getResponsibleUserWorker);
}

function* getAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getAboutPlan.request(action.id, entityKeyId));

    const responsePlanRequest = call(
      getResponsePlanWorker,
      getResponsePlan(entityKeyId)
    );

    const responsibleUserRequest = call(
      getResponsibleUserWorker,
      getResponsibleUser(entityKeyId)
    );

    const [responsePlan, responsibleUser] = yield all([
      responsePlanRequest,
      responsibleUserRequest
    ]);

    if (responsePlan.error) throw responsePlan.error;
    if (responsibleUser.error) throw responsibleUser.error;

    // create formData and entityIndexToIdMap

    yield put(getAboutPlan.success(action.id));
  }
  catch (error) {
    yield put(getAboutPlan.failure(action.id));
  }
  finally {
    yield put(getAboutPlan.finally(action.id));
  }
}

function* getAboutPlanWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ABOUT_PLAN, getAboutPlanWorker);
}

export {
  getAboutPlanWatcher,
  getAboutPlanWorker,
  getResponsibleUserWatcher,
  getResponsibleUserWorker,
};
