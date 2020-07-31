// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import * as FQN from '../../../../../edm/DataModelFqns';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { getESIDFromApp } from '../../../../../utils/AppUtils';
import { getFormDataFromEntity } from '../../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import {
  GET_CONTACT,
  SUBMIT_CONTACT,
  UPDATE_CONTACT,
  getContact,
  submitContact,
  updateContact,
} from '../actions/ContactActions';

const LOG = new Logger('BasicInformationSagas');

const { isDefined } = LangUtils;
const { getPageSectionKey } = DataProcessingUtils;
const { isValidUUID } = ValidationUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  CONTACTED_VIA_FQN,
  PEOPLE_FQN,
  CONTACT_INFORMATION_FQN,
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getContactWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getContact.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const contactInformationESID :UUID = getESIDFromApp(app, CONTACT_INFORMATION_FQN);
    const contactedViaESID :UUID = getESIDFromApp(app, CONTACTED_VIA_FQN);

    const contactSearchParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [contactedViaESID],
        destinationEntitySetIds: [contactInformationESID],
        sourceEntitySetIds: [],
      }
    };

    const contactRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(contactSearchParams)
    );

    if (contactRequest.error) throw contactRequest.error;
    const contactDataList = fromJS(contactRequest.data).get(entityKeyId, List());
    if (contactDataList.count() > 1) {
      LOG.warn('more than one contact found in person', entityKeyId);
    }

    const contactData = contactDataList
      .getIn([0, 'neighborDetails'], Map());

    if (!contactData.isEmpty()) {

      const contactProperties = [
        FQN.CONTACT_PHONE_NUMBER_FQN,
        FQN.EXTENTION_FQN,
        FQN.TYPE_FQN,
      ];

      const contactEKID = contactData.getIn([OPENLATTICE_ID_FQN, 0]);

      const locationFormData = getFormDataFromEntity(
        contactData,
        CONTACT_INFORMATION_FQN,
        contactProperties,
        0
      );
      response.entityIndexToIdMap = Map().setIn([CONTACT_INFORMATION_FQN, 0], contactEKID);
      response.formData = Map().set(getPageSectionKey(1, 1), locationFormData);
    }

    response.data = contactData;

    yield put(getContact.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getContact.failure(action.id, error));
  }

  return response;
}

function* getContactWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_CONTACT, getContactWorker);
}

function* submitContactWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitContact.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const contactEKID = newEntityKeyIdsByEntitySetName.getIn([CONTACT_INFORMATION_FQN, 0]);

    const entityIndexToIdMap = Map().setIn([CONTACT_INFORMATION_FQN.toString(), 0], contactEKID);

    const { path, properties } = value;

    yield put(submitContact.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitContact.failure(action.id, error));
  }
}

function* submitContactWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_CONTACT, submitContactWorker);
}

function* updateContactWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateContact.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateContact.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateContact.failure(action.id, error));
  }
}

function* updateContactWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_CONTACT, updateContactWorker);
}

export {
  getContactWatcher,
  getContactWorker,
  submitContactWatcher,
  submitContactWorker,
  updateContactWatcher,
  updateContactWorker,
};
