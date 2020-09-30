/*
 * @flow
 */

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map } from 'immutable';
import { Models, Types } from 'lattice';
import {
  EntitySetsApiActions,
  EntitySetsApiSagas,
  PermissionsApiActions,
  PermissionsApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  REFRESH_PERMISSIONS,
  refreshPermissions,
} from './PermissionsActions';
import { getAclUpdates } from './PermissionsUtils';

import {
  ERR_ACTION_VALUE_TYPE,
} from '../../../utils/Errors';

const { isValidUUID } = ValidationUtils;

const { getPropertyTypeMetaDataForEntitySets } = EntitySetsApiActions;
const { getPropertyTypeMetaDataForEntitySetsWorker } = EntitySetsApiSagas;

const { updateAcls } = PermissionsApiActions;
const { updateAclsWorker } = PermissionsApiSagas;

const LOG = new Logger('PermissionsSagas');

function* refreshPermissionsWorker(action :SequenceAction) :Saga<null> {
  try {
    yield put(refreshPermissions.request(action.id));
    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));

    const roles = yield select((state) => state.getIn(['app', 'app', 'roles'], List()));
    const orgId = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));

    console.log(roles);
    const entitySetIds = [];
    selectedOrgEntitySetIds.forEach((entitySetId) => {
      entitySetIds.push(entitySetId);
    });
    const metadataResponse = yield call(
      getPropertyTypeMetaDataForEntitySetsWorker,
      getPropertyTypeMetaDataForEntitySets(entitySetIds)
    );
    if (metadataResponse.error) throw metadataResponse.error;

    const aclUpdates = getAclUpdates(metadataResponse.data, orgId);
    console.log(aclUpdates);
    debugger;

    const updateAclsResponse = yield call(updateAclsWorker, updateAcls(aclUpdates));
    if (updateAclsResponse.error) throw updateAclsResponse.error;

    yield put(refreshPermissions.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(refreshPermissions.failure(action.id, error));
  }
}

function* refreshPermissionsWatcher() {
  yield takeEvery(REFRESH_PERMISSIONS, refreshPermissionsWorker);
}

export {
  refreshPermissionsWatcher,
  refreshPermissionsWorker,
};
