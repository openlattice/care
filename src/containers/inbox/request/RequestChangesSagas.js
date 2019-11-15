// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/Errors';
import { submitDataGraph } from '../../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../../core/sagas/data/DataSagas';
import { isDefined } from '../../../utils/LangUtils';

import { SUBMIT_REQUEST_CHANGES, submitRequestChanges } from './RequestChangesActions';

const LOG = new Logger('RequestChangesSagas');

function* submitRequestChangesWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(submitRequestChanges.request(action.id));

    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitRequestChanges.success(action.id));
  }
  catch (error) {
    LOG.error('submitRequestChangesWorker', error);
    yield put(submitRequestChanges.failure(action.id));
  }
}

function* submitRequestChangesWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_REQUEST_CHANGES, submitRequestChangesWorker);
}

export {
  submitRequestChangesWorker,
  submitRequestChangesWatcher,
};
