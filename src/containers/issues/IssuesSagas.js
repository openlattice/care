// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { DateTime } from 'luxon';
import { Map, fromJS } from 'immutable';
import {
  // DataApiActions,
  // DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../utils/Logger';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isValidUuid } from '../../utils/Utils';

import {
  GET_ALL_ISSUES,
  GET_MY_OPEN_ISSUES,
  GET_REPORTED_BY_ME,
  getAllIssues,
  getMyOpenIssues,
  getReportedByMe,
} from './IssuesActions';
import { getESIDFromApp } from '../../utils/AppUtils';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { DATE_TIME_FQN } from '../../edm/DataModelFqns';

// const {
//   createAssociations,
//   deleteEntityData,
//   getEntityData,
//   updateEntityData,
// } = DataApiActions;
// const {
//   createAssociationsWorker,
//   deleteEntityDataWorker,
//   getEntityDataWorker,
//   updateEntityDataWorker,
// } = DataApiSagas;
const {
  searchEntitySetData,
  searchEntityNeighborsWithFilter,
} = SearchApiActions;
const {
  searchEntitySetDataWorker,
  searchEntityNeighborsWithFilterWorker,
} = SearchApiSagas;

const {
  ASSIGNED_TO_FQN,
  ISSUE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
  PEOPLE_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('IssueSagas');

function* getMyOpenIssuesWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isValidUuid(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getMyOpenIssues.request(action.id));

    // const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    // if (response.error) throw response.error;

    yield put(getMyOpenIssues.success(action.id));
  }
  catch (error) {
    LOG.error('getMyOpenIssuesWorker', error);
    yield put(getMyOpenIssues.failure(action.id));
  }
}

function* getMyOpenIssuesWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_MY_OPEN_ISSUES, getMyOpenIssuesWorker);
}

function* getReportedByMeWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: currentUserEKID } = action;
    if (!isValidUuid(currentUserEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getReportedByMe.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const issueESID = getESIDFromApp(app, ISSUE_FQN);
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const reportedESID = getESIDFromApp(app, REPORTED_FQN);
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const subjectOfESID = getESIDFromApp(app, SUBJECT_OF_FQN);

    const issuesRequestParams = {
      entitySetId: staffESID,
      filter: {
        entityKeyIds: [currentUserEKID],
        edgeEntitySetIds: [reportedESID],
        destinationEntitySetIds: [issueESID],
        sourceEntitySetIds: []
      }
    };

    const issuesRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(issuesRequestParams)
    );

    if (issuesRequest.error) throw issuesRequest.error;

    const issuesData = fromJS(issuesRequest.data)
      .get(currentUserEKID) || Map();

    const reportedByMe = issuesData
      .map((neighbor) => {
        const datetime = neighbor.getIn(['associationDetails', DATE_TIME_FQN, 0]);
        const id = neighbor.get('neighborId');
        return neighbor
          .get('neighborDetails')
          .map((details) => details.get(0))
          .set(DATE_TIME_FQN.toString(), datetime)
          .set('id', id);
      })
      .sortBy((issue :Map,) :number => {
        const time = DateTime.fromISO(issue.get(DATE_TIME_FQN));

        return -time.valueOf();
      });

    yield put(getReportedByMe.success(action.id, {
      data: reportedByMe
    }));
  }
  catch (error) {
    LOG.error('getReportedByMeWorker', error);
    yield put(getReportedByMe.failure(action.id));
  }
}

function* getReportedByMeWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTED_BY_ME, getReportedByMeWorker);
}

function* getAllIssuesWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    yield put(getAllIssues.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const issueESID = getESIDFromApp(app, ISSUE_FQN);

    yield put(getAllIssues.success(action.id));
  }
  catch (error) {
    LOG.error('getAllIssuesWorker', error);
    yield put(getAllIssues.failure(action.id));
  }
}

function* getAllIssuesWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_ALL_ISSUES, getAllIssuesWorker);
}

export {
  getAllIssuesWatcher,
  getAllIssuesWorker,
  getMyOpenIssuesWatcher,
  getMyOpenIssuesWorker,
  getReportedByMeWatcher,
  getReportedByMeWorker,
};
