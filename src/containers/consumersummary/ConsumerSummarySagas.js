import { List, Map } from 'immutable';
import { DataApiActionFactory, DataApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import { GET_BHR_REPORTS, GET_BHR_REPORT_DATA, getBHRReports, getBHRReportData } from './ConsumerSummaryActionFactory';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { getEntitySetData, getEntityData } = DataApiActionFactory;
const { getEntitySetDataWorker, getEntityDataWorker } = DataApiSagas;

const {
  BHR_REPORT_FQN
} = APP_TYPES_FQNS;


export function* getBHRReportsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getBHRReports.request(action.id));

    const {
      entitySetId
    } = action.value;

    const response :Response = yield call(
      getEntitySetDataWorker,
      getEntitySetData({
        entitySetId
      })
    );

    if (response.error) {
      throw new Error(response.error);
    }

    yield put(getBHRReports.success(action.id, response.data));
  }
  catch (error) {
    yield put(getBHRReports.failure(action.id, error));
  }
  finally {
    yield put(getBHRReports.finally(action.id));
  }
}

export function* getBHRReportsWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_BHR_REPORTS, getBHRReportsWorker);
}




export function* getBHRReportDataWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getBHRReportData.request(action.id));
    console.log('action:', action);
    const {
      entitySetId,
      entityId
    } = action.value;

    const response :Response = yield call(
      getEntityDataWorker,
      getEntityData({
        entitySetId,
        entityId
      })
    );
    console.log('response:', response);

    if (response.error) {
      throw new Error(response.error);
    }

    yield put(getBHRReportData.success(action.id, response.data));
  }
  catch (error) {
    console.log('error!!!:', error);
    yield put(getBHRReportData.failure(action.id, error));
  }
  finally {
    yield put(getBHRReportData.finally(action.id));
  }
}

export function* getBHRReportDataWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_BHR_REPORT_DATA, getBHRReportDataWorker);
}
