// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../utils/Logger';
import {
  DELETE_CONTACT,
  GET_CONTACTS,
  SUBMIT_CONTACTS,
  UPDATE_CONTACT,
  deleteContact,
  getContacts,
  submitContacts,
  updateContact,
} from './ContactsActions';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';
import {
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  deleteBulkEntitiesWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  PEOPLE_FQN,
  CONTACTED_VIA_FQN,
  CONTACT_INFORMATION_FQN,
  EMERGENCY_CONTACT_FQN,
  IS_EMERGENCY_CONTACT_FOR_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ProfileSagas');

function* submitContactsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitContacts.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    // TODO: create entityIndexToIdMap for submitted data.

    const { path, properties } = value;

    yield put(submitContacts.success(action.id, {
      entityIndexToIdMap: newEntityIndexToIdMap,
      path,
      properties: fromJS(properties)
    }));
  }
  catch (error) {
    LOG.error('submitContactsWorker', error);
    yield put(submitContacts.failure(action.id, error));
  }
  finally {
    yield put(submitContacts.finally(action.id));
  }
}

function* submitContactsWatcher() :Generator<*, *, *> {
  yield takeEvery(SUBMIT_CONTACTS, submitContactsWorker);
}

function* getContactsWorker(action :SequenceAction) :Generator<*, *, *> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getContacts.request(action.id));

    // TODO: Get Emergency contact -> is emergency contact for -> person
    //           Emergency contact -> contacted via -> contact information

    yield put(getContacts.success(action.id, {
      entityIndexToIdMap,
      formData,
      data
    }));
  }
  catch (error) {
    LOG.error('getContactsWorker', error);
    response.error = error;
    yield put(getContacts.failure(action.id, error));
  }
  finally {
    yield put(getContacts.finally(action.id));
  }

  return response;
}

function* getContactsWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_CONTACTS, getContactsWorker);
}

function* updateContactWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateContact.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateContact.success(action.id));
  }
  catch (error) {
    LOG.error('updateContactWorker', error);
    yield put(updateContact.failure(action.id, error));
  }
  finally {
    yield put(updateContact.finally(action.id));
  }
}

function* updateContactWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_CONTACT, updateContactWorker);
}

function* deleteContactWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteContact.request(action.id));
    const { entityData, path } = value;
    const response = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(entityData));

    if (response.error) throw response.error;

    yield put(deleteContact.success(action.id, { path }));
  }
  catch (error) {
    LOG.error('deleteInteraionStrategiesWorker', error);
    yield put(deleteContact.failure(action.id, error));
  }
  finally {
    yield put(deleteContact.finally(action.id));
  }
}

function* deleteContactWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_CONTACT, deleteContactWorker);
}

export {
  deleteContactWatcher,
  deleteContactWorker,
  getContactsWatcher,
  getContactsWorker,
  submitContactsWatcher,
  submitContactsWorker,
  updateContactWatcher,
  updateContactWorker,
};
