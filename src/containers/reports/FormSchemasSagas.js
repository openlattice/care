import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn,
} from 'immutable';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import { LangUtils, Logger } from 'lattice-utils';
// @flow
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_FORM_SCHEMA,
  SUBMIT_FORM_SCHEMA,
  getFormSchema,
  submitFormSchema,
} from './FormSchemasActions';

import * as FQN from '../../edm/DataModelFqns';
import { selectEntitySetId, selectPropertyTypeId } from '../../core/redux/selectors';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { isEmptyString } = LangUtils;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;

const { createOrMergeEntityData } = DataApiActions;
const { createOrMergeEntityDataWorker } = DataApiSagas;
const { FORMS_FQN } = APP_TYPES_FQNS;

const LOG = new Logger('FormSchemasSagas');

function* getFormSchemaWorker(action :SequenceAction) :Saga<WorkerResponse> {
  const response :Object = {};
  try {
    const { value } = action;
    if (isEmptyString(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getFormSchema.request(action.id, value));

    const formESID :Map = yield select(selectEntitySetId(FORMS_FQN));
    const typePTID :Map = yield select(selectPropertyTypeId(FQN.TYPE_FQN));

    const searchConstraints = {
      entitySetIds: [formESID],
      start: 0,
      maxHits: 10000,
      constraints: [{
        constraints: [{
          type: 'advanced',
          searchFields: [
            {
              searchTerm: value,
              property: typePTID,
              exact: true
            }
          ]
        }]
      }],
    };

    const searchResponse :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (searchResponse.error) throw searchResponse.error;

    // use most recent schema if multiple
    const { hits } = searchResponse.data;
    if (hits > 1) {
      LOG.warn(action.type, 'more than one form schema found');
    }

    const sortedForms = hits.sort((formA, formB) => {
      const timeA = getIn(formA, [FQN.DATE_TIME_FQN, 0]);
      const timeB = getIn(formB, [FQN.DATE_TIME_FQN, 0]);

      const dateTimeA = DateTime.fromISO(timeA);
      const dateTimeB = DateTime.fromISO(timeB);
      return dateTimeB - dateTimeA;
    });

    const recentForm = sortedForms[0];

    const jsonSchema = getIn(recentForm, [FQN.JSON_SCHEMA_FQN, 0]);
    const parsedSchemas = jsonSchema ? JSON.parse(jsonSchema) : undefined;
    response.data = parsedSchemas;

    yield put(getFormSchema.success(action.id, {
      type: value,
      schemas: fromJS(parsedSchemas)
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getFormSchema.failure(action.id, error));
  }
  finally {
    yield put(getFormSchema.finally(action.id));
  }
  return response;
}

function* getFormSchemaWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_FORM_SCHEMA, getFormSchemaWorker);
}

function* submitFormSchemaWorker(action :SequenceAction) :Saga<WorkerResponse> {
  const response = {};
  try {
    const { jsonSchemas, name, type } = action.value;
    if (isEmptyString(name)) throw ERR_ACTION_VALUE_TYPE;
    if (isEmptyString(type)) throw ERR_ACTION_VALUE_TYPE;
    if (!(jsonSchemas.schemas && jsonSchemas.uiSchemas)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitFormSchema.request(action.id));

    const formESID = yield select(selectEntitySetId(FORMS_FQN));
    const dateTimePTID = yield select(selectPropertyTypeId(FQN.DATE_TIME_FQN));
    const jsonSchemaPTID = yield select(selectPropertyTypeId(FQN.JSON_SCHEMA_FQN));
    const namePTID = yield select(selectPropertyTypeId(FQN.NAME_FQN));
    const typePTID = yield select(selectPropertyTypeId(FQN.TYPE_FQN));

    const entity = {
      [dateTimePTID]: [DateTime.local().toISO()],
      [jsonSchemaPTID]: [JSON.stringify(jsonSchemas)],
      [namePTID]: [name],
      [typePTID]: [type],
    };

    const createFormResponse = yield call(
      createOrMergeEntityDataWorker,
      createOrMergeEntityData({
        entitySetId: formESID,
        entityData: [entity]
      })
    );

    if (createFormResponse.error) throw createFormResponse.error;

    yield put(submitFormSchema.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(submitFormSchema.failure(action.id));
  }
  finally {
    yield put(submitFormSchema.finally(action.id));

  }
  return response;
}

function* submitFormSchemaWatcher() :Saga<void> {
  yield takeEvery(SUBMIT_FORM_SCHEMA, submitFormSchemaWorker);
}

export {
  getFormSchemaWatcher,
  getFormSchemaWorker,
  submitFormSchemaWatcher,
  submitFormSchemaWorker,
};
