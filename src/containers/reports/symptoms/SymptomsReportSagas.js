// @flow
import {
  put,
  takeEvery,
  takeLatest
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_SYMPTOMS_REPORT,
  SUBMIT_SYMPTOMS_REPORT,
  UPDATE_SYMPTOMS_REPORT,
  getSymptomsReport,
  submitSymptomsReport,
  updateSymptomsReport,
} from './SymptomsReportActions';

import Logger from '../../../utils/Logger';

const LOG = new Logger('SymptomsReportSagas');

function* getSymptomsReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(getSymptomsReport.request(action.id));
    yield put(getSymptomsReport.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getSymptomsReport.failure(action.id, error));
  }
  return response;
}

function* getSymptomsReportWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SYMPTOMS_REPORT, getSymptomsReportWorker);
}

function* submitSymptomsReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(submitSymptomsReport.request(action.id));
    yield put(submitSymptomsReport.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitSymptomsReport.failure(action.id, error));
  }
  return response;
}

function* submitSymptomsReportWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_SYMPTOMS_REPORT, submitSymptomsReportWorker);
}

function* updateSymptomsReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(updateSymptomsReport.request(action.id));
    yield put(updateSymptomsReport.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateSymptomsReport.failure(action.id, error));
  }
  return response;
}

function* updateSymptomsReportWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_SYMPTOMS_REPORT, updateSymptomsReportWorker);
}

export {
  getSymptomsReportWorker,
  getSymptomsReportWatcher,
  submitSymptomsReportWorker,
  submitSymptomsReportWatcher,
  updateSymptomsReportWorker,
  updateSymptomsReportWatcher,
}