// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../../utils/Logger';
import {
  GET_OFFICER_SAFETY,
  getOfficerSafety
} from '../OfficerSafetyActions';
import { getResponsePlan } from '../../responseplan/ResponsePlanActions';
import { getResponsePlanWorker } from '../../responseplan/ResponsePlanSagas';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isDefined } from '../../../../../utils/LangUtils';
import { isValidUuid } from '../../../../../utils/Utils';

const LOG = new Logger('ProfileSagas');

function* getOfficerSafetyWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getOfficerSafety.request(action.id));

    const responsePlanResponse = yield call(
      getResponsePlanWorker,
      getResponsePlan(entityKeyId)
    );

    if (responsePlanResponse.error) throw responsePlanResponse.error;

    yield put(getOfficerSafety.success(action.id));
  }
  catch (error) {
    LOG.error(error);
    yield put(getOfficerSafety.failure(action.id));
  }
  finally {
    yield put(getOfficerSafety.finally(action.id));
  }
}

function* getOfficerSafetyWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_OFFICER_SAFETY, getOfficerSafetyWorker);
}

export {
  getOfficerSafetyWorker,
  getOfficerSafetyWatcher,
};
