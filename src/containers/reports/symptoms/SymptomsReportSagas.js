// @flow

import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_SYMPTOMS_REPORT,
  SUBMIT_SYMPTOMS_REPORT,
  UPDATE_SYMPTOMS_REPORT,
  getSymptomsReport,
  submitSymptomsReport,
  updateSymptomsReport,
} from './SymptomsReportActions';
import { getSymptomsReportAssociations, postProcessSymptoms } from './SymptomsReportUtils';

import Logger from '../../../utils/Logger';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';

const { processAssociationEntityData, processEntityData } = DataProcessingUtils;
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
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitSymptomsReport.request(action.id));
    const { formData, position, selectedPerson } = value;

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const currentStaff = yield select((state) => state.getIn(['staff', 'currentUser', 'data'], Map()));

    const postProcessedData = postProcessSymptoms(formData, position);

    const entityData = processEntityData(postProcessedData, entitySetIds, propertyTypeIds);
    const existingEKIDs = {
      [APP.PEOPLE_FQN]: getEntityKeyId(selectedPerson),
      [APP.STAFF_FQN]: getEntityKeyId(currentStaff)
      // add incidentEKID
    };

    const associationEntityData = processAssociationEntityData(
      getSymptomsReportAssociations(formData, existingEKIDs),
      entitySetIds,
      propertyTypeIds
    );

    const dataGraphResponse = yield call(
      submitDataGraphWorker,
      submitDataGraph({
        entityData,
        associationEntityData,
      })
    );
    if (dataGraphResponse.error) throw dataGraphResponse.error;
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