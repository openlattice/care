// @flow

import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import { Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { selectEntitySetId } from '../../../core/redux/selectors';
import { APP_DETAILS_FQN } from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { GET_APP_SETTINGS, getAppSettings } from '../actions';

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;

const { APP_SETTINGS_FQN } = APP_TYPES_FQNS;

const LOG = new Logger('SettingsSagas');
const { isValidUUID } = ValidationUtils;

function* getAppSettingsWorker(action :SequenceAction) :Saga<WorkerResponse> {
  const workerResponse :Object = {};

  try {
    yield put(getAppSettings.request(action.id));

    const appSettingsESID = yield select(selectEntitySetId(APP_SETTINGS_FQN));
    if (!isValidUUID(appSettingsESID)) throw ERR_ACTION_VALUE_TYPE;

    const appSettingsResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetIds: [appSettingsESID],
        constraints: [{
          constraints: [{
            searchTerm: '*'
          }],
        }],
        maxHits: 10000,
        start: 0,
      })
    );

    if (appSettingsResponse.error) throw appSettingsResponse.error;

    let settings = Map();
    let id = '';
    const appSettingsHit = fromJS(appSettingsResponse?.data?.hits || []).first();
    if (appSettingsHit) {
      const appDetails = appSettingsHit.getIn([APP_DETAILS_FQN, 0]);
      id = appSettingsHit.getIn([OPENLATTICE_ID_FQN, 0]);
      try {
        const parsedAppDetails = JSON.parse(appDetails);
        const parsedAppSettings = fromJS(parsedAppDetails);
        settings = parsedAppSettings;
      }
      catch (error) {
        LOG.error('could not parse app details');
      }
    }
    workerResponse.data = fromJS({ settings, id });

    yield put(getAppSettings.success(action.id, workerResponse.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse.error = error;
    yield put(getAppSettings.failure(action.id), error);
  }
  finally {
    yield put(getAppSettings.finally(action.id));
  }
  return workerResponse;
}

function* getAppSettingsWatcher():Saga<void> {
  yield takeEvery(GET_APP_SETTINGS, getAppSettingsWorker);
}

export {
  getAppSettingsWorker,
  getAppSettingsWatcher,
};
