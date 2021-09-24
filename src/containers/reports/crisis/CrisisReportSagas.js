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
  hasIn,
  removeIn,
  setIn,
} from 'immutable';
import { Models, Types } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  AuthorizationsApiActions,
  AuthorizationsApiSagas,
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import {
  LangUtils,
  Logger,
  ValidationUtils
} from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  ADD_OPTIONAL_CRISIS_REPORT_CONTENT,
  CREATE_MISSING_CALL_FOR_SERVICE,
  DELETE_CRISIS_REPORT,
  DELETE_CRISIS_REPORT_CONTENT,
  GET_CHARGE_EVENTS,
  GET_CRISIS_REPORT,
  GET_CRISIS_REPORT_V2,
  GET_LOCATION_OF_INCIDENT,
  GET_REPORTS_NEIGHBORS,
  GET_REPORTS_V2_NEIGHBORS,
  GET_SUBJECT_OF_INCIDENT,
  SUBMIT_CRISIS_REPORT,
  SUBMIT_CRISIS_REPORT_V2,
  UPDATE_CRISIS_REPORT,
  addOptionalCrisisReportContent,
  createMissingCallForService,
  deleteCrisisReport,
  deleteCrisisReportContent,
  getChargeEvents,
  getCrisisReport,
  getCrisisReportV2,
  getLocationOfIncident,
  getReportsNeighbors,
  getReportsV2Neighbors,
  getSubjectOfIncident,
  submitCrisisReport,
  submitCrisisReportV2,
  updateCrisisReport,
  updatePersonReportCount,
} from './CrisisActions';
import {
  constructFormDataFromNeighbors,
  getClinicianCrisisReportAssociations,
  getCrisisReportAssociations,
  getEntityIndexToIdMapFromDataGraphResponse,
  getEntityIndexToIdMapFromNeighbors,
  getFollowupReportAssociations,
  getOfficerCrisisReportAssociations,
  getOptionalCrisisReportAssociations,
  postProcessBehaviorSection,
  postProcessCrisisReportV1,
  postProcessDisposition,
  postProcessNatureSection,
  postProcessSafetySection,
  preProcessCrisisReportV1,
} from './CrisisReportUtils';
import { v1 } from './schemas';

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
import {
  COMPLETED_DT_FQN,
  NUM_REPORTS_FOUND_IN_FQN,
  OBSERVED_BEHAVIOR_FQN,
  OL_ID_FQN,
  OPENLATTICE_ID_FQN,
} from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../../utils/AppUtils';
import {
  getEntityKeyId,
  groupNeighborsByFQNs,
  removeEntitiesFromEntityIndexToIdMap,
} from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { generateReviewSchema } from '../../../utils/SchemaUtils';
import { getFormSchema } from '../FormSchemasActions';
import { getFormSchemaWorker } from '../FormSchemasSagas';

const { FQN } = Models;
const { DeleteTypes } = Types;
const { isDefined } = LangUtils;
const { isValidUUID } = ValidationUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getAuthorizationsWorker } = AuthorizationsApiSagas;
const { getAuthorizations } = AuthorizationsApiActions;

const { getEntityData, deleteEntityData } = DataApiActions;

const { getEntityDataWorker, deleteEntityDataWorker } = DataApiSagas;

const {
  findEntityAddressKeyFromMap,
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
  processEntityDataForPartialReplace,
  replaceEntityAddressKeys,
} = DataProcessingUtils;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  BEHAVIOR_CLINICIAN_FQN,
  BEHAVIOR_FQN,
  CALL_FOR_SERVICE_FQN,
  CHARGE_EVENT_FQN,
  CHARGE_FQN,
  CRISIS_REPORT_CLINICIAN_FQN,
  DIAGNOSIS_CLINICIAN_FQN,
  DIAGNOSIS_FQN,
  DISPOSITION_CLINICIAN_FQN,
  DISPOSITION_FQN,
  EMPLOYEE_FQN,
  ENCOUNTER_DETAILS_FQN,
  ENCOUNTER_FQN,
  FOLLOW_UP_REPORT_FQN,
  GENERAL_PERSON_FQN,
  HOUSING_FQN,
  INCIDENT_FQN,
  INCOME_FQN,
  INJURY_FQN,
  INSURANCE_FQN,
  INTERACTION_STRATEGY_FQN,
  INVOICE_FQN,
  INVOLVED_IN_FQN,
  LOCATED_AT_FQN,
  LOCATION_FQN,
  MEDICATION_STATEMENT_CLINICIAN_FQN,
  MEDICATION_STATEMENT_FQN,
  OCCUPATION_FQN,
  OFFENSE_FQN,
  PART_OF_FQN,
  PEOPLE_FQN,
  REFERRAL_REQUEST_FQN,
  REFERRAL_SOURCE_FQN,
  REGISTERED_FOR_FQN,
  REPORTED_FQN,
  SELF_HARM_CLINICIAN_FQN,
  SELF_HARM_FQN,
  STAFF_FQN,
  SUBSTANCE_CLINICIAN_FQN,
  SUBSTANCE_FQN,
  VIOLENT_BEHAVIOR_FQN,
  WEAPON_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('CrisisReportSagas');

// V2

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
      reportFQN,
    } = value;

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));

    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);

    const associationEntityData = processAssociationEntityData(
      getOptionalCrisisReportAssociations(formData, existingEKIDs, DateTime.local().toISO(), reportFQN),
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
  finally {
    yield put(addOptionalCrisisReportContent.finally(action.id));
  }
  return response;
}

function* addOptionalCrisisReportContentWatcher() :Generator<any, any, any> {
  yield takeEvery(ADD_OPTIONAL_CRISIS_REPORT_CONTENT, addOptionalCrisisReportContentWorker);
}

function* getReportsV2NeighborsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const {
      value: {
        reportEKIDs,
        reportFQN,
      }
    } = action;
    if (!(Array.isArray(reportEKIDs) && reportEKIDs.every(isValidUUID))
      || !FQN.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getReportsV2Neighbors.request(action.id, reportEKIDs));

    const app :Map = yield select((state) => state.get('app', Map()));

    const isProtected = reportFQN === CRISIS_REPORT_CLINICIAN_FQN;
    let entitySetFQNs = [
      // report
      reportFQN,
      PART_OF_FQN,
      REPORTED_FQN,
      // report contents
      BEHAVIOR_FQN,
      CALL_FOR_SERVICE_FQN,
      CHARGE_FQN,
      DIAGNOSIS_FQN,
      DISPOSITION_FQN,
      EMPLOYEE_FQN,
      ENCOUNTER_DETAILS_FQN,
      ENCOUNTER_FQN,
      GENERAL_PERSON_FQN,
      HOUSING_FQN,
      INCIDENT_FQN,
      INCOME_FQN,
      INJURY_FQN,
      INSURANCE_FQN,
      INTERACTION_STRATEGY_FQN,
      INVOICE_FQN,
      LOCATION_FQN,
      MEDICATION_STATEMENT_FQN,
      OCCUPATION_FQN,
      OFFENSE_FQN,
      REFERRAL_REQUEST_FQN,
      REFERRAL_SOURCE_FQN,
      SELF_HARM_FQN,
      STAFF_FQN,
      SUBSTANCE_FQN,
      VIOLENT_BEHAVIOR_FQN,
      WEAPON_FQN,
    ];

    if (isProtected) {
      // check observed behavior property access as proxy for all clinician read permissions
      const behaviorESID = getESIDFromApp(app, BEHAVIOR_CLINICIAN_FQN);
      const observedBehaviorPTID :UUID = yield select(
        (state) => state.getIn(['edm', 'fqnToIdMap', OBSERVED_BEHAVIOR_FQN])
      );

      const accessCheck = [{
        aclKey: [behaviorESID, observedBehaviorPTID],
        permissions: ['READ']
      }];

      const accessResponse = yield call(
        getAuthorizationsWorker,
        getAuthorizations(accessCheck)
      );

      if (accessResponse.error) throw accessResponse.error;
      const readAccess = getIn(accessResponse, ['data', 0, 'permissions', 'READ']);

      if (!readAccess) throw new Error('401');

      entitySetFQNs = entitySetFQNs.concat([
        DISPOSITION_CLINICIAN_FQN,
        MEDICATION_STATEMENT_CLINICIAN_FQN,
        DIAGNOSIS_CLINICIAN_FQN,
        SUBSTANCE_CLINICIAN_FQN,
        SELF_HARM_CLINICIAN_FQN,
        BEHAVIOR_CLINICIAN_FQN,
      ]);
    }

    const [
      reportESID,
      partOfESID,
      reportedESID,
      ...neighborESIDs
    ] = getESIDsFromApp(app, entitySetFQNs);

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

    yield put(getReportsV2Neighbors.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getReportsV2Neighbors.failure(action.id, error));
  }
  finally {
    yield put(getReportsV2Neighbors.finally(action.id));
  }
  return response;
}

function* getReportsV2NeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTS_V2_NEIGHBORS, getReportsV2NeighborsWorker);
}

function* getSubjectOfIncidentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: incidentEKID } = action;
    if (!isValidUUID(incidentEKID)) throw ERR_ACTION_VALUE_TYPE;

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
    yield put(getSubjectOfIncident.failure(action.id, error));
  }
  finally {
    yield put(getSubjectOfIncident.finally(action.id));
  }
  return response;
}

function* getSubjectOfIncidentWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SUBJECT_OF_INCIDENT, getSubjectOfIncidentWorker);
}

function* getLocationOfIncidentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};

  try {
    const { value: incidentEKID } = action;
    if (!isValidUUID(incidentEKID)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getLocationOfIncident.request(action.id, incidentEKID));
    const app = yield select((state) => state.get('app', Map()));

    const [
      incidentESID,
      locatedAtESID,
      locationESID,
    ] = getESIDsFromApp(app, [
      INCIDENT_FQN,
      LOCATED_AT_FQN,
      LOCATION_FQN,
    ]);

    const peopleSearchParams = {
      entitySetId: incidentESID,
      filter: {
        entityKeyIds: [incidentEKID],
        sourceEntitySetIds: [],
        edgeEntitySetIds: [locatedAtESID],
        destinationEntitySetIds: [locationESID]
      },
    };

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(peopleSearchParams)
    );

    if (peopleResponse.error) throw peopleResponse.error;
    response.data = fromJS(peopleResponse.data);
    yield put(getLocationOfIncident.success(action.id));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getLocationOfIncident.failure(action.id, error));
  }
  finally {
    yield put(getLocationOfIncident.finally(action.id));
  }
  return response;
}

function* getLocationOfIncidentWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_LOCATION_OF_INCIDENT, getLocationOfIncidentWorker);
}

function* getChargeEventsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};

  try {
    const { value: chargeEKIDs } = action;
    if (!Array.isArray(chargeEKIDs)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getChargeEvents.request(action.id, chargeEKIDs));
    response.data = List();
    if (chargeEKIDs.length) {

      const app = yield select((state) => state.get('app', Map()));

      const [
        chargeESID,
        registeredForESID,
        chargeEventESID,
      ] = getESIDsFromApp(app, [
        CHARGE_FQN,
        REGISTERED_FOR_FQN,
        CHARGE_EVENT_FQN,
      ]);

      const chargeEventsParams = {
        entitySetId: chargeESID,
        filter: {
          entityKeyIds: chargeEKIDs,
          sourceEntitySetIds: [chargeEventESID],
          edgeEntitySetIds: [registeredForESID],
          destinationEntitySetIds: []
        },
      };

      const chargeEventsResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(chargeEventsParams)
      );

      if (chargeEventsResponse.error) throw chargeEventsResponse.error;
      response.data = fromJS(chargeEventsResponse.data);
    }

    yield put(getChargeEvents.success(action.id));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getChargeEvents.failure(action.id, error));
  }
  finally {
    yield put(getChargeEvents.finally(action.id));
  }
  return response;
}

function* getChargeEventsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_CHARGE_EVENTS, getChargeEventsWorker);
}

function* getCrisisReportV2DataWorker(
  action :{ reportEKID :UUID, reportFQN :FQN, reportData ?:Map }
) :Saga<WorkerResponse> {
  let response = {};
  try {
    const {
      reportEKID,
      reportFQN = CRISIS_REPORT_CLINICIAN_FQN,
      reportData
    } = action;
    if (!isValidUUID(reportEKID) || !FQN.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;
    const app :Map = yield select((state) => state.get('app', Map()));
    const reportESID = getESIDFromApp(app, reportFQN);

    const neighborsResponse = yield call(
      getReportsV2NeighborsWorker,
      getReportsV2Neighbors({
        reportEKIDs: [reportEKID],
        reportFQN,
      })
    );

    if (neighborsResponse.error) throw neighborsResponse.error;

    const neighbors = neighborsResponse.data.get(reportEKID) || List();
    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());
    const neighborsByFQN = groupNeighborsByFQNs(neighbors, appTypeFqnsByIds);
    const incidentEKID = neighborsByFQN.getIn([INCIDENT_FQN, 0, 'neighborDetails', OPENLATTICE_ID_FQN, 0]);
    if (!isValidUUID(incidentEKID)) throw Error(`Failed to load content for report ${reportEKID}`);

    const chargeEKIDs = neighborsByFQN
      .get(CHARGE_FQN, List())
      .map((charge) => charge.getIn(['neighborDetails', OPENLATTICE_ID_FQN, 0]))
      .toJS();

    const locationRequest = call(
      getLocationOfIncidentWorker,
      getLocationOfIncident(incidentEKID)
    );
    const subjectRequest = call(
      getSubjectOfIncidentWorker,
      getSubjectOfIncident(incidentEKID)
    );

    const chargeEventsRequest = call(
      getChargeEventsWorker,
      getChargeEvents(chargeEKIDs)
    );

    const [subjectResponse, locationResponse, chargeEventsResponse] = yield all([
      subjectRequest,
      locationRequest,
      chargeEventsRequest
    ]);

    if (subjectResponse.error) throw Error(`Failed to load subject for report ${reportEKID}`);
    if (locationResponse.error) throw Error(`Failed to load location for report ${reportEKID}`);
    if (chargeEventsResponse.error) throw Error(`Failed to load charges for report ${reportEKID}`);
    const subjectData = subjectResponse.data.getIn([incidentEKID, 0, 'neighborDetails'], Map());
    const locationData = locationResponse.data.get(incidentEKID, List());
    const chargeEventsData = chargeEKIDs
      .map((chargeEKID) => chargeEventsResponse.data.getIn([chargeEKID, 0], Map()));

    // fetch report if not provided
    let report = reportData;
    if (!report) {
      const reportResponse = yield call(
        getEntityDataWorker,
        getEntityData({
          entitySetId: reportESID,
          entityKeyId: reportEKID
        })
      );

      if (reportResponse.error) throw reportResponse.error;
      report = fromJS(reportResponse.data);
    }

    // include report and location in neighbors
    const reportEntity = fromJS({ neighborDetails: report });
    const reportDataByFQN = neighborsByFQN
      .set(reportFQN.toString(), List([reportEntity]))
      .set(LOCATION_FQN.toString(), locationData)
      .set(CHARGE_EVENT_FQN.toString(), chargeEventsData);

    response = {
      data: {
        reportData: report,
        reportDataByFQN,
        subjectData,
      }
    };

  }
  catch (error) {
    error.metadata = action;
    response = {
      error
    };
  }
  return response;
}

function* getCrisisReportV2Worker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const {
      value: {
        reportEKID,
        reportFQN,
        reviewSchema,
      }
    } = action;

    if (!isValidUUID(reportEKID) || !FQN.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getCrisisReportV2.request(action.id));

    const crisisReportDataResponse = yield call(getCrisisReportV2DataWorker, { reportEKID, reportFQN });
    if (crisisReportDataResponse.error) throw crisisReportDataResponse.error;
    const {
      subjectData,
      reportDataByFQN,
      reportData,
    } = crisisReportDataResponse.data;
    const reporterData = reportDataByFQN.getIn([STAFF_FQN, 0], Map());
    const formData = fromJS(constructFormDataFromNeighbors(reportDataByFQN, reviewSchema));
    const entityIndexToIdMap = getEntityIndexToIdMapFromNeighbors(reportDataByFQN, reviewSchema);

    yield put(getCrisisReportV2.success(action.id, {
      entityIndexToIdMap,
      formData,
      reportData,
      reporterData,
      subjectData,
      [reportFQN]: reportDataByFQN
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getCrisisReportV2.failure(action.id, error.message));
  }
  finally {
    yield put(getCrisisReportV2.finally(action.id));
  }
  return response;
}

function* getCrisisReportV2Watcher() :Generator<any, any, any> {
  yield takeLatest(GET_CRISIS_REPORT_V2, getCrisisReportV2Worker);
}

function* updatePersonReportCountWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    if (!isPlainObject(action.value)) throw ERR_ACTION_VALUE_TYPE;
    const { entityKeyId, count } = action.value;
    if (!isValidUUID(entityKeyId) || !Number.isInteger(count)) throw ERR_ACTION_VALUE_TYPE;

    yield put(updatePersonReportCount.request(action.id));

    const edm :Map = yield select((state) => state.get('edm'));
    const app :Map = yield select((state) => state.get('app'), Map());
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const numReportsPTID :UUID = edm.getIn(['fqnToIdMap', NUM_REPORTS_FOUND_IN_FQN]);

    const updateData = {
      entityData: {
        [peopleESID]: {
          [entityKeyId]: {
            [numReportsPTID]: [count]
          }
        }
      }
    };

    const updateResponse = yield call(
      submitPartialReplaceWorker,
      submitPartialReplace(updateData)
    );
    if (updateResponse.error) throw updateResponse.error;

    yield put(updatePersonReportCount.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(updatePersonReportCount.failure(action.id));
  }
  finally {
    yield put(updatePersonReportCount.finally(action.id));
  }
  return response;
}

function* submitCrisisReportV2Worker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {};
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitCrisisReportV2.request(action.id));
    const {
      formData,
      selectedPerson,
      reportFQN,
      incident = Map(),
    } = value;

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const currentStaff = yield select((state) => state.getIn(['staff', 'currentUser', 'data'], Map()));

    const now = DateTime.local().toISO();
    const timestampedFormData = setIn(
      formData,
      [getPageSectionKey(2, 1), getEntityAddressKey(0, reportFQN, COMPLETED_DT_FQN)],
      [now]
    );

    const entityData = processEntityData(timestampedFormData, entitySetIds, propertyTypeIds);
    const personEKID = getEntityKeyId(selectedPerson);
    const incidentEKID = getEntityKeyId(incident);
    const staffEKID = getEntityKeyId(currentStaff);
    const existingEKIDs = {
      [PEOPLE_FQN]: personEKID,
      [STAFF_FQN]: staffEKID,
      [INCIDENT_FQN]: incidentEKID
    };

    let associationFn = getOfficerCrisisReportAssociations;
    if (reportFQN === CRISIS_REPORT_CLINICIAN_FQN) {
      associationFn = getClinicianCrisisReportAssociations;
    }
    if (reportFQN === FOLLOW_UP_REPORT_FQN) {
      associationFn = getFollowupReportAssociations;
    }

    const associationEntityData = processAssociationEntityData(
      associationFn(timestampedFormData, existingEKIDs, now),
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

    yield put(submitCrisisReportV2.success(action.id));

    // update count after submission of new incident
    if (incident.isEmpty()) {
      const count = selectedPerson.getIn([NUM_REPORTS_FOUND_IN_FQN, 0], 0) + 1;
      yield call(
        updatePersonReportCountWorker,
        updatePersonReportCount({
          entityKeyId: personEKID,
          count
        })
      );
    }

  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(submitCrisisReportV2.failure(action.id, error));
  }
  finally {
    yield put(submitCrisisReportV2.finally(action.id));
  }
  return response;
}

function* submitCrisisReportV2Watcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_CRISIS_REPORT_V2, submitCrisisReportV2Worker);
}

// V1

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

    const postProcessFormData = postProcessCrisisReportV1(formData);

    const entityData = processEntityData(postProcessFormData, entitySetIds, propertyTypeIds);
    const personEKID = getEntityKeyId(selectedPerson);
    const existingEKIDs = {
      [PEOPLE_FQN]: personEKID,
      [STAFF_FQN]: getEntityKeyId(currentStaff)
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

    // update count after submission success
    const count = selectedPerson.getIn([NUM_REPORTS_FOUND_IN_FQN, 0], 0) + 1;
    yield call(
      updatePersonReportCountWorker,
      updatePersonReportCount({
        entityKeyId: personEKID,
        count
      })
    );
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(submitCrisisReport.failure(action.id, error));
  }
  finally {
    yield put(submitCrisisReport.finally(action.id));
  }
  return response;
}

function* submitCrisisReportWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_CRISIS_REPORT, submitCrisisReportWorker);
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
    if (!(Array.isArray(reportEKIDs) && reportEKIDs.every(isValidUUID))
      || !FQN.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getReportsNeighbors.request(action.id, reportEKIDs));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      appearsInESID,
      callForServiceESID,
      peopleESID,
      registeredForESID,
      reportESID,
      reportedESID,
      staffESID
    ] = getESIDsFromApp(app, [
      APPEARS_IN_FQN,
      CALL_FOR_SERVICE_FQN,
      PEOPLE_FQN,
      REGISTERED_FOR_FQN,
      reportFQN,
      REPORTED_FQN,
      STAFF_FQN,
    ]);

    const neighborsSearchParam = {
      entitySetId: reportESID,
      filter: {
        entityKeyIds: reportEKIDs,
        edgeEntitySetIds: [appearsInESID, reportedESID, registeredForESID],
        destinationEntitySetIds: [callForServiceESID],
        sourceEntitySetIds: [peopleESID, staffESID],
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
  finally {
    yield put(getReportsNeighbors.finally(action.id));
  }
  return response;
}

function* getReportsNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTS_NEIGHBORS, getReportsNeighborsWorker);
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

    if (!isValidUUID(reportEKID) || !FQN.isValid(reportFQN)) throw ERR_ACTION_VALUE_TYPE;
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

    const formSchemaRequest = call(
      getFormSchemaWorker,
      getFormSchema('CRISIS_REPORT')
    );

    const neighborsRequest = call(
      getReportsNeighborsWorker,
      getReportsNeighbors({
        reportEKIDs: [reportEKID],
        reportFQN,
      })
    );

    const [reportResponse, neighborsResponse, formSchemaResponse] = yield all([
      reportRequest,
      neighborsRequest,
      formSchemaRequest
    ]);

    if (reportResponse.error) throw reportResponse.error;
    if (neighborsResponse.error) throw neighborsResponse.error;

    const neighbors = neighborsResponse.data.get(reportEKID);
    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());
    const neighborsByFQN = groupNeighborsByFQNs(neighbors, appTypeFqnsByIds);
    const reporterData = neighborsByFQN.getIn([STAFF_FQN, 0], Map());
    const subjectData = neighborsByFQN.getIn([PEOPLE_FQN, 0, 'neighborDetails'], Map());

    const processedReportData = preProcessCrisisReportV1(reportResponse.data);

    const reportData = fromJS({
      neighborDetails: processedReportData
    });
    const neighborsWithReport = neighborsByFQN.set(BEHAVIORAL_HEALTH_REPORT_FQN.toString(), List([reportData]));

    const formSchemas = formSchemaResponse.data || v1;
    const { schemas, uiSchemas } = formSchemas;
    const { schema } = generateReviewSchema(schemas, uiSchemas, true);
    const formData = fromJS(constructFormDataFromNeighbors(neighborsWithReport, schema));
    const entityIndexToIdMap = getEntityIndexToIdMapFromNeighbors(neighborsWithReport, schema);

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
  finally {
    yield put(getCrisisReport.finally(action.id));
  }
  return response;
}

function* getCrisisReportWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_CRISIS_REPORT, getCrisisReportWorker);
}

function* createMissingCallForServiceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(createMissingCallForService.request(action.id));

    const {
      entityIndexToIdMap,
      formData,
      path,
      schema,
    } = value;
    const section = path[0];
    if (section === getPageSectionKey(1, 1)) {
      const callForServiceAddress = getEntityAddressKey(0, CALL_FOR_SERVICE_FQN, OL_ID_FQN);
      const hasCallForServiceData = hasIn(formData, [section, callForServiceAddress]);
      const hasCallForServiceEntityKey = hasIn(entityIndexToIdMap, [CALL_FOR_SERVICE_FQN, 0]);
      if (hasCallForServiceData && !hasCallForServiceEntityKey) {
        const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
        const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));

        const callForServiceFormData = fromJS({
          [section]: {
            [callForServiceAddress]: getIn(formData, [section, callForServiceAddress])
          }
        });

        const entityData = processEntityData(callForServiceFormData, entitySetIds, propertyTypeIds);

        const reportEKID = getIn(entityIndexToIdMap, [BEHAVIORAL_HEALTH_REPORT_FQN, 0]);

        const NOW_DATA = { [COMPLETED_DT_FQN]: [DateTime.local().toISO()] };

        const associations :any[][] = [
          [REGISTERED_FOR_FQN, reportEKID, BEHAVIORAL_HEALTH_REPORT_FQN, 0, CALL_FOR_SERVICE_FQN, NOW_DATA]
        ];
        const associationEntityData = processAssociationEntityData(
          associations,
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

        const newEntityIndexToIdMap = getEntityIndexToIdMapFromDataGraphResponse(
          fromJS(dataGraphResponse.data),
          schema,
          appTypeFqnsByIds
        );

        response.data = {
          formData: fromJS(removeIn(formData, [section, callForServiceAddress])),
          entityIndexToIdMap: newEntityIndexToIdMap
        };
      }
    }

    yield put(createMissingCallForService.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(createMissingCallForService.failure(action.id));
  }
  finally {
    yield put(createMissingCallForService.finally(action.id));
  }
  return response;
}

function* createMissingCallForServiceWatcher() :Generator<any, any, any> {
  yield takeEvery(CREATE_MISSING_CALL_FOR_SERVICE, createMissingCallForServiceWorker);
}

function* updateCrisisReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(updateCrisisReport.request(action.id, value));

    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const settings :Map = yield select((state) => state.getIn(['app', 'selectedOrganizationSettings'], Map()));

    const { path, formData, entityIndexToIdMap } = value;

    const section = path[0];
    let preFormData = fromJS(formData).mapKeys(() => section);

    let processedFormData = formData;

    // post process section that matches path only if V1
    if (settings.get('v1')) {
      const postProcessMap = {
        [getPageSectionKey(1, 1)]: (v) => v,
        [getPageSectionKey(2, 1)]: postProcessBehaviorSection,
        [getPageSectionKey(3, 1)]: postProcessNatureSection,
        [getPageSectionKey(4, 1)]: postProcessSafetySection,
        [getPageSectionKey(5, 1)]: postProcessDisposition,
      };

      // check and create missing call for service edge
      const createMissingCallForServiceResponse = yield call(
        createMissingCallForServiceWorker,
        createMissingCallForService(value)
      );
      if (createMissingCallForServiceResponse.error) throw createMissingCallForServiceResponse.error;
      // remove call for service if successfully created
      preFormData = createMissingCallForServiceResponse?.data?.formData || preFormData;

      processedFormData = postProcessMap[section](preFormData.toJS());
    }

    // replace address keys with entityKeyId
    const draftWithKeys = replaceEntityAddressKeys(
      processedFormData,
      findEntityAddressKeyFromMap(entityIndexToIdMap)
    );

    const originalWithKeys = replaceEntityAddressKeys(
      {},
      findEntityAddressKeyFromMap(entityIndexToIdMap)
    );

    // process for partial replace
    const entityData = processEntityDataForPartialReplace(
      draftWithKeys,
      originalWithKeys,
      entitySetIds,
      propertyTypeIds,
    );

    const updateResponse = yield call(
      submitPartialReplaceWorker,
      submitPartialReplace({
        ...value,
        entityData,
        formData: processedFormData
      })
    );

    if (updateResponse.error) throw updateResponse.error;
    yield put(updateCrisisReport.success(action.id));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(updateCrisisReport.failure(action.id, error));
  }
  finally {
    yield put(updateCrisisReport.finally(action.id));
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
  finally {
    yield put(deleteCrisisReportContent.finally(action.id));
  }
  return response;
}

function* deleteCrisisReportContentWatcher() :Generator<any, any, any> {
  yield takeEvery(DELETE_CRISIS_REPORT_CONTENT, deleteCrisisReportContentWorker);
}

function* deleteCrisisReportWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(deleteCrisisReport.request(action.id));
    const { entityKeyId, entityIndexToIdMap } = action.value;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    const app :Map = yield select((state) => state.get('app', Map()));

    // do not delete incident or staff

    const entityIndex = entityIndexToIdMap
      .delete(INCIDENT_FQN)
      .delete(STAFF_FQN);
    const deleteCalls = [];
    entityIndex.entrySeq().forEach(([fqn, ids]) => {
      const entitySetId = getESIDFromApp(app, fqn);
      const entityKeyIds = ids.valueSeq().toArray();
      if (entityKeyIds.length) {
        deleteCalls.push(call(
          deleteEntityDataWorker,
          deleteEntityData({
            entityKeyIds,
            entitySetId,
            deleteType: DeleteTypes.Soft
          })
        ));
      }
    });
    const deleteResponses = yield all(deleteCalls);

    deleteResponses.forEach((deleteResponse) => {
      if (deleteResponse.error) throw deleteResponse.error;
    });

    yield put(deleteCrisisReport.success(action.id));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(deleteCrisisReport.failure(action.id, error));
  }
  finally {
    yield put(deleteCrisisReport.finally(action.id));
  }
  return response;
}

function* deleteCrisisReportWatcher() :Generator<any, any, any> {
  yield takeEvery(DELETE_CRISIS_REPORT, deleteCrisisReportWorker);
}

export {
  addOptionalCrisisReportContentWatcher,
  addOptionalCrisisReportContentWorker,
  createMissingCallForServiceWatcher,
  createMissingCallForServiceWorker,
  deleteCrisisReportContentWatcher,
  deleteCrisisReportContentWorker,
  getChargeEventsWatcher,
  getChargeEventsWorker,
  getCrisisReportV2DataWorker,
  getCrisisReportV2Watcher,
  getCrisisReportV2Worker,
  getCrisisReportWatcher,
  getCrisisReportWorker,
  getLocationOfIncidentWatcher,
  getLocationOfIncidentWorker,
  getReportsNeighborsWatcher,
  getReportsNeighborsWorker,
  getReportsV2NeighborsWatcher,
  getReportsV2NeighborsWorker,
  getSubjectOfIncidentWatcher,
  getSubjectOfIncidentWorker,
  submitCrisisReportV2Watcher,
  submitCrisisReportV2Worker,
  submitCrisisReportWatcher,
  submitCrisisReportWorker,
  updateCrisisReportWatcher,
  updateCrisisReportWorker,
  updatePersonReportCountWorker,
  deleteCrisisReportWorker,
  deleteCrisisReportWatcher,
};
