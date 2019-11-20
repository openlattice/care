// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  get
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import { Constants } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/Errors';
import { submitDataGraph } from '../../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../../core/sagas/data/DataSagas';
import { isDefined } from '../../../utils/LangUtils';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { constructFormData, constructEntityIndexToIdMap } from './IssueUtils';

import {
  SELECT_ISSUE,
  SUBMIT_ISSUE,
  selectIssue,
  submitIssue,
} from './IssueActions';
import { getESIDFromApp } from '../../../utils/AppUtils';
import { groupNeighborsByEntitySetIds } from '../../../utils/DataUtils';

const LOG = new Logger('IssueSagas');

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { OPENLATTICE_ID_FQN } = Constants;

const {
  ASSIGNED_TO_FQN,
  ISSUE_FQN,
  PEOPLE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

function* submitIssueWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(submitIssue.request(action.id));

    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitIssue.success(action.id));
  }
  catch (error) {
    LOG.error('submitIssueWorker', error);
    yield put(submitIssue.failure(action.id));
  }
}

function* submitIssueWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ISSUE, submitIssueWorker);
}

function* selectIssueWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(selectIssue.request(action.id));

    const issueEKID :string = get(value, 'id');

    const app :Map = yield select((state) => state.get('app'), Map());
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const staffESID :UUID = getESIDFromApp(app, STAFF_FQN);
    const reportedESID :UUID = getESIDFromApp(app, REPORTED_FQN);
    const assignedToESID :UUID = getESIDFromApp(app, ASSIGNED_TO_FQN);
    const subjectOfESID :UUID = getESIDFromApp(app, SUBJECT_OF_FQN);
    const issueESID :UUID = getESIDFromApp(app, ISSUE_FQN);

    const issueSearchParams = {
      entitySetId: issueESID,
      filter: {
        entityKeyIds: [issueEKID],
        edgeEntitySetIds: [reportedESID, assignedToESID, subjectOfESID],
        destinationEntitySetIds: [staffESID],
        sourceEntitySetIds: [peopleESID, staffESID],
      }
    };

    const issueResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(issueSearchParams)
    );

    if (issueResponse.error) throw issueResponse.error;

    const issueResponseData = fromJS(issueResponse.data).get(issueEKID);
    const neighborsByEdge = groupNeighborsByEntitySetIds(issueResponseData, true, true);

    const assignee = neighborsByEdge.getIn([assignedToESID, 0, 'neighborDetails'], Map());
    const reporter = neighborsByEdge.getIn([reportedESID, 0, 'neighborDetails'], Map());
    const subject = neighborsByEdge.getIn([subjectOfESID, 0, 'neighborDetails'], Map());
    const issue = fromJS(value).map((property :string) => List([property]));
    const assignedToEKID = neighborsByEdge
      .getIn([assignedToESID, 0, 'associationDetails', OPENLATTICE_ID_FQN, 0]);
    const assigneeEKID = assignee.getIn([OPENLATTICE_ID_FQN, 0]);

    const formData = constructFormData({
      assignee,
      issue
    });
    const entityIndexToIdMap = constructEntityIndexToIdMap(assignedToEKID, assigneeEKID, issueEKID);

    const data = fromJS({
      assignee,
      issue,
      reporter,
      subject,
    });

    yield put(selectIssue.success(action.id, {
      data,
      formData,
      entityIndexToIdMap
    }));
  }
  catch (error) {
    LOG.error('selectIssueWorker', error);
    yield put(selectIssue.failure(action.id));
  }
}

function* selectIssueWatcher() :Generator<any, any, any> {
  yield takeEvery(SELECT_ISSUE, selectIssueWorker);
}

export {
  selectIssueWatcher,
  selectIssueWorker,
  submitIssueWatcher,
  submitIssueWorker,
};
