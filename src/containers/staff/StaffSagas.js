/*
 * @flow
 */

import { Map } from 'immutable';
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Constants, DataApi } from 'lattice';
import { AuthUtils } from 'lattice-auth';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActionFactory,
  SearchApiSagas
} from 'lattice-sagas';

import Logger from '../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_WORKER_SAGA } from '../../utils/Errors';

import {
  ADD_NEW_STAFF_MEMBER,
  GET_CURRENT_USER_STAFF_MEMBER_DATA,
  addNewStaffMember,
  getCurrentUserStaffMemberData,
} from './StaffActions';
import { getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';
import * as FQN from '../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;


const LOG = new Logger('StaffSagas');

const { searchEntitySetData } = SearchApiActionFactory;
const { searchEntitySetDataWorker } = SearchApiSagas;

const { createOrMergeEntityData } = DataApiActions;
const { createOrMergeEntityDataWorker } = DataApiSagas;

/*
 *
 * StaffSagas.addNewStaffMember()
 *
 */

function* addNewStaffMemberWorker(action :SequenceAction) :Generator<*, *, *> {

  const staffMemberDataByPtId :Object = {};
  const staffMemberDataByFQN :Object = {};

  try {

    const { value } = action;
    if (value === null || value === undefined) {
      throw ERR_ACTION_VALUE_NOT_DEFINED;
    }

    yield put(addNewStaffMember.request(action.id));

    const app = yield select(state => state.get('app', Map()));
    const staffESId :UUID = getStaffESId(app);
    const personIdPTId :UUID = yield select(state => state.getIn(['edm', 'fqnToIdMap', FQN.PERSON_ID_FQN]));

    staffMemberDataByPtId[personIdPTId] = [value.email];

    const response = yield call(
      createOrMergeEntityDataWorker,
      createOrMergeEntityData(staffESId, [staffMemberDataByPtId])
    );
    if (response.error) throw response.error;

    staffMemberDataByFQN[FQN.PERSON_ID_FQN] = [value.email];
    staffMemberDataByFQN[OPENLATTICE_ID_FQN] = response;

    yield put(addNewStaffMember.success(action.id, staffMemberDataByFQN));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    yield put(addNewStaffMember.failure(action.id, error));
  }
  finally {
    yield put(addNewStaffMember.finally(action.id));
  }

  return staffMemberDataByFQN;
}

function* addNewStaffMemberWatcher() :Generator<*, *, *> {

  yield takeEvery(ADD_NEW_STAFF_MEMBER, addNewStaffMemberWorker);
}

/*
 *
 * StaffSagas.getCurrentUserStaffMemberData()
 *
 */

function* getCurrentUserStaffMemberDataWorker(action :SequenceAction) :Generator<*, *, *> {

  try {

    const { value } = action;
    if (value === null || value === undefined) {
      throw ERR_ACTION_VALUE_NOT_DEFINED;
    }

    yield put(getCurrentUserStaffMemberData.request(action.id));

    let response :Object = {};
    let userData :?Object;
    const userInfo :Object = AuthUtils.getUserInfo();

    const app = yield select(state => state.get('app', Map()));
    const entitySetId :UUID = getStaffESId(app);
    const personIdPTId :UUID = yield select(state => state.getIn(['edm', 'fqnToIdMap', FQN.PERSON_ID_FQN]));
    const searchOptions :Object = {
      maxHits: 1,
      searchTerm: getSearchTerm(personIdPTId, userInfo.email),
      start: 0,
    };

    response = yield call(searchEntitySetDataWorker, searchEntitySetData({ entitySetId, searchOptions }));
    if (response.error) throw response.error;

    const { data: { hits: [searchResult = undefined] = [] } = {} } = response;
    if (!searchResult) {
      // current user is not a member of the staff entity set. try adding.
      if (value.createIfNotExists) {
        userData = yield call(addNewStaffMemberWorker, addNewStaffMember(userInfo));
        // TODO: retry / schedule another search in the future
      }
    }
    else {
      userData = searchResult;
    }

    yield put(getCurrentUserStaffMemberData.success(action.id, userData));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    yield put(getCurrentUserStaffMemberData.failure(action.id, error));
  }
  finally {
    yield put(getCurrentUserStaffMemberData.finally(action.id));
  }
}

function* getCurrentUserStaffMemberDataWatcher() :Generator<*, *, *> {

  yield takeEvery(GET_CURRENT_USER_STAFF_MEMBER_DATA, getCurrentUserStaffMemberDataWorker);
}

export {
  addNewStaffMemberWatcher,
  addNewStaffMemberWorker,
  getCurrentUserStaffMemberDataWatcher,
  getCurrentUserStaffMemberDataWorker,
};
