/*
 * @flow
 */

import { Map } from 'immutable';
import { Constants, Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { push } from 'react-router-redux';
import { call, put, takeEvery } from 'redux-saga/effects';

import Logger from '../../utils/Logger';
import { REPORT_VIEW_PATH } from '../../core/router/Routes';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../utils/Errors';
import {
  DELETE_REPORT,
  GET_REPORT_IN_FULL,
  GET_REPORTS,
  SUBMIT_REPORT_EDITS,
  deleteReport,
  getReportInFull,
  getReports,
  submitReportEdits,
} from './ReportsActions';

const LOG = new Logger('ReportsSagas');

const { OPENLATTICE_ID_FQN } = Constants;
const { UpdateTypes } = Types;
const { clearEntityFromEntitySet, getEntitySetData, updateEntityData } = DataApiActions;
const { clearEntityFromEntitySetWorker, getEntitySetDataWorker, updateEntityDataWorker } = DataApiSagas;
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
    const response = yield call(clearEntityFromEntitySetWorker, clearEntityFromEntitySet({ entityKeyId, entitySetId }));
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
 * ReportsActions.getReportInFull()
 *
 */

function* getReportInFullWorker(action :SequenceAction) :Generator<*, *, *> {

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(getReportInFull.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  const entitySetId :string = value.entitySetId;
  const report :Map<*, *> = value.report;
  const reportEntityKeyId :string = report.getIn([OPENLATTICE_ID_FQN, 0]);

  try {
    yield put(getReportInFull.request(action.id, reportEntityKeyId));

    // the push() happens here because request() above sets "selectedReportEntityKeyId", which is needed for
    // the component that will render the report in full. otherwise, the report will redirect.
    // TODO: this is probably not the way to handle this routing
    yield put(push(REPORT_VIEW_PATH));

    const response = yield call(
      searchEntityNeighborsWorker,
      searchEntityNeighbors({
        entitySetId,
        entityId: reportEntityKeyId,
      })
    );

    if (response.error) throw response.error;
    yield put(getReportInFull.success(action.id, response.data));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(getReportInFull.failure(action.id, error));
  }
  finally {
    yield put(getReportInFull.finally(action.id));
  }
}

function* getReportInFullWatcher() :Generator<*, *, *> {

  yield takeEvery(GET_REPORT_IN_FULL, getReportInFullWorker);
}

/*
 *
 * ReportsActions.submitReportEdits()
 *
 */

function* submitReportEditsWorker(action :SequenceAction) :Generator<*, *, *> {

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(submitReportEdits.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  const entityData :Map<string, List<any>> = value.entityData;
  const entitySetId :string = value.entitySetId;

  try {
    yield put(submitReportEdits.request(action.id));
    const response = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId,
        entities: entityData.toJS(),
        updateType: UpdateTypes.PartialReplace,
      })
    );
    if (response.error) throw response.error;
    yield put(submitReportEdits.success(action.id, response.data));
  }
  catch (error) {
    LOG.error('caught exception in worker saga', error);
    yield put(submitReportEdits.failure(action.id, error));
  }
  finally {
    yield put(submitReportEdits.finally(action.id));
  }
}

function* submitReportEditsWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_REPORT_EDITS, submitReportEditsWorker);
}

/*
 *
 * exports
 *
 */

export {
  deleteReportWatcher,
  deleteReportWorker,
  getReportInFullWatcher,
  getReportInFullWorker,
  getReportsWatcher,
  getReportsWorker,
  submitReportEditsWatcher,
  submitReportEditsWorker,
};
