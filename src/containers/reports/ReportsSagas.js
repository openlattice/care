/*
 * @flow
 */

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map } from 'immutable';
import { Models, Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';

import Logger from '../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../utils/Errors';
import {
  DELETE_REPORT,
  GET_REPORT_NEIGHBORS,
  GET_REPORTS,
  UPDATE_REPORT,
  deleteReport,
  getReportNeighbors,
  getReports,
  updateReport,
} from './ReportsActions';

const LOG = new Logger('ReportsSagas');

const { FullyQualifiedName } = Models;
const { DeleteTypes, UpdateTypes } = Types;
const { deleteEntity, getEntitySetData, updateEntityData } = DataApiActions;
const { deleteEntityWorker, getEntitySetDataWorker, updateEntityDataWorker } = DataApiSagas;
const { searchEntityNeighbors } = SearchApiActions;
const { searchEntityNeighborsWorker } = SearchApiSagas;

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
  updateReportWatcher,
  updateReportWorker,
};
