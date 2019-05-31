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
  OrderedMap,
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
  SEARCH_PEOPLE,
  editPerson,
  searchPeople
} from './PeopleActions';
import {
  getPeopleESId,
} from '../../utils/AppUtils';
import { isDefined } from '../../utils/LangUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;
const LOG = new Logger('PeopleSagas');

function* searchPeopleWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!Map.isMap(value)) throw ERR_ACTION_VALUE_TYPE;

    yield put(searchPeople.request(action.id));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const app = yield select(state => state.get('app', Map()));

    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);
    const dobPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_DOB_FQN]);

    const searchFields = [];
    const updateSearchField = (searchString :string, property :string, exact? :boolean) => {
      const searchTerm = exact ? `"${searchString}"` : searchString;
      searchFields.push({
        searchTerm,
        property,
        exact
      });
    };

    const firstName :string = value.get('firstName', '').trim();
    const lastName :string = value.get('lastName', '').trim();
    const dob :string = value.get('dob', '').trim();

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID);
    }
    if (dob.length) {
      const dobDT = DateTime.fromISO(dob);
      if (dobDT.isValid) {
        updateSearchField(dobDT.toISODate(), dobPTID, true);
      }
    }

    const searchOptions = {
      searchFields,
      start: 0,
      maxHits: 100
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

    const hits = fromJS(data.hits);
    const result :List<OrderedMap> = hits.map((person :Map) => {
      const rawDob :string = person.getIn([FQN.PERSON_DOB_FQN, 0], '');
      let formattedDob = '';
      if (rawDob) {
        formattedDob = DateTime.fromISO(
          rawDob
        ).toLocaleString(DateTime.DATE_SHORT);
      }

      return person.set(FQN.DOB_FQN, List([formattedDob]));
    });

    yield put(searchPeople.success(action.id, result));
  }
  catch (error) {
    LOG.error(error);
    yield put(searchPeople.failure(action.id, error));
  }
  finally {
    yield put(searchPeople.finally(action.id));
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
    };

    yield call(DataApi.updateEntityData, entitySetId, updates, 'Replace');
    const person = yield call(DataApi.getEntityData, entitySetId, entityKeyId);

    yield put(editPerson.success(id, { entityKeyId, person }));
  }
  catch (error) {
    yield put(editPerson.failure(id, error));
  }
  finally {
    yield put(editPerson.finally(id));
  }
}

export function* editPersonWatcher() :Generator<*, *, *> {
  yield takeEvery(EDIT_PERSON, editPersonWorker);
}
