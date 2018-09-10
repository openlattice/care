import { List, Map } from 'immutable';
import { SearchApiActionFactory, SearchApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import { GET_BHR_REPORT, getBHRReport } from './ConsumerSummaryActionFactory';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const { searchEntityNeighbors } = SearchApiActionFactory;
const { searchEntityNeighborsWorker } = SearchApiSagas;

const {
  BHR_REPORT_FQN
} = APP_TYPES_FQNS;


export function* getBHRReportWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getBHRReport.request(action.id));
    console.log('ACTION:', action);
    const {
      entitySetId,
      entityId
    } = action.value;

    const response :Response = yield call(
      searchEntityNeighborsWorker,
      searchEntityNeighbors({
        entitySetId,
        entityId
      })
    );

    console.log('response:', response);

    if (response.error) {
      throw new Error(response.error);
    }

    yield put(getBHRReport.success(action.id, response.data));
  }
  catch (error) {
    yield put(getBHRReport.failure(action.id, error));
  }
  finally {
    yield put(getBHRReport.finally(action.id));
  }
}

export function* getBHRReportWatcher() :Generator<*, *, *> {
console.log('inside watcher');
  yield takeEvery(GET_BHR_REPORT, getBHRReportWorker);
  console.log('completed watcher');
}
