// @flow
import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_ALL_SYMPTOMS_REPORTS,
  GET_SYMPTOMS_REPORT,
  SUBMIT_SYMPTOMS_REPORT,
  UPDATE_SYMPTOMS_REPORT,
  getAllSymptomsReports,
  getSymptomsReport,
  submitSymptomsReport,
  updateSymptomsReport,
} from './SymptomsReportActions';
import { getSymptomsReportAssociations, postProcessSymptoms } from './SymptomsReportUtils';

import Logger from '../../../utils/Logger';
import * as FQN from '../../../edm/DataModelFqns';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';
import { getESIDFromApp } from '../../../utils/AppUtils';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { isValidUuid } from '../../../utils/Utils';

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { processAssociationEntityData, processEntityData } = DataProcessingUtils;
const LOG = new Logger('SymptomsReportSagas');

function* getAllSymptomsReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getAllSymptomsReports.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, APP.PEOPLE_FQN);
    const symptomESID :UUID = getESIDFromApp(app, APP.SYMPTOM_FQN);
    const observedInESID :UUID = getESIDFromApp(app, APP.OBSERVED_IN_FQN);

    const symptomSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [observedInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [symptomESID]
      }
    };

    const symptomResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(symptomSearchParams),
    );

    if (symptomResponse.error) throw symptomResponse.error;
    const symptoms = fromJS(symptomResponse.data).get(entityKeyId, List());
    response.data = symptoms;

    const recentSymptoms :boolean = symptoms.filter((symptom) => {
      const datetimeStr = symptom.getIn(['associationDetails', FQN.COMPLETED_DT_FQN, 0]);

      const contactDateTime = DateTime.fromISO(datetimeStr);
      if (!contactDateTime.isValid) return false;

      const now = DateTime.local();
      const { days = 0 } = contactDateTime.until(now).toDuration(['days'])
        .toObject();

      const symptomValues = symptom.getIn(['neighborDetails', FQN.NAME_FQN]);
      const noSymptoms = symptomValues.includes('None') && symptomValues.count() === 1;

      return (days < 14) && !noSymptoms;
    }).count() > 0;

    yield put(getAllSymptomsReports.success(action.id, {
      data: response.data,
      recentSymptoms
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getAllSymptomsReports.request(action.id, error));
  }
}

function* getAllSymptomsReportsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ALL_SYMPTOMS_REPORTS, getAllSymptomsReportsWorker);
}

function* getSymptomsReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
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
  getAllSymptomsReportsWatcher,
  getAllSymptomsReportsWorker,
  getSymptomsReportWatcher,
  getSymptomsReportWorker,
  submitSymptomsReportWatcher,
  submitSymptomsReportWorker,
  updateSymptomsReportWatcher,
  updateSymptomsReportWorker,
};
