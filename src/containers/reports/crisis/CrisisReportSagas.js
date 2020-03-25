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
  Map,
  fromJS,
} from 'immutable';
import { Models } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  ADD_OPTIONAL_CRISIS_REPORT_CONTENT,
  DELETE_CRISIS_REPORT_CONTENT,
  GET_CRISIS_REPORT,
  GET_REPORTS_NEIGHBORS,
  GET_SUBJECT_OF_INCIDENT,
  SUBMIT_CRISIS_REPORT,
  UPDATE_CRISIS_REPORT,
  addOptionalCrisisReportContent,
  deleteCrisisReportContent,
  getCrisisReport,
  getReportsNeighbors,
  getSubjectOfIncident,
  submitCrisisReport,
  updateCrisisReport,
} from './CrisisActions';
import {
  constructFormDataFromNeighbors,
  getCrisisReportAssociations,
  getEntityIndexToIdMapFromDataGraphResponse,
  getEntityIndexToIdMapFromNeighbors,
  getOptionalCrisisReportAssociations
} from './CrisisReportUtils';
import { v2 } from './schemas';
import { generateReviewSchema } from './schemas/schemaUtils';

import Logger from '../../../utils/Logger';
import * as FQN from '../../../edm/DataModelFqns';
import {
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
} from '../../../core/sagas/data/DataActions';
import {
  deleteBulkEntitiesWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../../utils/AppUtils';
import { getEntityKeyId, groupNeighborsByFQNs, removeEntitiesFromEntityIndexToIdMap } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { isDefined } from '../../../utils/LangUtils';
import { isValidUuid } from '../../../utils/Utils';

const { FullyQualifiedName } = Models;
const { schemas, uiSchemas } = v2;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const { getEntityData } = DataApiActions;

const { getEntityDataWorker } = DataApiSagas;

const { processEntityData, processAssociationEntityData } = DataProcessingUtils;
const {
  BEHAVIOR_FQN,
  DIAGNOSIS_FQN,
  ENCOUNTER_DETAILS_FQN,
  ENCOUNTER_FQN,
  HOUSING_FQN,
  INCIDENT_FQN,
  INCOME_FQN,
  INJURY_FQN,
  INSURANCE_FQN,
  INTERACTION_STRATEGY_FQN,
  INVOICE_FQN,
  INVOLVED_IN_FQN,
  MEDICATION_STATEMENT_FQN,
  NATURE_OF_CRISIS_FQN,
  OCCUPATION_FQN,
  PART_OF_FQN,
  PEOPLE_FQN,
  REFERRAL_REQUEST_FQN,
  REPORTED_FQN,
  SELF_HARM_FQN,
  STAFF_FQN,
  SUBSTANCE_FQN,
  SUBSTANCE_HISTORY_FQN,
  VIOLENT_BEHAVIOR_FQN,
  WEAPON_FQN,
} = APP_TYPES_FQNS;

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

    debugger;
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

function* addOptionalCrisisReportContentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {};
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(addOptionalCrisisReportContent.request(action.id));
    const {
      existingEKIDs,
      formData,
      path,
      properties,
      schema,
    } = value;

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));

    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);

    const associationEntityData = processAssociationEntityData(
      getOptionalCrisisReportAssociations(formData, existingEKIDs),
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

    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());

    const entityIndexToIdMap = getEntityIndexToIdMapFromDataGraphResponse(
      fromJS(dataGraphResponse.data),
      schema,
      appTypeFqnsByIds
    );

    yield put(addOptionalCrisisReportContent.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(addOptionalCrisisReportContent.failure(action.id, error));
  }
  return response;
}

function* addOptionalCrisisReportContentWatcher() :Generator<any, any, any> {
  yield takeEvery(ADD_OPTIONAL_CRISIS_REPORT_CONTENT, addOptionalCrisisReportContentWorker);
}

function* getReportsNeighborsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const {
      value: {
        reportEKIDs,
        reportFQN,
      }
    } = action;
    if (!(Array.isArray(reportEKIDs) && reportEKIDs.every(isValidUuid))
      || !FullyQualifiedName.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getReportsNeighbors.request(action.id, reportEKIDs));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      reportESID,
      partOfESID,
      reportedESID,
      ...neighborESIDs
    ] = getESIDsFromApp(app, [
      reportFQN,
      PART_OF_FQN,
      REPORTED_FQN,
      BEHAVIOR_FQN,
      DIAGNOSIS_FQN,
      MEDICATION_STATEMENT_FQN,
      ENCOUNTER_DETAILS_FQN,
      ENCOUNTER_FQN,
      HOUSING_FQN,
      INCIDENT_FQN,
      INCOME_FQN,
      INJURY_FQN,
      INSURANCE_FQN,
      INTERACTION_STRATEGY_FQN,
      INVOICE_FQN,
      NATURE_OF_CRISIS_FQN,
      OCCUPATION_FQN,
      REFERRAL_REQUEST_FQN,
      SELF_HARM_FQN,
      STAFF_FQN,
      SUBSTANCE_FQN,
      SUBSTANCE_HISTORY_FQN,
      VIOLENT_BEHAVIOR_FQN,
      WEAPON_FQN,
    ]);

    const neighborsSearchParam = {
      entitySetId: reportESID,
      filter: {
        entityKeyIds: reportEKIDs,
        edgeEntitySetIds: [partOfESID, reportedESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [...neighborESIDs],
      },
    };

    const neighborsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(neighborsSearchParam)
    );

    if (neighborsResponse.error) throw neighborsResponse.error;
    const neighborsData = fromJS(neighborsResponse.data);

    response.data = neighborsData;

    yield put(getReportsNeighbors.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getReportsNeighbors.failure(action.id, error));
  }
  return response;
}

function* getReportsNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTS_NEIGHBORS, getReportsNeighborsWorker);
}

function* getSubjectOfIncidentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: incidentEKID } = action;
    yield put(getSubjectOfIncident.request(action.id, incidentEKID));
    const app = yield select((state) => state.get('app', Map()));

    const [
      incidentESID,
      involvedInESID,
      peopleESID,
    ] = getESIDsFromApp(app, [
      INCIDENT_FQN,
      INVOLVED_IN_FQN,
      PEOPLE_FQN,
    ]);

    const peopleSearchParams = {
      entitySetId: incidentESID,
      filter: {
        entityKeyIds: [incidentEKID],
        sourceEntitySetIds: [peopleESID],
        edgeEntitySetIds: [involvedInESID],
        destinationEntitySetIds: []
      },
    };

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(peopleSearchParams)
    );

    if (peopleResponse.error) throw peopleResponse.error;
    response.data = fromJS(peopleResponse.data);

    yield put(getSubjectOfIncident.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getSubjectOfIncident.failure(action.id), error);
  }
  return response;
}

function* getSubjectOfIncidentWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SUBJECT_OF_INCIDENT, getSubjectOfIncidentWorker);
}

function* getCrisisReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const {
      value: {
        reportEKID,
        reportFQN,
      }
    } = action;

    if (!isValidUuid(reportEKID) || !FullyQualifiedName.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getCrisisReport.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const reportESID = getESIDFromApp(app, reportFQN);

    const reportRequest = call(
      getEntityDataWorker,
      getEntityData({
        entitySetId: reportESID,
        entityKeyId: reportEKID
      })
    );

    const neighborsRequest = yield call(
      getReportsNeighborsWorker,
      getReportsNeighbors({
        reportEKIDs: [reportEKID],
        reportFQN,
      })
    );

    const [reportResponse, neighborsResponse] = yield all([
      reportRequest,
      neighborsRequest,
    ]);

    if (reportResponse.error) throw reportResponse.error;
    if (neighborsResponse.error) throw neighborsResponse.error;

    const neighbors = neighborsResponse.data.get(reportEKID);
    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());
    const neighborsByFQN = groupNeighborsByFQNs(neighbors, appTypeFqnsByIds);
    const incidentEKID = neighborsByFQN.getIn([
      INCIDENT_FQN, 0, 'neighborDetails', FQN.OPENLATTICE_ID_FQN, 0
    ]);
    const reporterData = neighborsByFQN.getIn([STAFF_FQN, 0]);

    const subjectResponse = yield call(
      getSubjectOfIncidentWorker,
      getSubjectOfIncident(incidentEKID)
    );

    if (subjectResponse.error) throw subjectResponse.error;
    const subjectData = subjectResponse.data.getIn([incidentEKID, 0, 'neighborDetails'], Map());

    // reviewSchema should be passed in from requesting view.
    const { schema } = generateReviewSchema(schemas, uiSchemas, true);
    const formData = fromJS(constructFormDataFromNeighbors(neighborsByFQN, schema));
    const entityIndexToIdMap = getEntityIndexToIdMapFromNeighbors(neighborsByFQN, schema);

    yield put(getCrisisReport.success(action.id, {
      formData,
      entityIndexToIdMap,
      subjectData,
      reporterData,
      reportData: fromJS(reportResponse.data),
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getCrisisReport.failure(action.id, error));
  }
  return response;
}

function* getCrisisReportWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_CRISIS_REPORT, getCrisisReportWorker);
}

function* updateCrisisReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(updateCrisisReport.request(action.id, value));

    const updateResponse = yield call(
      submitPartialReplaceWorker,
      submitPartialReplace(value)
    );

    if (updateResponse.error) throw updateResponse.error;
    yield put(updateCrisisReport.success(action.id));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(updateCrisisReport.failure(action.id, error));
  }
  return response;
}

function* updateCrisisReportWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_CRISIS_REPORT, updateCrisisReportWorker);
}

function* deleteCrisisReportContentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(deleteCrisisReportContent.request(action.id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const { entityData, path } = value;
    const deleteResponse = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(entityData));

    if (deleteResponse.error) throw deleteResponse.error;

    const entityIndexToIdMap = yield select((state) => state.getIn(['crisisReport', 'entityIndexToIdMap']));
    const newEntityIndexToIdMap = removeEntitiesFromEntityIndexToIdMap(entityData, entityIndexToIdMap);

    yield put(deleteCrisisReportContent.success(action.id, { path, entityIndexToIdMap: newEntityIndexToIdMap }));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(deleteCrisisReportContent.failure(action.id, error));
  }
  return response;
}

function* deleteCrisisReportContentWatcher() :Generator<any, any, any> {
  yield takeEvery(DELETE_CRISIS_REPORT_CONTENT, deleteCrisisReportContentWorker);
}

export {
  addOptionalCrisisReportContentWatcher,
  addOptionalCrisisReportContentWorker,
  deleteCrisisReportContentWatcher,
  deleteCrisisReportContentWorker,
  getCrisisReportWatcher,
  getCrisisReportWorker,
  getReportsNeighborsWatcher,
  getReportsNeighborsWorker,
  getSubjectOfIncidentWatcher,
  getSubjectOfIncidentWorker,
  submitCrisisReportWatcher,
  submitCrisisReportWorker,
  updateCrisisReportWatcher,
  updateCrisisReportWorker,
};
