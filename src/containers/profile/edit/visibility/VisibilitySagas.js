// @flow
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
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';
import type { Saga } from 'redux-saga';

import {
  GET_PROFILE_VISIBILITY,
  PUT_PROFILE_VISIBILITY,
  getProfileVisibility,
  putProfileVisibility,
} from './VisibilityActions';

import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';
import { STATUS_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';

const { OPENLATTICE_ID_FQN } = Constants;
const { isDefined } = LangUtils;
const { isValidUUID } = ValidationUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  REGISTERED_FOR_FQN,
  SUMMARY_SET_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('VisibilitySagas');

function* getProfileVisibilityWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    yield put(getProfileVisibility.request(action.id, action.value));
    yield put(getProfileVisibility.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getProfileVisibility.failure(action.id), error);
  }
  return response;
}

function* getProfileVisibilityWatcher() :Saga<void> {
  yield takeLatest(GET_PROFILE_VISIBILITY, getProfileVisibilityWorker);
}

function* putProfileVisibilityWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    const { entityKeyId, status } = action.value;
    if (typeof status !== 'string') throw ERR_ACTION_VALUE_TYPE;
    yield put(putProfileVisibility.request(action.id, action.value));
    yield put(putProfileVisibility.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(putProfileVisibility.failure(action.id), error);
  }
  return response;
}

function* putProfileVisibilityWatcher() :Saga<void> {
  yield takeEvery(PUT_PROFILE_VISIBILITY, putProfileVisibilityWorker);
}

export {
  getProfileVisibilityWatcher,
  getProfileVisibilityWorker,
  putProfileVisibilityWatcher,
  putProfileVisibilityWorker,
};
