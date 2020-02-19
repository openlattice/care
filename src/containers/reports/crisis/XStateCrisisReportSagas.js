// @flow
import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  Map,
} from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import type { SequenceAction } from 'redux-reqseq';

import {
  SUBMIT_CRISIS_REPORT,
  submitCrisisReport
} from './CrisisActions';
import { getCrisisReportAssociations } from './XStateCrisisReportUtils';

import Logger from '../../../utils/Logger';
import {
  submitDataGraph,
} from '../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
} from '../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';

const { processEntityData, processAssociationEntityData } = DataProcessingUtils;
const { PEOPLE_FQN, STAFF_FQN } = APP_TYPES_FQNS;

const LOG = new Logger('XCrisisReportSagas');

function* submitCrisisReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {};
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitCrisisReport.request(action.id));
    const { formData, selectedPerson } = value;

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const currentStaff = yield select((state) => state.getIn(['staff', 'currentUser', 'data'], Map()));

    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const existingEKIDs = {
      [PEOPLE_FQN]: getEntityKeyId(selectedPerson),
      [STAFF_FQN]: getEntityKeyId(currentStaff)
      // add incidentEKID
    };

    const associationEntityData = processAssociationEntityData(
      getCrisisReportAssociations(formData, existingEKIDs),
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
};
