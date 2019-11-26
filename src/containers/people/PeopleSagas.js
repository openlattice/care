/*
 * @flow
 */

import { DateTime } from 'luxon';
import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS
} from 'immutable';
import {
  EntityDataModelApi,
  Constants,
  DataApi,
} from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';


import * as FQN from '../../edm/DataModelFqns';
import Logger from '../../utils/Logger';
import {
  EDIT_PERSON,
  GET_PEOPLE_PHOTOS,
  SEARCH_PEOPLE,
  editPerson,
  getPeoplePhotos,
  searchPeople,
} from './PeopleActions';
import {
  getPeopleESId,
  getESIDFromApp,
} from '../../utils/AppUtils';
import { isDefined } from '../../utils/LangUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { APP_TYPES_FQNS } from '../../shared/Consts';

const {
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const LOG = new Logger('PeopleSagas');


export function* getPeoplePhotosWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value: entityKeyIds } = action;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getPeoplePhotos.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const imageESID :UUID = getESIDFromApp(app, IMAGE_FQN);
    const isPictureOfESID :UUID = getESIDFromApp(app, IS_PICTURE_OF_FQN);

    const imageSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds: [isPictureOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [imageESID]
      }
    };

    const imageResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(imageSearchParams)
    );

    const profilePicByEKID = fromJS(imageResponse.data)
      .map((entity) => entity.first().get('neighborDetails'));

    yield put(getPeoplePhotos.success(action.id, profilePicByEKID));
  }
  catch (error) {
    yield put(getPeoplePhotos.failure(action.id));
  }
}

export function* getPeoplePhotosWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_PEOPLE_PHOTOS, getPeoplePhotosWorker);
}

function* searchPeopleWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!Map.isMap(value)) throw ERR_ACTION_VALUE_TYPE;

    yield put(searchPeople.request(action.id));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);
    const dobPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_DOB_FQN]);

    const searchFields = [];
    const updateSearchField = (searchTerm :string, property :string) => {
      searchFields.push({
        searchTerm,
        property,
        exact: true
      });
    };

    const firstName :string = value.get('firstName', '').trim();
    const lastName :string = value.get('lastName', '').trim();
    const dob :string = value.get('dob');

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID);
    }
    const dobDT = DateTime.fromISO(dob);
    if (dobDT.isValid) {
      updateSearchField(dobDT.toISODate(), dobPTID);
    }

    const searchOptions = {
      searchFields,
      start: 0,
      maxHits: 10000
    };

    const entitySetId = getPeopleESId(app);

    const { data, error } = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId,
        searchOptions
      })
    );

    if (error) throw error;

    const hits = fromJS(data.hits)
      .sortBy((entity) => entity.getIn([FQN.PERSON_LAST_NAME_FQN]));

    const peopleEKIDs = hits.map((person) => person.getIn([OPENLATTICE_ID_FQN, 0]));

    yield put(searchPeople.success(action.id, hits));
    yield call(getPeoplePhotosWorker, getPeoplePhotos(peopleEKIDs));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchPeople.failure(action.id, error));
  }
}

export function* searchPeopleWatcher() :Generator<*, *, *> {
  yield takeEvery(SEARCH_PEOPLE, searchPeopleWorker);
}

function* editPersonWorker(action :SequenceAction) :Generator<*, *, *> {
  const { id, value } = action;

  const { app, entity } = value;
  try {
    yield put(editPerson.request(id));
    const entityKeyId = entity.getIn([OPENLATTICE_ID_FQN, 0], '');
    const entitySetId = getPeopleESId(app);

    const { propertyTypes } = yield call(EntityDataModelApi.getEntityDataModelProjection, [{
      id: entitySetId,
      type: 'EntitySet',
      include: ['PropertyTypeInEntitySet']
    }]);

    let idsByFqn = Map();
    Object.values(propertyTypes).forEach((propertyType :any) => {
      const { namespace, name } = propertyType.type;
      idsByFqn = idsByFqn.set(`${namespace}.${name}`, propertyType.id);
    });

    let entityWithIds = Map();
    entity.entrySeq().forEach(([fqn, values]) => {
      const ptId = idsByFqn.get(fqn);
      if (ptId) {
        entityWithIds = entityWithIds.set(ptId, values);
      }
    });

    const updates = {
      [entityKeyId]: entityWithIds.toJS()
    };

    yield call(DataApi.updateEntityData, entitySetId, updates, 'Replace');
    const person = yield call(DataApi.getEntityData, entitySetId, entityKeyId);

    yield put(editPerson.success(id, { entityKeyId, person }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(editPerson.failure(id, error));
  }
  finally {
    yield put(editPerson.finally(id));
  }
}

export function* editPersonWatcher() :Generator<*, *, *> {
  yield takeEvery(EDIT_PERSON, editPersonWorker);
}
