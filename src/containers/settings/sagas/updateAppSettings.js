// @flow

import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { selectEntitySetId, selectPropertyTypeId } from '../../../core/redux/selectors';
import { APP_DETAILS_FQN } from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { UPDATE_APP_SETTINGS, updateAppSettings } from '../actions';

const { updateEntityData } = DataApiActions;
const { updateEntityDataWorker } = DataApiSagas;
const { UpdateTypes } = Types;

const { APP_SETTINGS_FQN } = APP_TYPES_FQNS;

const LOG = new Logger('SettingsSagas');
const { isValidUUID } = ValidationUtils;

function* updateAppSettingsWorker(action :SequenceAction) :Saga<WorkerResponse> {
  let workerResponse = {};
  try {
    const { settings, id } = action.value;
    if (!isValidUUID(id)) throw ERR_ACTION_VALUE_TYPE;
    if (!Map.isMap(settings)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updateAppSettings.request(action.id, action.value));
    const appSettingsESID :UUID = yield select(selectEntitySetId(APP_SETTINGS_FQN));
    const appDetailsPTID :UUID = yield select(selectPropertyTypeId(APP_DETAILS_FQN));
    const appDetailsPTID2 :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', APP_DETAILS_FQN]));

    console.log(appDetailsPTID, appDetailsPTID2);

    debugger;

    const updateResponse = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: appSettingsESID,
        entities: {
          [id]: {
            [appDetailsPTID]: [JSON.stringify(settings)]
          }
        },
        updateType: UpdateTypes.PartialReplace,
      }),
    );

    if (updateResponse.error) throw updateResponse.error;

    workerResponse = { data: action.value };
    yield put(updateAppSettings.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(updateAppSettings.failure(action.id));
  }
  finally {
    yield put(updateAppSettings.finally(action.id));
  }

  return workerResponse;
}

function* updateAppSettingsWatcher() :Saga<void> {
  yield takeEvery(UPDATE_APP_SETTINGS, updateAppSettingsWorker);
}

export {
  updateAppSettingsWatcher,
  updateAppSettingsWorker,
};
