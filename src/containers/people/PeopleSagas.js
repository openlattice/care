/*
 * @flow
 */

import moment from 'moment';
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { Map } from 'immutable';
import {
  EntityDataModelApi,
  Constants,
  DataApi,
  SearchApi
} from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  EDIT_PERSON,
  SEARCH_PEOPLE,
  editPerson,
  searchPeople
} from './PeopleActionFactory';

import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN
} from '../../edm/DataModelFqns';

import { APP_TYPES_FQNS } from '../../shared/Consts';

const { OPENLATTICE_ID_FQN } = Constants;
const { PEOPLE_FQN } = APP_TYPES_FQNS;

const getPersonEntitySetId = (app) => {
  const selectedOrganizationId = app.get('selectedOrganizationId');

  return app.getIn([
    PEOPLE_FQN.toString(),
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);
}

function* searchPeopleWorker(action :SequenceAction) :Generator<*, *, *> {
  const { id, value } = action;
  const {
    firstName,
    lastName,
    dob,
    app
  } = value;

  try {
    yield put(searchPeople.request(id));

    const searchFields = [];
    const updateSearchField = (searchString :string, property :string, exact? :boolean) => {
      const searchTerm = exact ? `"${searchString}"` : searchString;
      searchFields.push({
        searchTerm,
        property,
        exact: true
      });
    };
    if (firstName.trim().length) {
      const firstNameId = yield call(EntityDataModelApi.getPropertyTypeId, PERSON_FIRST_NAME_FQN);
      updateSearchField(firstName.trim(), firstNameId);
    }
    if (lastName.trim().length) {
      const lastNameId = yield call(EntityDataModelApi.getPropertyTypeId, PERSON_LAST_NAME_FQN);
      updateSearchField(lastName.trim(), lastNameId);
    }
    if (dob && dob.trim().length) {
      const dobMoment = moment(dob.trim());
      if (dobMoment.isValid()) {
        const dobId = yield call(EntityDataModelApi.getPropertyTypeId, PERSON_DOB_FQN);
        updateSearchField(dobMoment.format('YYYY-MM-DD'), dobId, true);
      }
    }
    const searchOptions = {
      searchFields,
      start: 0,
      maxHits: 100
    };

    const peopleESId = getPersonEntitySetId(app);
    const response = yield call(SearchApi.advancedSearchEntitySetData, peopleESId, searchOptions);

    yield put(searchPeople.success(id, response.hits));
  }
  catch (error) {
    yield put(searchPeople.failure(id, error));
  }
  finally {
    yield put(searchPeople.finally(id));
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
    const entitySetId = getPersonEntitySetId(app);

    const { propertyTypes } = yield call(EntityDataModelApi.getEntityDataModelProjection, [{
      id: entitySetId,
      type: 'EntitySet',
      include: ['PropertyTypeInEntitySet']
    }]);

    let idsByFqn = Map();
    Object.values(propertyTypes).forEach((propertyType) => {
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
    }

    yield call(DataApi.updateEntityData, entitySetId, updates, 'Replace');
    const person = yield call(DataApi.getEntityData, entitySetId, entityKeyId)

    yield put(editPerson.success(id, { entityKeyId, person }))
  }
  catch (error) {
    yield put(editPerson.failure(id, error));
  }
  finally {
    yield put(editPerson.finally(id))
  }
}

export function* editPersonWatcher() :Generator<*, *, *> {
  yield takeEvery(EDIT_PERSON, editPersonWorker);
}
