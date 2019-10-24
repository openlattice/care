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
import { DateTime } from 'luxon';
import { isPlainObject } from 'lodash';
import {
  List,
  Map,
  OrderedMap,
  fromJS
} from 'immutable';
import {
  Constants,
  Types
} from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../utils/Logger';
import { BHR_CONFIG } from '../../config/formconfig/CrisisReportConfig';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import {
  DELETE_REPORT,
  GET_REPORT,
  GET_REPORTS_BY_DATE_RANGE,
  UPDATE_REPORT,
  deleteReport,
  getReport,
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
import { getSearchTerm } from '../../utils/DataUtils';
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
import { POST_PROCESS_FIELDS } from '../../utils/constants/CrisisReportConstants';

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
  const sorted = entities.sort((staffA :Map, staffB :Map) :number => {
    const timeA = DateTime.fromISO(staffA.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));
    const timeB = DateTime.fromISO(staffB.getIn(['associationDetails', FQN.DATE_TIME_FQN, 0]));

    if (!timeA.isValid) return 1;
    if (!timeB.isValid) return -1;

    return timeB.diff(timeA).toObject().milliseconds;
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
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(deleteReport.request(action.id, entityKeyId));

    const app = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getReportESId(app);

    const response = yield call(
      deleteEntityDataWorker,
      deleteEntityData({
        entityKeyIds: [entityKeyId],
        entitySetId,
        deleteType: DeleteTypes.Soft
      })
    );
    if (response.error) throw response.error;
    yield put(deleteReport.success(action.id));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(deleteReport.failure(action.id, error));
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

    yield put(getReport.success(action.id, { submitted, lastUpdated }));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(getReport.failure(action.id, error));
  }
}

function* getReportWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_REPORT, getReportWorker);
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

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const entitySetId :UUID = getReportESId(app);
    const peopleESID :UUID = getPeopleESId(app);
    const appearsInESID :UUID = getAppearsInESId(app);
    const reportedESID :UUID = getReportedESId(app);
    const staffESID :UUID = getStaffESId(app);

    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_OCCURRED_FQN]);
    const startDT = DateTime.fromISO(value.get('dateStart'));
    const endDT = DateTime.fromISO(value.get('dateEnd'));

    const startTerm = startDT.isValid ? startDT.toISO() : '*';
    const endTerm = endDT.isValid ? endDT.endOf('day').toISO() : '*';

    // search for reports within date range
    const searchOptions = {
      searchTerm: getSearchTerm(datetimePTID, `[${startTerm} TO ${endTerm}]`),
      start: 0,
      maxHits: 10000,
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
        const timeA = DateTime.fromISO(reportA.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));
        const timeB = DateTime.fromISO(reportB.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));

        if (!timeA.isValid) return 1;
        if (!timeB.isValid) return -1;

        return timeB.diff(timeA).toObject().milliseconds;
      });

    const reportEKIDs = reportData.map((report) => report.getIn([OPENLATTICE_ID_FQN, 0]));

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

    const results = List().withMutations((mutable) => {

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

    yield put(getReportsByDateRange.success(action.id, results));
  }
  catch (error) {
    yield put(getReportsByDateRange.failure(action.id, error));
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
    if (!isPlainObject(formData) || !isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

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
  getReportWatcher,
  getReportWorker,
  updateReportWatcher,
  updateReportWorker,
};
