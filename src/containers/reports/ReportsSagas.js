/*
 * @flow
 */

import { Map } from 'immutable';
import { Constants } from 'lattice';
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
  GET_REPORT_IN_FULL,
  GET_REPORTS,
  getReportInFull,
  getReports,
} from './ReportsActions';

const LOG = new Logger('AppSagas');

const { OPENLATTICE_ID_FQN } = Constants;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntityNeighbors } = SearchApiActions;
const { searchEntityNeighborsWorker } = SearchApiSagas;

/*
 *
 * sagas
 *
 */

/*
 *
 * ReportActions.getReports()
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
    LOG.error('caught exception in getReportsWorker()', error);
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
    LOG.error('caught exception in getReportInFullWorker()', error);
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
 * exports
 *
 */

export {
  getReportInFullWorker,
  getReportInFullWatcher,
  getReportsWatcher,
  getReportsWorker,
};
