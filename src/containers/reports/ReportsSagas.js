/*
 * @flow
 */

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
  OrderedMap,
  fromJS
} from 'immutable';
import { Constants, Types } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  DELETE_REPORT,
  GET_REPORT,
  GET_REPORTS_BY_DATE_RANGE,
  GET_REPORTS_BY_DATE_RANGE_V2,
  SUBMIT_REPORT,
  UPDATE_REPORT,
  deleteReport,
  getReport,
  getReportsByDateRange,
  getReportsByDateRangeV2,
  submitReport,
  updateReport,
} from './ReportsActions';
import {
  compileDispositionData,
  compileNatureOfCrisisData,
  compileObservedBehaviorData,
  compileOfficerSafetyData,
  compileSubjectData,
  getEntityDataFromFields
} from './ReportsUtils';
import { updatePersonReportCount } from './crisis/CrisisActions';
import { updatePersonReportCountWorker } from './crisis/CrisisReportSagas';
import { BEHAVIOR_LABEL_MAP } from './crisis/schemas/v1/constants';

import * as FQN from '../../edm/DataModelFqns';
import { BHR_CONFIG, PEOPLE_CONFIG } from '../../config/formconfig/CrisisReportConfig';
import { submitDataGraph } from '../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  getAppearsInESId,
  getESIDFromApp,
  getESIDsFromApp,
  getPeopleESId,
  getReportESId,
  getReportedESId,
  getStaffESId,
} from '../../utils/AppUtils';
import { getEntityKeyId, getSearchTerm } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { DISPOSITION, POST_PROCESS_FIELDS } from '../../utils/constants/CrisisReportConstants';
import { setInputValues as setDispositionData } from '../pages/disposition/ActionFactory';
import { setInputValues as setNatureOfCrisisData } from '../pages/natureofcrisis/ActionFactory';
import { setInputValues as setObservedBehaviors } from '../pages/observedbehaviors/ActionFactory';
import { setInputValues as setOfficerSafetyData } from '../pages/officersafety/ActionFactory';
import { setInputValues as setSubjectInformation } from '../pages/subjectinformation/Actions';
import {
  GET_INCIDENT_REPORTS,
  GET_INCIDENT_REPORTS_SUMMARY,
  GET_PROFILE_INCIDENTS,
  GET_REPORTERS_FOR_REPORTS,
  GET_REPORTS_BEHAVIOR_AND_SAFETY,
  getIncidentReports,
  getIncidentReportsSummary,
  getProfileIncidents,
  getReportersForReports,
  getReportsBehaviorAndSafety,
} from '../profile/actions/ReportActions';
import { countCrisisCalls, countPropertyOccurrance } from '../profile/premium/Utils';

const { isDefined } = LangUtils;
const { processAssociationEntityData } = DataProcessingUtils;
const { isValidUUID } = ValidationUtils;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  BEHAVIOR_FQN,
  CRISIS_REPORT_CLINICIAN_FQN,
  CRISIS_REPORT_FQN,
  FOLLOW_UP_REPORT_FQN,
  INCIDENT_FQN,
  INJURY_FQN,
  INTERACTED_WITH_FQN,
  INVOLVED_IN_FQN,
  PART_OF_FQN,
  PEOPLE_FQN,
  REPORTED_FQN,
  SELF_HARM_FQN,
  STAFF_FQN,
  VIOLENT_BEHAVIOR_FQN,
  WEAPON_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ReportsSagas');

const { DeleteTypes, UpdateTypes } = Types;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  createAssociations,
  deleteEntityData,
  getEntityData,
  updateEntityData,
} = DataApiActions;
const {
  createAssociationsWorker,
  deleteEntityDataWorker,
  getEntityDataWorker,
  updateEntityDataWorker,
} = DataApiSagas;
const {
  searchEntitySetData,
  searchEntityNeighborsWithFilter,
} = SearchApiActions;
const {
  searchEntitySetDataWorker,
  searchEntityNeighborsWithFilterWorker,
} = SearchApiSagas;

const getStaffInteractions = (entities :List<Map>) => {
  const sorted = entities.sortBy((staff :Map) => {
    const time = DateTime.fromISO(staff.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));
    return time.valueOf();
  });

  const submitted = sorted.first() || Map();
  const last = sorted.last() || Map();
  const lastUpdated = entities.size > 1 ? last : Map();

  return {
    submitted,
    lastUpdated
  };
};

/*
*
* ReportsActions.deleteReport()
*
*/

function* deleteReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { reportEKID, person } = action.value;
    if (!isValidUUID(reportEKID)) throw ERR_ACTION_VALUE_TYPE;

    yield put(deleteReport.request(action.id, reportEKID));

    const app = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getReportESId(app);

    const response = yield call(
      deleteEntityDataWorker,
      deleteEntityData({
        entityKeyIds: [reportEKID],
        entitySetId,
        deleteType: DeleteTypes.Soft
      })
    );
    if (response.error) throw response.error;
    yield put(deleteReport.success(action.id));

    // decrement report count
    const count = Math.max(0, person.getIn([FQN.NUM_REPORTS_FOUND_IN_FQN, 0], 0) - 1);
    const personEKID = getEntityKeyId(person);

    yield call(
      updatePersonReportCountWorker,
      updatePersonReportCount({
        entityKeyId: personEKID,
        count
      })
    );
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(deleteReport.failure(action.id, error));
  }
  finally {
    yield put(deleteReport.finally(action.id));
  }
}

function* deleteReportWatcher() :Generator<*, *, *> {

  yield takeEvery(DELETE_REPORT, deleteReportWorker);
}

/*
 *
 * ReportsActions.getReport()
 *
 */

function* getReportWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value: reportEKID } = action;
    if (!isDefined(reportEKID)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUUID(reportEKID)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getReport.request(action.id, reportEKID));

    const app = yield select((state) => state.get('app', Map()));
    const reportESID :UUID = getReportESId(app);
    const peopleESID :UUID = getPeopleESId(app);
    const appearsInESID :UUID = getAppearsInESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);

    // Get bhr.report data
    const reportRequest = call(getEntityDataWorker, getEntityData({
      entitySetId: reportESID,
      entityKeyId: reportEKID,
    }));

    // Get person -> appearsin -> bhr.report
    const personSearchParams = {
      entitySetId: reportESID,
      filter: {
        entityKeyIds: [reportEKID],
        edgeEntitySetIds: [appearsInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [peopleESID],
      }
    };

    const personRequest = call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(personSearchParams)
    );

    const staffSearchParams = {
      entitySetId: reportESID,
      filter: {
        entityKeyIds: [reportEKID],
        edgeEntitySetIds: [reportedESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [staffESID]
      }
    };

    const staffRequest = call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(staffSearchParams)
    );

    const [reportResponse, personResponse, staffResponse] = yield all([
      reportRequest,
      personRequest,
      staffRequest
    ]);

    const staffDataList = fromJS(staffResponse.data)
      .get(reportEKID, List());

    const { submitted, lastUpdated } = getStaffInteractions(staffDataList);

    const reportData = fromJS(reportResponse.data);

    // should only be one person per report
    const subjectDataList = fromJS(personResponse.data)
      .get(reportEKID, List())
      .map((report :Map) => report.get('neighborDetails'))
      .toSet()
      .toList();

    if (subjectDataList.count() > 1) {
      LOG.warn('more than one person found in report', reportEKID);
    }
    if (!subjectDataList.count()) {
      LOG.warn('person not found in report', reportEKID);
    }

    const subjectData = subjectDataList.first() || Map();

    const subjectInformation = compileSubjectData(subjectData, reportData);
    const observedBehaviors = compileObservedBehaviorData(reportData);
    const natureOfCrisis = compileNatureOfCrisisData(reportData);
    const officerSafety = compileOfficerSafetyData(reportData);
    const disposition = compileDispositionData(reportData);

    yield put(setSubjectInformation(subjectInformation));
    yield put(setObservedBehaviors(observedBehaviors));
    yield put(setNatureOfCrisisData(natureOfCrisis));
    yield put(setOfficerSafetyData(officerSafety));
    yield put(setDispositionData(disposition));

    yield put(getReport.success(action.id, { submitted, lastUpdated, person: subjectData }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getReport.failure(action.id, error));
  }
  finally {
    yield put(getReport.finally(action.id));
  }
}

function* getReportWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_REPORT, getReportWorker);
}

type SearchReportsByDateRangeAction = {
  dateEnd :string,
  dateStart :string,
  maxHits :number,
  reportFQN :FQN,
  start :number,
};

function* searchReportsByDateRange(action :SearchReportsByDateRangeAction) :Saga<WorkerResponse> {

  const {
    dateEnd,
    dateStart,
    maxHits = 10000,
    reportFQN,
    start = 0,
  } = action;

  const edm :Map = yield select((state) => state.get('edm'));
  const app = yield select((state) => state.get('app', Map()));

  const startDT = DateTime.fromISO(dateStart);
  const endDT = DateTime.fromISO(dateEnd);

  const reportESID :UUID = getESIDFromApp(app, reportFQN);
  const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.COMPLETED_DT_FQN]);

  const startTerm = startDT.isValid ? startDT.startOf('day').toISO() : '*';
  const endTerm = endDT.isValid ? endDT.endOf('day').toISO() : '*';
  const searchTerm = getSearchTerm(datetimePTID, `[${startTerm} TO ${endTerm}]`);

  // search for reports within date range
  const searchConstraints = {
    entitySetIds: [reportESID],
    start,
    maxHits,
    constraints: [{
      constraints: [{
        type: 'advanced',
        searchFields: [
          {
            searchTerm,
            property: datetimePTID
          }
        ]
      }]
    }],
    sort: {
      propertyTypeId: datetimePTID,
      type: 'field'
    }
  };

  const response :WorkerResponse = yield call(
    searchEntitySetDataWorker,
    searchEntitySetData(searchConstraints)
  );

  return response;
}

/*
 *
 * ReportsActions.getReportsByDateRangeV2()
 *
 */

function* getReportsByDateRangeV2Worker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;

    yield put(getReportsByDateRangeV2.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const type = searchInputs.getIn(['reportType', 'value']);

    // set entity set to match reportType value
    const reportESID :UUID = getESIDFromApp(app, type);
    const peopleESID :UUID = getPeopleESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);
    const incidentESID :UUID = getESIDFromApp(app, INCIDENT_FQN);
    const partOfESID :UUID = getESIDFromApp(app, PART_OF_FQN);
    const involvedInESID :UUID = getESIDFromApp(app, INVOLVED_IN_FQN);

    // search for reports within date range
    const response :WorkerResponse = yield call(
      searchReportsByDateRange,
      {
        dateStart: searchInputs.get('dateStart'),
        dateEnd: searchInputs.get('dateEnd'),
        reportFQN: type,
        start,
        maxHits,
      }
    );

    if (response.error) throw response.error;

    const { hits, numHits } = response.data;
    const reportData = fromJS(hits);

    const reportEKIDs = reportData.map((report) => report.getIn([OPENLATTICE_ID_FQN, 0])).toJS();

    let incidentEKIDsByReportEKID = Map();
    let staffResponseData = Map();
    let peopleResponseData = Map();
    if (reportEKIDs.length) {
      const incidentSearchParams = {
        entitySetId: reportESID,
        filter: {
          entityKeyIds: reportEKIDs,
          edgeEntitySetIds: [partOfESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [incidentESID]
        }
      };

      const staffSearchParams = {
        entitySetId: reportESID,
        filter: {
          entityKeyIds: reportEKIDs,
          edgeEntitySetIds: [reportedESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [staffESID],
        }
      };
      const staffRequest = call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(staffSearchParams)
      );

      const incidentRequest = call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(incidentSearchParams)
      );

      const [staffResponse, incidentResponse] = yield all([
        staffRequest,
        incidentRequest
      ]);

      if (staffResponse.error || incidentResponse.error) {
        const neighborErrors = {
          error: [
            staffResponse.error,
            incidentResponse.error,
          ]
        };

        throw neighborErrors;
      }

      staffResponseData = fromJS(staffResponse.data);
      const incidentsResponseData :Map = fromJS(incidentResponse.data);
      const incidentEKIDs = [];
      incidentEKIDsByReportEKID = incidentsResponseData.map((incident) => {
        const incidentDetails = incident.getIn([0, 'neighborDetails']);
        const incidentEKID = getEntityKeyId(incidentDetails);
        incidentEKIDs.push(incidentEKID);
        return incidentEKID;
      });

      const personSearchParams = {
        entitySetId: incidentESID,
        filter: {
          entityKeyIds: incidentEKIDs,
          edgeEntitySetIds: [involvedInESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [peopleESID],
        }
      };

      const personResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(personSearchParams)
      );

      if (personResponse.error) throw personResponse.error;

      peopleResponseData = fromJS(personResponse.data);
    }

    const reportsByDateRange = List().withMutations((mutable) => {

      reportData.forEach((report) => {
        const entityKeyId = report.getIn([OPENLATTICE_ID_FQN, 0]);
        const reportType = report.getIn([FQN.TYPE_FQN, 0]);
        const natureOfCrisis = report.getIn([FQN.DISPATCH_REASON_FQN]);
        const rawOccurred = report.getIn([FQN.COMPLETED_DT_FQN, 0]);
        let occurred;
        if (rawOccurred) {
          occurred = DateTime.fromISO(
            rawOccurred
          ).toLocaleString(DateTime.DATE_SHORT);
        }

        const incidentEKID = incidentEKIDsByReportEKID.get(entityKeyId);
        const staffs = staffResponseData.get(entityKeyId, List());
        const subjectDataList = peopleResponseData.get(incidentEKID, List());

        const { submitted } = getStaffInteractions(staffs);

        if (subjectDataList.count() > 1) {
          LOG.warn('more than one person found in report', entityKeyId);
        }
        if (!subjectDataList.count()) {
          LOG.warn('person not found in report', entityKeyId);
        }
        else {
          const subjectEntity = subjectDataList.first() || Map();
          const subjectData = subjectEntity.get('neighborDetails', Map());
          const rawDob = subjectData.getIn([FQN.PERSON_DOB_FQN, 0]);
          let dob;
          if (rawDob) {
            dob = DateTime.fromISO(
              rawDob
            ).toLocaleString(DateTime.DATE_SHORT);
          }

          mutable.push(OrderedMap({
            lastName: subjectData.getIn([FQN.PERSON_LAST_NAME_FQN, 0]),
            firstName: subjectData.getIn([FQN.PERSON_FIRST_NAME_FQN, 0]),
            middleName: subjectData.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0]),
            dob,
            occurred,
            reportType,
            natureOfCrisis,
            reporter: submitted.getIn(['neighborDetails', FQN.PERSON_ID_FQN, 0]),
            [OPENLATTICE_ID_FQN]: entityKeyId
          }));
        }

      });
    });

    yield put(getReportsByDateRangeV2.success(action.id, { reportsByDateRange, totalHits: numHits }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getReportsByDateRangeV2.failure(action.id, error));
  }
  finally {
    yield put(getReportsByDateRangeV2.finally(action.id));
  }
}

function* getReportsByDateRangeV2Watcher() :Generator<*, *, *> {
  yield takeEvery(GET_REPORTS_BY_DATE_RANGE_V2, getReportsByDateRangeV2Worker);
}

/*
 *
 * ReportsActions.getReportsByDateRange()
 *
 */

function* getReportsByDateRangeWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;

    yield put(getReportsByDateRange.request(action.id));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const entitySetId :UUID = getReportESId(app);
    const peopleESID :UUID = getPeopleESId(app);
    const appearsInESID :UUID = getAppearsInESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);

    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_OCCURRED_FQN]);
    const startDT = DateTime.fromISO(searchInputs.get('dateStart'));
    const endDT = DateTime.fromISO(searchInputs.get('dateEnd'));

    const startTerm = startDT.isValid ? startDT.toISO() : '*';
    const endTerm = endDT.isValid ? endDT.endOf('day').toISO() : '*';
    const searchTerm = getSearchTerm(datetimePTID, `[${startTerm} TO ${endTerm}]`);

    // search for reports within date range
    const searchConstraints = {
      entitySetIds: [entitySetId],
      start,
      maxHits,
      constraints: [{
        constraints: [{
          type: 'advanced',
          searchFields: [
            {
              searchTerm,
              property: datetimePTID
            }
          ]
        }]
      }],
      sort: {
        propertyTypeId: datetimePTID,
        type: 'field'
      }
    };

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (response.error) throw response.error;

    const { hits, numHits } = response.data;
    const reportData = fromJS(hits);

    const reportEKIDs = reportData.map((report) => report.getIn([OPENLATTICE_ID_FQN, 0]));

    let peopleResponseData = Map();
    let staffResponseData = Map();
    if (reportEKIDs.count()) {

      const peopleSearchParams = {
        entitySetId,
        filter: {
          entityKeyIds: reportEKIDs.toJS(),
          edgeEntitySetIds: [appearsInESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [peopleESID],
        }
      };

      const staffSearchParams = {
        entitySetId,
        filter: {
          entityKeyIds: reportEKIDs.toJS(),
          edgeEntitySetIds: [reportedESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [staffESID],
        }
      };

      const peopleRequest = call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(peopleSearchParams)
      );

      const staffRequest = call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(staffSearchParams)
      );

      const [peopleResponse, staffResponse] = yield all([
        peopleRequest,
        staffRequest
      ]);

      if (peopleResponse.error || staffResponse.error) {
        const neighborErrors = {
          error: [
            peopleResponse.error,
            staffResponse.error
          ]
        };

        throw neighborErrors;
      }

      peopleResponseData = fromJS(peopleResponse.data);
      staffResponseData = fromJS(staffResponse.data);
    }

    const reportsByDateRange = List().withMutations((mutable) => {

      reportData.forEach((report) => {
        const entityKeyId = report.getIn([OPENLATTICE_ID_FQN, 0]);
        const reportType = report.getIn([FQN.TYPE_FQN, 0]);
        const natureOfCrisis = report.getIn([FQN.DISPATCH_REASON_FQN]);
        const rawOccurred = report.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]);
        let occurred;
        if (rawOccurred) {
          occurred = DateTime.fromISO(
            rawOccurred
          ).toLocaleString(DateTime.DATE_SHORT);
        }

        const staffs = staffResponseData.get(entityKeyId, List());
        const subjectDataList = peopleResponseData.get(entityKeyId, List());

        const { submitted } = getStaffInteractions(staffs);

        if (subjectDataList.count() > 1) {
          LOG.warn('more than one person found in report', entityKeyId);
        }
        if (!subjectDataList.count()) {
          LOG.warn('person not found in report', entityKeyId);
        }
        else {
          const subjectEntity = subjectDataList.first() || Map();
          const subjectData = subjectEntity.get('neighborDetails', Map());
          const rawDob = subjectData.getIn([FQN.PERSON_DOB_FQN, 0]);
          let dob;
          if (rawDob) {
            dob = DateTime.fromISO(
              rawDob
            ).toLocaleString(DateTime.DATE_SHORT);
          }

          mutable.push(OrderedMap({
            lastName: subjectData.getIn([FQN.PERSON_LAST_NAME_FQN, 0]),
            firstName: subjectData.getIn([FQN.PERSON_FIRST_NAME_FQN, 0]),
            middleName: subjectData.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0]),
            dob,
            occurred,
            reportType,
            natureOfCrisis,
            reporter: submitted.getIn(['neighborDetails', FQN.PERSON_ID_FQN, 0]),
            [OPENLATTICE_ID_FQN]: entityKeyId
          }));
        }

      });
    });

    yield put(getReportsByDateRange.success(action.id, { reportsByDateRange, totalHits: numHits }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getReportsByDateRange.failure(action.id, error));
  }
  finally {
    yield put(getReportsByDateRange.finally(action.id));
  }
}

function* getReportsByDateRangeWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_REPORTS_BY_DATE_RANGE, getReportsByDateRangeWorker);
}

/*
 *
 * ReportsActions.updateReport()
 *
 */

function* updateReportWorker(action :SequenceAction) :Generator<*, *, *> {
  const response = {};

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    const {
      entityKeyId,
      formData,
    } = value;
    if (!isPlainObject(formData) || !isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(updateReport.request(action.id, value));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));
    const reportESID :UUID = getReportESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);
    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_FQN]);

    const staffEKID :UUID = yield select(
      (state) => state.getIn(['staff', 'currentUser', 'data', OPENLATTICE_ID_FQN, 0], '')
    );

    if (!isValidUUID(staffEKID)) {
      throw Error('staff entityKeyId is invalid');
    }

    const associations = {
      [reportedESID]: [{
        dst: {
          entityKeyId,
          entitySetId: reportESID,
        },
        src: {
          entityKeyId: staffEKID,
          entitySetId: staffESID,
        },
        data: {
          [datetimePTID]: [formData[POST_PROCESS_FIELDS.TIMESTAMP]]
        }
      }]
    };

    const staffRequest = call(
      createAssociationsWorker,
      createAssociations(associations)
    );

    const reportFields = BHR_CONFIG.fields;
    const updatedProperties = {};
    Object.keys(reportFields).forEach((field) => {
      const fqn = reportFields[field];
      const propertyTypeId = edm.getIn(['fqnToIdMap', fqn]);
      if (!propertyTypeId) LOG.error('propertyType id for fqn not found', fqn);
      let updatedValue;
      if (Array.isArray(formData[field])) {
        updatedValue = formData[field];
      }
      else {
        updatedValue = [formData[field]];
      }
      updatedProperties[propertyTypeId] = updatedValue;
    });

    const updateData = {
      [entityKeyId]: updatedProperties
    };

    const updateRequest = call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: reportESID,
        entities: updateData,
        updateType: UpdateTypes.PartialReplace,
      })
    );

    const responses = yield all([
      updateRequest,
      staffRequest
    ]);

    const responseErrors = responses.reduce((acc, res) => {
      if (res.error) {
        acc.push(res.error);
      }
      return acc;
    }, []);

    if (responseErrors.length) response.error = responseErrors;
    if (response.error) throw response.error;

    yield put(updateReport.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateReport.failure(action.id, error));
  }
  finally {
    yield put(updateReport.finally(action.id));
  }
}

function* updateReportWatcher() :Generator<*, *, *> {

  yield takeEvery(UPDATE_REPORT, updateReportWorker);
}

function* submitReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    const {
      entityKeyId: personEKID = 0,
      selectedPerson,
      formData,
    } = value;
    if (!isPlainObject(formData)) throw ERR_ACTION_VALUE_TYPE;

    yield put(submitReport.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));
    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const reportESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);

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
      [INTERACTED_WITH_FQN, staffEKID, STAFF_FQN, personEKID, PEOPLE_FQN, {
        [FQN.DATE_TIME_FQN]: [formData[POST_PROCESS_FIELDS.TIMESTAMP]],
        [FQN.CONTACT_DATE_TIME_FQN]: [formData[DISPOSITION.INCIDENT_DATE_TIME]]
      }],
    ];

    const associationEntityData = processAssociationEntityData(
      associations,
      entitySetIds,
      propertyTypeIds
    );

    const reportFields = BHR_CONFIG.fields;
    const peopleFields = PEOPLE_CONFIG.fields;
    const reportData = getEntityDataFromFields(formData, reportFields, propertyTypeIds);

    const entityData = {
      [reportESID]: [reportData]
    };

    if (personEKID === 0) {
      const personData = getEntityDataFromFields(formData, peopleFields, propertyTypeIds);
      entityData[peopleESID] = [personData];
    }

    const submitResponse = yield call(submitDataGraphWorker, submitDataGraph({
      associationEntityData,
      entityData
    }));

    if (submitResponse.error) throw submitResponse.error;

    const count = selectedPerson.getIn([FQN.NUM_REPORTS_FOUND_IN_FQN, 0], 0) + 1;
    yield call(
      updatePersonReportCountWorker,
      updatePersonReportCount({
        entityKeyId: personEKID,
        count
      })
    );

    yield put(submitReport.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitReport.failure(action.id, error));
  }
  finally {
    yield put(submitReport.finally(action.id));
  }
}

function* submitReportWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_REPORT, submitReportWorker);
}

function* getProfileIncidentsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getProfileIncidents.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      incidentESID,
      involvedInESID
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      INCIDENT_FQN,
      INVOLVED_IN_FQN,
    ]);

    const incidentsSearchParam = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [involvedInESID],
        destinationEntitySetIds: [incidentESID],
        sourceEntitySetIds: [],
      },
    };

    const incidentsRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(incidentsSearchParam)
    );

    if (incidentsRequest.error) throw incidentsRequest.error;

    const incidentsData = fromJS(incidentsRequest.data)
      .get(entityKeyId, List())
      .toSet()
      .toList()
      .sortBy((incident :Map) :number => {
        const time = DateTime.fromISO(incident.getIn(['neighborDetails', FQN.DATETIME_START_FQN, 0]));

        return -time.valueOf();
      });

    response.data = incidentsData;
    yield put(getProfileIncidents.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getProfileIncidents.failure(action.id, error));
  }
  finally {
    yield put(getProfileIncidents.finally(action.id));
  }
  return response;
}

function* getProfileIncidentsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_PROFILE_INCIDENTS, getProfileIncidentsWorker);
}

// fetch all reports for each incident
function* getIncidentReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: incidentEKIDs } = action;
    if (Array.isArray(incidentEKIDs) && !incidentEKIDs.every(isValidUUID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getIncidentReports.request(action.id));

    // TODO: handle both clinician and patrol views separately.
    // TODO: follow up reports
    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      partOfESID,
      incidentESID,
      crisisReportESID,
      crisisReportClinicianESID,
      followupReportESID,
    ] = getESIDsFromApp(app, [
      PART_OF_FQN,
      INCIDENT_FQN,
      CRISIS_REPORT_FQN,
      CRISIS_REPORT_CLINICIAN_FQN,
      FOLLOW_UP_REPORT_FQN,
    ]);

    const reportsSearchParam = {
      entitySetId: incidentESID,
      filter: {
        entityKeyIds: incidentEKIDs,
        edgeEntitySetIds: [partOfESID],
        destinationEntitySetIds: [crisisReportESID, crisisReportClinicianESID, followupReportESID],
        sourceEntitySetIds: [],
      },
    };

    const reportsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(reportsSearchParam)
    );

    if (reportsResponse.error) throw reportsResponse.error;
    response.data = fromJS(reportsResponse.data);

    yield put(getIncidentReports.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getIncidentReports.failure(action.id), error);
  }
  finally {
    yield put(getIncidentReports.finally(action.id));
  }
  return response;
}

function* getIncidentReportsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_INCIDENT_REPORTS, getIncidentReportsWorker);
}

function* getReportsBehaviorAndSafetyWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: reportsEKIDs } = action;
    if (Array.isArray(reportsEKIDs) && !reportsEKIDs.every(isValidUUID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getReportsBehaviorAndSafety.request(action.id, reportsEKIDs));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      behaviorESID,
      clinicianReportESID,
      injuryESID,
      partOfESID,
      selfHarmESID,
      violentBehaviorESID,
      weaponESID,
    ] = getESIDsFromApp(app, [
      BEHAVIOR_FQN,
      CRISIS_REPORT_FQN,
      INJURY_FQN,
      PART_OF_FQN,
      SELF_HARM_FQN,
      VIOLENT_BEHAVIOR_FQN,
      WEAPON_FQN,
    ]);

    const behaviorsSearchParam = {
      entitySetId: clinicianReportESID,
      filter: {
        entityKeyIds: reportsEKIDs,
        edgeEntitySetIds: [partOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [behaviorESID, injuryESID, selfHarmESID, violentBehaviorESID, weaponESID],
      },
    };

    const neighborsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(behaviorsSearchParam)
    );

    if (neighborsResponse.error) throw neighborsResponse.error;
    const behaviorData = fromJS(neighborsResponse.data);

    response.data = behaviorData;

    yield put(getReportsBehaviorAndSafety.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getReportsBehaviorAndSafety.failure(action.id, error));
  }
  finally {
    yield put(getReportsBehaviorAndSafety.finally(action.id));
  }
  return response;
}

function* getReportsBehaviorAndSafetyWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTS_BEHAVIOR_AND_SAFETY, getReportsBehaviorAndSafetyWorker);
}

function* getReportersForReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyIds } = action;
    if (Array.isArray(entityKeyIds) && !entityKeyIds.every(isValidUUID)) throw ERR_ACTION_VALUE_TYPE;
    yield getReportersForReports.request(action.id);

    const app :Map = yield select((state) => state.get('app', Map()));
    const [reportedESID, staffESID, clinicianReportESID] = getESIDsFromApp(app, [
      REPORTED_FQN, STAFF_FQN, CRISIS_REPORT_FQN
    ]);

    const reportersSearchParam = {
      entitySetId: clinicianReportESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [reportedESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [staffESID]
      }
    };

    const reportersResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(reportersSearchParam)
    );

    if (reportersResponse.error) throw reportersResponse.error;
    const reportersData = fromJS(reportersResponse.data);
    response.data = reportersData;
    yield getReportersForReports.success(action.id, reportersData);
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield getReportersForReports.failure(action.id, error);
  }
  finally {
    yield put(getReportersForReports.finally(action.id));
  }
  return response;
}

function* getReportersForReportsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTERS_FOR_REPORTS, getReportersForReportsWorker);
}

// after getting all incidents, get reports => behavior/officer safety summaries.
function* getIncidentReportsSummaryWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: personEKID } = action;
    if (!isValidUUID(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getIncidentReportsSummary.request(action.id));

    const incidents = yield call(
      getProfileIncidentsWorker,
      getProfileIncidents(personEKID)
    );
    if (incidents.error) throw incidents.error;

    const incidentsData = incidents.data
      .map((incident) => incident.get('neighborDetails'));

    const incidentsEKIDs = incidentsData
      .map((incident) => incident.getIn([FQN.OPENLATTICE_ID_FQN, 0]));

    const incidentsByEKID = Map(incidentsData.map((incident) => [incident.getIn([OPENLATTICE_ID_FQN, 0]), incident]));

    let allReports = List();
    if (incidentsEKIDs.size) {
      const reportsResponse = yield call(getIncidentReportsWorker, getIncidentReports(incidentsEKIDs.toJS()));
      if (reportsResponse.error) throw reportsResponse.error;
      const reportsData :Map = reportsResponse.data;
      allReports = List().withMutations((mutable) => {
        reportsData.forEach((reports, incidentEKID) => {
          reports.forEach((report) => {
            const incidentStartDate = incidentsByEKID.getIn([incidentEKID, FQN.DATETIME_START_FQN, 0]);
            const reportData = report
              .get('neighborDetails')
              .set(FQN.DATETIME_START_FQN.toString(), List([incidentStartDate]));
            mutable.push(reportData);
          });
        });
      })
        .sortBy((report :Map) :number => {
          const time = DateTime.fromISO(report.getIn([FQN.DATETIME_START_FQN, 0]));

          return -time.valueOf();
        });
    }

    const allReportsEKID = allReports.map((report) => report.getIn([OPENLATTICE_ID_FQN, 0]));
    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());
    let groupedNeighborsByType = Map();
    if (allReportsEKID.size) {
      const neighborsResponse = yield call(
        getReportsBehaviorAndSafetyWorker,
        getReportsBehaviorAndSafety(allReportsEKID.toJS())
      );

      if (neighborsResponse.error) throw neighborsResponse.error;

      const neighborsData = neighborsResponse.data;
      const tempGroupedData = Map().withMutations((mutable) => {
        neighborsData.forEach((neighbors) => {
          neighbors.forEach((neighbor) => {
            const entitySetId = neighbor.getIn(['neighborEntitySet', 'id']);
            const appTypeFqn = appTypeFqnsByIds.get(entitySetId);
            if (mutable.has(appTypeFqn)) {
              const entitySetCount = mutable.get(appTypeFqn).count();
              mutable.setIn([appTypeFqn, entitySetCount], neighbor.get('neighborDetails'));
            }
            else {
              mutable.set(appTypeFqn, List([neighbor.get('neighborDetails')]));
            }
          });
        });
      });
      groupedNeighborsByType = tempGroupedData;
    }

    const behaviors = groupedNeighborsByType.get(BEHAVIOR_FQN, List());
    const injuries = groupedNeighborsByType.get(INJURY_FQN, List());
    const selfHarms = groupedNeighborsByType.get(SELF_HARM_FQN, List());
    const violentBehaviors = groupedNeighborsByType.get(VIOLENT_BEHAVIOR_FQN, List());
    const weapons = groupedNeighborsByType.get(WEAPON_FQN, List());

    const behaviorSummary = countPropertyOccurrance(behaviors, FQN.OBSERVED_BEHAVIOR_FQN)
      .sortBy((count) => count, (valueA, valueB) => valueB - valueA)
      .toArray()
      .map(([name, count]) => ({ name, count }))
      .map((datum) => {
        const { name } = datum;
        const transformedName = BEHAVIOR_LABEL_MAP[name] || name;
        return { ...datum, name: transformedName };
      });

    const crisisSummary = countCrisisCalls(incidentsData, FQN.DATETIME_START_FQN);
    const safetySummary = fromJS([
      { name: 'Injuries', count: injuries.count() },
      { name: 'Self-harm', count: selfHarms.count() },
      { name: 'Violence', count: violentBehaviors.count() },
      { name: 'Armed', count: weapons.count() },
    ]);

    const reportSummary = fromJS({
      behaviorSummary,
      crisisSummary,
      data: allReports,
      incidents: incidentsData,
      safetySummary,
    });

    yield put(getIncidentReportsSummary.success(action.id, reportSummary));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getIncidentReportsSummary.failure(action.id));
  }
  finally {
    yield put(getIncidentReportsSummary.finally(action.id));
  }
  return response;
}

function* getIncidentReportsSummaryWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_INCIDENT_REPORTS_SUMMARY, getIncidentReportsSummaryWorker);
}

export {
  deleteReportWatcher,
  deleteReportWorker,
  getIncidentReportsSummaryWatcher,
  getIncidentReportsSummaryWorker,
  getIncidentReportsWatcher,
  getIncidentReportsWorker,
  getProfileIncidentsWatcher,
  getProfileIncidentsWorker,
  getReportWatcher,
  getReportWorker,
  getReportersForReportsWatcher,
  getReportsBehaviorAndSafetyWatcher,
  getReportsBehaviorAndSafetyWorker,
  getReportsByDateRangeV2Watcher,
  getReportsByDateRangeV2Worker,
  getReportsByDateRangeWatcher,
  getReportsByDateRangeWorker,
  searchReportsByDateRange,
  submitReportWatcher,
  submitReportWorker,
  updateReportWatcher,
  updateReportWorker,
};
