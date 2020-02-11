// @flow
import isPlainObject from 'lodash/isPlainObject';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  getIn,
  has,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  DataApiActions,
  DataApiSagas
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  SUBMIT_CRISIS_REPORT,
  submitCrisisReport
} from './CrisisActions';

import Logger from '../../../utils/Logger';
import { LOGIN_PATH } from '../../../core/router/Routes';
import {
  createOrReplaceAssociation,
  submitDataGraph,
  submitPartialReplace,
} from '../../../core/sagas/data/DataActions';
import {
  createOrReplaceAssociationWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../core/sagas/data/DataSagas';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';

const { processEntityData, processAssociationEntityData } = DataProcessingUtils;

const LOG = new Logger('XCrisisReportSagas');

function* submitCrisisReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {};
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitCrisisReport.request(action.id));
    const { formData, selectedPerson } = value;
    const now = DateTime.local().toISO();

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    console.log(entityData);
    
    yield put(submitCrisisReport.success(action.id));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(submitCrisisReport.failure(action.id, error));
  }
  return response;
}

function* submitCrisisReportWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_CRISIS_REPORT, submitCrisisReportWorker);
}

export {
  submitCrisisReportWorker,
  submitCrisisReportWatcher,
}