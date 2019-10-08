// @flow

import { fromJS } from 'immutable';
import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';

import {
  PrincipalsApiActions,
  PrincipalsApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { GET_AUTHORIZATION, getAuthorization } from './AuthorizeActions';

const { getCurrentRolesWorker } = PrincipalsApiSagas;
const { getCurrentRoles } = PrincipalsApiActions;

function* getAuthorizationWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(getAuthorization.request(action.id));

    const currentRolesResponse = yield call(getCurrentRolesWorker, getCurrentRoles());
    if (currentRolesResponse.error) throw currentRolesResponse.error;

    const currentRoles = fromJS(currentRolesResponse.data);
    
    const selectedOrganizationID :UUID = yield select(state => state.getIn(['app', 'selectedOrganizationId']));
    const rolesByOrganization = currentRoles.filter(role => role.get('organizationId') === selectedOrganizationID);
    const principalIds = rolesByOrganization.map(role => role.getIn(['principal', 'id']));
    yield put(getAuthorization.success(action.id, principalIds));
  }
  catch (error) {
    yield put(getAuthorization.finally(action.id));
  }
  return response;
}

function* getAuthorizationWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_AUTHORIZATION, getAuthorizationWorker);
}

export {
  getAuthorizationWatcher,
  getAuthorizationWorker,
};
