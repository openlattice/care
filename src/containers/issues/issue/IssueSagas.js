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

import { SUBMIT_ISSUE, submitIssue } from './IssueActions';

const LOG = new Logger('IssueSagas');

function* submitIssueWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(submitIssue.request(action.id));

    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitIssue.success(action.id));
  }
  catch (error) {
    LOG.error('submitIssueWorker', error);
    yield put(submitIssue.failure(action.id));
  }
}

function* submitIssueWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ISSUE, submitIssueWorker);
}

export {
  submitIssueWorker,
  submitIssueWatcher,
};
