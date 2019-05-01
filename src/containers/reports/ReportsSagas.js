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
import { List, Map, fromJS } from 'immutable';
import { Types } from 'lattice';
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
  UPDATE_REPORT,
  deleteReport,
  getReport,
  getReports,
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

const LOG = new Logger('ReportsSagas');

const { DeleteTypes, UpdateTypes } = Types;
const {
  deleteEntity,
  getEntityData,
  getEntitySetData,
  updateEntityData,
} = DataApiActions;
const {
  deleteEntityWorker,
  getEntityDataWorker,
  getEntitySetDataWorker,
  updateEntityDataWorker,
} = DataApiSagas;
const {
  searchEntityNeighborsWithFilter,
} = SearchApiActions;
const {
  searchEntityNeighborsWithFilterWorker,
} = SearchApiSagas;

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

    const submittedStaff :Map = staffDataList.first(Map());
    const lastUpdatedStaff :Map = !staffDataList.last(Map()).equals(submittedStaff) ? staffDataList.last(Map()) : Map();

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

    yield put(getReport.success(action.id, { submittedStaff, lastUpdatedStaff }));
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
 * ReportsActions.updateReport()
 *
 */

function* updateReportWorker(action :SequenceAction) :Generator<*, *, *> {

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(updateReport.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  const {
    entityKeyId,
    formData,
  } = value;

  try {
    yield put(updateReport.request(action.id, value));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const app = yield select(state => state.get('app', Map()));
    const reportESID :UUID = getReportESId(app);

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

    const response = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: reportESID,
        entities: updateData,
        updateType: UpdateTypes.PartialReplace,
      })
    );
    if (response.error) throw response.error;
    yield put(updateReport.success(action.id, response.data));
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
  getReportsWatcher,
  getReportsWorker,
  getReportWatcher,
  getReportWorker,
  updateReportWatcher,
  updateReportWorker,
};
