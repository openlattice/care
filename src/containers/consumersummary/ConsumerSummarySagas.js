import { List, Map } from 'immutable';
import { DataApiActionFactory, DataApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import { GET_BHR_REPORTS, getBHRReports } from './ConsumerSummaryActionFactory';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { getEntitySetData } = DataApiActionFactory;
const { getEntitySetDataWorker } = DataApiSagas;

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
