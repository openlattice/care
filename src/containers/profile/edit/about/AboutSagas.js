// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { getSearchTerm } from '../../../../utils/DataUtils';
import * as FQN from '../../../../edm/DataModelFqns';

import {
  GET_RESPONSIBLE_USER,
  getResponsibleUser,
} from './AboutActions';

const { STAFF_FQN } = APP_TYPES_FQNS;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;

function* getResponsibleUserWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    yield put(getResponsibleUser.request(action.id));
    // const app :Map = yield select(state => state.get('app', Map()));
    // const entitySetId :UUID = getESIDFromApp(app, STAFF_FQN);
    // const personIdPTId :UUID = yield select(state => state.getIn(['edm', 'fqnToIdMap', FQN.PERSON_ID_FQN]));
    // const searchOptions :Object = {
    //   maxHits: 10000,
    //   searchTerm: getSearchTerm(personIdPTId, '*'),
    //   start: 0,
    // };

    // const response = yield call(
    //   searchEntitySetDataWorker,
    //   searchEntitySetData({
    //     entitySetId,
    //     searchOptions
    //   })
    // );

    debugger;

    if (response.error) throw response.error;

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

export {
  getResponsibleUserWatcher,
  getResponsibleUserWorker,
};
