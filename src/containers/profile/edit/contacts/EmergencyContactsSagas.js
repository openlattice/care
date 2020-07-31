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
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  DELETE_EMERGENCY_CONTACT,
  GET_EMERGENCY_CONTACTS,
  SUBMIT_EMERGENCY_CONTACTS,
  UPDATE_EMERGENCY_CONTACT,
  deleteEmergencyContact,
  getEmergencyContacts,
  submitEmergencyContacts,
  updateEmergencyContact,
} from './EmergencyContactsActions';
import { constructEntityIndexToIdMap, constructFormData } from './EmergencyContactsUtils';

import Logger from '../../../../utils/Logger';
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
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { getEntityKeyIdsFromList, removeEntitiesFromEntityIndexToIdMap } from '../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';

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

function* submitEmergencyContactsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitEmergencyContacts.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const responseData = fromJS(response.data);
    const newEntityKeyIdsByEntitySetId = responseData.get('entityKeyIds');
    const newAssociationKeyIdsByEntitySetId = responseData.get('entitySetIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const newAssociationKeyIdsByEntitySetName = newAssociationKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const contactsEKIDs = newEntityKeyIdsByEntitySetName.get(EMERGENCY_CONTACT_FQN);
    const contactInfoEKIDs = newEntityKeyIdsByEntitySetName.get(CONTACT_INFORMATION_FQN);
    const isContactForEKIDs = newAssociationKeyIdsByEntitySetName.get(IS_EMERGENCY_CONTACT_FOR_FQN);

    const newEntityIndexToIdMap = constructEntityIndexToIdMap(contactsEKIDs, isContactForEKIDs, contactInfoEKIDs);
    const entityIndexToIdMap = yield select((state) => state
      .getIn(['profile', 'emergencyContacts', 'entityIndexToIdMap']));
    const mergedEntityIndexToIdMap = entityIndexToIdMap.mergeDeep(newEntityIndexToIdMap);

    const { path, properties } = value;

    yield put(submitEmergencyContacts.success(action.id, {
      entityIndexToIdMap: mergedEntityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitEmergencyContacts.failure(action.id, error));
  }
}

function* submitEmergencyContactsWatcher() :Generator<*, *, *> {
  yield takeEvery(SUBMIT_EMERGENCY_CONTACTS, submitEmergencyContactsWorker);
}

function* getEmergencyContactsWorker(action :SequenceAction) :Generator<*, *, *> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getEmergencyContacts.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const contactedViaESID :UUID = getESIDFromApp(app, CONTACTED_VIA_FQN);
    const contactInformationESID :UUID = getESIDFromApp(app, CONTACT_INFORMATION_FQN);
    const emergencyContactESID :UUID = getESIDFromApp(app, EMERGENCY_CONTACT_FQN);
    const isEmergencyContactESID :UUID = getESIDFromApp(app, IS_EMERGENCY_CONTACT_FOR_FQN);

    const contactsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [isEmergencyContactESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [emergencyContactESID],
      }
    };

    const contactsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(contactsSearchParams)
    );

    if (contactsResponse.error) throw contactsResponse.error;
    const contactsData = fromJS(contactsResponse.data)
      .get(entityKeyId, List());

    const contacts :List<Map> = contactsData
      .map((contact) => contact.get('neighborDetails', Map()));

    const contactsEKIDs = getEntityKeyIdsFromList(contacts);

    let contactInfo = Map();
    if (!contactsEKIDs.isEmpty()) {
      const contactInfoSearchParams = {
        entitySetId: emergencyContactESID,
        filter: {
          entityKeyIds: contactsEKIDs.toJS(),
          edgeEntitySetIds: [contactedViaESID],
          destinationEntitySetIds: [contactInformationESID],
          sourceEntitySetIds: []
        }
      };

      const contactInfoResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(contactInfoSearchParams)
      );

      if (contactInfoResponse.error) throw contactInfoResponse.error;
      contactInfo = fromJS(contactInfoResponse.data);
    }

    const contactInfoByContactEKID = contactInfo
      .map((infos :List, contactEKID :UUID) => {
        if (infos.count() > 1) {
          LOG.warn('more than one contact info found', contactEKID);
        }
        const info = infos.first() || Map();
        return info.get('neighborDetails', Map());
      });

    const contactInfoEKIDs :List<UUID> = contactsEKIDs
      .map((contactEKID) => contactInfoByContactEKID.getIn([contactEKID, OPENLATTICE_ID_FQN, 0]));

    const isContactForList :List<Map> = contactsData
      .map((contact) => contact.get('associationDetails', Map()));

    const isContactForByContactEKID = Map(contactsEKIDs.zip(isContactForList));

    const isContactForEKIDs = getEntityKeyIdsFromList(isContactForList);

    const formData = constructFormData(contacts, isContactForList, contactInfoByContactEKID);
    const entityIndexToIdMap = constructEntityIndexToIdMap(
      contactsEKIDs,
      isContactForEKIDs,
      contactInfoEKIDs
    );

    yield put(getEmergencyContacts.success(action.id, {
      entityIndexToIdMap,
      formData,
      data: fromJS({
        contactInfoByContactEKID,
        contacts,
        isContactForByContactEKID,
      })
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getEmergencyContacts.failure(action.id, error));
  }

  return response;
}

function* getEmergencyContactsWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_EMERGENCY_CONTACTS, getEmergencyContactsWorker);
}

function* updateEmergencyContactWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateEmergencyContact.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateEmergencyContact.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateEmergencyContact.failure(action.id, error));
  }
}

function* updateEmergencyContactWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_EMERGENCY_CONTACT, updateEmergencyContactWorker);
}

function* deleteEmergencyContactWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteEmergencyContact.request(action.id));
    const { entityData, path } = value;
    const response = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(entityData));

    if (response.error) throw response.error;

    const entityIndexToIdMap = yield select((state) => state
      .getIn(['profile', 'emergencyContacts', 'entityIndexToIdMap']));
    const newEntityIndexToIdMap = removeEntitiesFromEntityIndexToIdMap(entityData, entityIndexToIdMap);

    yield put(deleteEmergencyContact.success(action.id, { path, entityIndexToIdMap: newEntityIndexToIdMap }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(deleteEmergencyContact.failure(action.id, error));
  }
}

function* deleteEmergencyContactWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_EMERGENCY_CONTACT, deleteEmergencyContactWorker);
}

export {
  deleteEmergencyContactWatcher,
  deleteEmergencyContactWorker,
  getEmergencyContactsWatcher,
  getEmergencyContactsWorker,
  submitEmergencyContactsWatcher,
  submitEmergencyContactsWorker,
  updateEmergencyContactWatcher,
  updateEmergencyContactWorker,
};
