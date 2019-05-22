/*
 * @flow
 */

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import moment from 'moment';
import { isPlainObject } from 'lodash';
import { List, Map, fromJS } from 'immutable';
import {
  Constants,
  DataApi,
  Models,
  Types
} from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';

import Logger from '../../utils/Logger';
import { BHR_CONFIG } from '../../config/formconfig/CrisisTemplateConfig';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import {
  DELETE_REPORT,
  GET_REPORT,
  GET_REPORTS,
  GET_REPORTS_BY_DATE_RANGE,
  UPDATE_REPORT,
  deleteReport,
  getReport,
  getReports,
  getReportsByDateRange,
  updateReport,
} from './ReportsActions';
import { isValidUuid } from '../../utils/Utils';
import { isDefined } from '../../utils/LangUtils';
import {
  getAppearsInESId,
  getPeopleESId,
  getReportESId,
  getStaffESId,
  getReportedESId,
} from '../../utils/AppUtils';
import { getDateRangeSearchTerm } from '../../utils/DataUtils';
import {
  compileDispositionData,
  compileNatureOfCrisisData,
  compileObservedBehaviorData,
  compileOfficerSafetyData,
  compileSubjectData,
} from './ReportsUtils';
import { setInputValues as setDispositionData } from '../pages/disposition/ActionFactory';
import { setInputValues as setNatureOfCrisisData } from '../pages/natureofcrisis/ActionFactory';
import { setInputValues as setObservedBehaviors } from '../pages/observedbehaviors/ActionFactory';
import { setInputValues as setOfficerSafetyData } from '../pages/officersafety/ActionFactory';
import { setInputValues as setSubjectInformation } from '../pages/subjectinformation/ActionFactory';
import * as FQN from '../../edm/DataModelFqns';
import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisTemplateConstants';

const LOG = new Logger('ReportsSagas');

const { DeleteTypes, UpdateTypes } = Types;
const { DataGraphBuilder } = Models;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  createAssociations,
  deleteEntity,
  getEntityData,
  getEntitySetData,
  updateEntityData,
} = DataApiActions;
const {
  createAssociationsWorker,
  deleteEntityWorker,
  getEntityDataWorker,
  getEntitySetDataWorker,
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
  const sorted = entities.sort((staffA :Map, staffB :Map) :number => {
    const timeA = moment(staffA.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));
    const timeB = moment(staffB.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));
    return timeA.diff(timeB);
  });

  const submitted = sorted.first(Map());

  return {
    submitted,
    lastUpdated: !sorted.last(Map()).equals(submitted) ? sorted.last(Map()) : Map()
  };
};

/*
 *
 * sagas
 *
 */

/*
*
* ReportsActions.deleteReport()
*
*/

function* deleteReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(deleteReport.request(action.id, entityKeyId));

    const app = yield select(state => state.get('app', Map()));
    const entitySetId :UUID = getReportESId(app);

    const response = yield call(
      deleteEntityWorker,
      deleteEntity({ entityKeyId, entitySetId, deleteType: DeleteTypes.Soft })
    );
    if (response.error) throw response.error;
    yield put(deleteReport.success(action.id));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
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
    if (!isValidUuid(reportEKID)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getReport.request(action.id, reportEKID));

    const app = yield select(state => state.get('app', Map()));
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
      .get(reportEKID, List())
      .sort((staffA :Map, staffB :Map) :number => {
        const timeA = moment(staffA.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));
        const timeB = moment(staffB.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));
        return timeA.diff(timeB);
      });

    const { submitted, lastUpdated } = getStaffInteractions(staffDataList);

    const reportData = fromJS(reportResponse.data);
    // should only be one person per report
    const subjectDataList = fromJS(personResponse.data)
      .get(reportEKID, List());

    if (subjectDataList.count() > 1) {
      LOG.warn('more than one person found in report', reportEKID);
    }
    if (!subjectDataList.count()) {
      LOG.warn('person not found in report', reportEKID);
    }

    const subjectData = subjectDataList.first(Map()).get('neighborDetails', Map());

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

    yield put(getReport.success(action.id, { submitted, lastUpdated }));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(getReport.failure(action.id, error));
  }
  finally {
    yield put(getReport.finally(action.id));
  }
}

function* getReportWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_REPORT, getReportWorker);
}


/*
 *
 * ReportsActions.getReports()
 *
 */

function* getReportsWorker(action :SequenceAction) :Generator<*, *, *> {

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(getReports.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  const entitySetId :string = value.entitySetId;

  try {
    yield put(getReports.request(action.id));
    const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId }));
    if (response.error) throw response.error;
    yield put(getReports.success(action.id, response.data));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(getReports.failure(action.id, error));
  }
  finally {
    yield put(getReports.finally(action.id));
  }
}

function* getReportsWatcher() :Generator<*, *, *> {

  yield takeEvery(GET_REPORTS, getReportsWorker);
}

/*
 *
 * ReportsActions.getReportsByDateRange()
 *
 */

function* getReportsByDateRangeWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!Map.isMap(value)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getReportsByDateRange.request(action.id));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const app = yield select(state => state.get('app', Map()));

    const entitySetId :UUID = getReportESId(app);
    const peopleESID :UUID = getPeopleESId(app);
    const appearsInESID :UUID = getAppearsInESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);

    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_OCCURRED_FQN]);
    const entitySetSize = yield call(DataApi.getEntitySetSize, entitySetId);

    const startMoment = moment(value.get('dateStart', ''));
    const endMoment = moment(value.get('dateEnd', ''));

    const startDT = startMoment.isValid() ? startMoment.toISOString(true) : '*';
    const endDT = endMoment.isValid() ? endMoment.toISOString(true) : '*';

    // search for reports within date range
    const searchOptions = {
      searchTerm: getDateRangeSearchTerm(datetimePTID, `[${startDT} TO ${endDT}]`),
      start: 0,
      maxHits: entitySetSize,
      fuzzy: false
    };

    const { data, error } = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId,
        searchOptions
      })
    );

    if (error) throw error;

    // sort the reportData by time occurred DESC

    const reportData = fromJS(data.hits)
      .sort((reportA :Map, reportB :Map) :number => {
        const timeA = moment(reportA.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));
        const timeB = moment(reportB.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));
        return timeB.diff(timeA);
      });

    const reportEKIDs = reportData.map(report => report.getIn([OPENLATTICE_ID_FQN, 0]));

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

    const peopleResponseData = fromJS(peopleResponse.data);
    const staffResponseData = fromJS(staffResponse.data);

    const results = reportData.map((report) => {
      const entityKeyId = report.getIn([OPENLATTICE_ID_FQN, 0]);
      const dtOccurred = report.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]);
      const reportType = report.getIn([FQN.TYPE_FQN, 0]);
      const natureOfCrisis = report.getIn([FQN.DISPATCH_REASON_FQN]);

      const staffs = staffResponseData.get(entityKeyId, List());
      const subjectDataList = peopleResponseData.get(entityKeyId, List());

      const { submitted } = getStaffInteractions(staffs);

      if (subjectDataList.count() > 1) {
        LOG.warn('more than one person found in report', entityKeyId);
      }
      if (!subjectDataList.count()) {
        LOG.warn('person not found in report', entityKeyId);
      }

      const subjectData = subjectDataList.first(Map()).get('neighborDetails', Map());

      return fromJS({
        firstName: subjectData.getIn([FQN.PERSON_FIRST_NAME_FQN, 0]),
        lastName: subjectData.getIn([FQN.PERSON_LAST_NAME_FQN, 0]),
        middleName: subjectData.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0]),
        dob: subjectData.getIn([FQN.PERSON_DOB_FQN, 0]),
        dtOccurred,
        reportType,
        natureOfCrisis,
        submittor: submitted.getIn(['neighborDetails', FQN.PERSON_ID_FQN, 0]),
        OPENLATTICE_ID_FQN: entityKeyId
      });
    });

    yield put(getReportsByDateRange.success(action.id, results));
  }
  catch (error) {
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
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;
    const {
      entityKeyId,
      formData,
    } = value;
    if (!isPlainObject(formData) || !isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(updateReport.request(action.id, value));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const app = yield select(state => state.get('app', Map()));
    const reportESID :UUID = getReportESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);
    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_FQN]);

    const staffEKID :UUID = yield select(
      state => state.getIn(['staff', 'currentUserStaffMemberData', OPENLATTICE_ID_FQN, 0], '')
    );

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
    LOG.error('caught exception in worker saga', error);
    yield put(updateReport.failure(action.id, error));
  }
  finally {
    yield put(updateReport.finally(action.id));
  }
}

function* updateReportWatcher() :Generator<*, *, *> {

  yield takeEvery(UPDATE_REPORT, updateReportWorker);
}

/*
 *
 * exports
 *
 */

export {
  deleteReportWatcher,
  deleteReportWorker,
  getReportsByDateRangeWatcher,
  getReportsByDateRangeWorker,
  getReportsWatcher,
  getReportsWorker,
  getReportWatcher,
  getReportWorker,
  updateReportWatcher,
  updateReportWorker,
};
