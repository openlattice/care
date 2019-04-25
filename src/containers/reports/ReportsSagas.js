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
import { List, Map, fromJS } from 'immutable';
import { Models, Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';

import Logger from '../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import {
  DELETE_REPORT,
  GET_REPORT_NEIGHBORS,
  GET_REPORT,
  GET_REPORTS,
  UPDATE_REPORT,
  deleteReport,
  getReport,
  getReportNeighbors,
  getReports,
  updateReport,
} from './ReportsActions';
import { isValidUuid } from '../../utils/Utils';
import { isDefined } from '../../utils/LangUtils';
import {
  getAppearsInESId,
  getPeopleESId,
  getReportESId,
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

const LOG = new Logger('ReportsSagas');

const { FullyQualifiedName } = Models;
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
  searchEntityNeighbors,
  searchEntityNeighborsWithFilter,
} = SearchApiActions;
const {
  searchEntityNeighborsWorker,
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

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(deleteReport.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  const entityKeyId :string = value.entityKeyId;
  const entitySetId :string = value.entitySetId;

  try {
    yield put(deleteReport.request(action.id, { entityKeyId, entitySetId }));
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

    const app = yield select(state => state.getIn(['app'], Map()));
    const reportESID :UUID = getReportESId(app);
    const peopleESID :UUID = getPeopleESId(app);
    const appearsInESID :UUID = getAppearsInESId(app);

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

    const [reportResponse, personResponse] = yield all([
      reportRequest,
      personRequest
    ]);

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

    const subjectInformation = compileSubjectData(subjectData);
    const observedBehaviors = compileObservedBehaviorData(reportData);
    const natureOfCrisis = compileNatureOfCrisisData(reportData);
    const officerSafety = compileOfficerSafetyData(reportData);
    const disposition = compileDispositionData(reportData);

    yield put(setSubjectInformation(subjectInformation));
    yield put(setObservedBehaviors(observedBehaviors));
    yield put(setNatureOfCrisisData(natureOfCrisis));
    yield put(setOfficerSafetyData(officerSafety));
    yield put(setDispositionData(disposition));

    yield put(getReport.success(action.id));
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
 * ReportsActions.getReportNeighbors()
 *
 */

function* getReportNeighborsWorker(action :SequenceAction) :Generator<*, *, *> {

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(getReportNeighbors.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  const entitySetId :string = value.entitySetId;
  const entityKeyId :string = value.entityKeyId;

  try {
    yield put(getReportNeighbors.request(action.id, { entityKeyId }));

    const response = yield call(
      searchEntityNeighborsWorker,
      searchEntityNeighbors({
        entitySetId,
        // TODO: it should probably be "entityKeyId", not "entityId". this api might have to be updated
        entityId: entityKeyId,
      })
    );

    if (response.error) throw response.error;
    yield put(getReportNeighbors.success(action.id, response.data));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(getReportNeighbors.failure(action.id, error));
  }
  finally {
    yield put(getReportNeighbors.finally(action.id));
  }
}

function* getReportNeighborsWatcher() :Generator<*, *, *> {

  yield takeEvery(GET_REPORT_NEIGHBORS, getReportNeighborsWorker);
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

  const entityKeyId :string = value.entityKeyId;
  const entitySetId :string = value.entitySetId;
  const reportEdits :Map<string, List<any>> = value.reportEdits;

  try {
    yield put(updateReport.request(action.id, value));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const entityData :Map<string, List<any>> = Map().withMutations((map :Map<string, List<any>>) => {
      reportEdits.forEach((data :List<any>, fqn :FullyQualifiedName) => {
        const propertyTypeId :string = edm.getIn(['fqnToIdMap', fqn]);
        map.setIn([entityKeyId, propertyTypeId], data);
      });
    });

    const response = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId,
        entities: entityData.toJS(),
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
  getReportNeighborsWatcher,
  getReportNeighborsWorker,
  getReportsWatcher,
  getReportsWorker,
  getReportWatcher,
  getReportWorker,
  updateReportWatcher,
  updateReportWorker,
};
