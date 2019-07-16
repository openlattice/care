// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../utils/Logger';
import {
  SUBMIT_RESPONSE_PLAN,
  submitResponsePlan,
} from './ResponsePlanActions';
import { submitDataGraphWorker } from '../../../../core/sagas/data/DataSagas';
import { submitDataGraph } from '../../../../core/sagas/data/DataActions';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/Errors';

const LOG = new Logger('ProfileSagas');

export function* submitResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitResponsePlan.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(action.value));
    if (response.error) throw response.error;
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
