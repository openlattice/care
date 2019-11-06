// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { isPlainObject } from 'lodash';
import {
  Map,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';

import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../utils/Logger';
import { BHR_CONFIG } from '../../config/formconfig/CrisisReportConfig';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import {
  SUBMIT_CRISIS_REPORT,
  submitCrisisReport,
} from './CrisisReportActions';
import { submitDataGraph } from '../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../core/sagas/data/DataSagas';
import { isDefined } from '../../utils/LangUtils';
import { getESIDFromApp } from '../../utils/AppUtils';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';

import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisReportConstants';

const { processAssociationEntityData } = DataProcessingUtils;
const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN,
  STAFF_FQN,
  REPORTED_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ReportsSagas');

const { OPENLATTICE_ID_FQN } = Constants;

function* submitCrisisReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    const {
      entityKeyId: personEKID = 0,
      formData,
    } = value;
    if (!isPlainObject(formData)) throw ERR_ACTION_VALUE_TYPE;

    yield put(submitCrisisReport.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));
    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const reportESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);

    const staffEKID :UUID = yield select(
      (state) => state.getIn(['staff', 'currentUser', 'data', OPENLATTICE_ID_FQN, 0], '')
    );

    const associations = [
      [REPORTED_FQN, staffEKID, STAFF_FQN, 0, BEHAVIORAL_HEALTH_REPORT_FQN, {
        [FQN.DATE_TIME_FQN]: [formData[POST_PROCESS_FIELDS.TIMESTAMP]]
      }],
      [APPEARS_IN_FQN, personEKID, PEOPLE_FQN, 0, BEHAVIORAL_HEALTH_REPORT_FQN, {
        [FQN.DATE_TIME_FQN]: [formData[POST_PROCESS_FIELDS.TIMESTAMP]]
      }],
    ];

    const associationEntityData = processAssociationEntityData(
      associations,
      entitySetIds,
      propertyTypeIds
    );

    const reportFields = BHR_CONFIG.fields;
    const properties = {};
    Object.keys(reportFields).forEach((field) => {
      const fqn = reportFields[field];
      const propertyTypeId = propertyTypeIds.get(fqn);
      if (!propertyTypeId) LOG.error('propertyType id for fqn not found', fqn);
      let updatedValue;
      if (Array.isArray(formData[field])) {
        updatedValue = formData[field];
      }
      else {
        updatedValue = [formData[field]];
      }
      properties[propertyTypeId] = updatedValue;
    });

    const entityData = {
      [reportESID]: [properties]
    };

    yield call(submitDataGraphWorker, submitDataGraph({
      associationEntityData,
      entityData
    }));

    yield put(submitCrisisReport.success(action.id));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(submitCrisisReport.failure(action.id, error));
  }
}

function* submitCrisisReportWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_CRISIS_REPORT, submitCrisisReportWorker);
}

export {
  submitCrisisReportWorker,
  submitCrisisReportWatcher
};
