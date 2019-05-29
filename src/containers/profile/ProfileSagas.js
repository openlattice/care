// @flow
import { DateTime } from 'luxon';
import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';

import type { SequenceAction } from 'redux-reqseq';

import { GET_PROFILE_REPORTS, getProfileReports } from './ProfileActions';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isDefined } from '../../utils/LangUtils';
import { isValidUuid } from '../../utils/Utils';

const {
  searchEntitySetData,
  searchEntityNeighborsWithFilter,
} = SearchApiActions;

const {
  searchEntitySetDataWorker,
  searchEntityNeighborsWithFilterWorker,
} = SearchApiSagas;

function* getProfileReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileReports.request(action.id, entityKeyId));
    yield put(getProfileReports.request(action.id));
  }
  catch (error) {
    yield put(getProfileReports.failure(action.id));
  }
  finally {
    yield put(getProfileReports.finally(action.id));

  }
}

function getProfileReportsWatcher() :Generator<any, any, any> {
  takeEvery(GET_PROFILE_REPORTS, getProfileReportsWorker);
}

export {
  getProfileReportsWorker,
  getProfileReportsWatcher,
};
