// @flow
import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn,
} from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { LangUtils, Logger } from 'lattice-utils';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_FORM_SCHEMA,
  getFormSchema,
} from './FormSchemasActions';

import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp } from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { isEmptyString } = LangUtils;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;
const { FORMS_FQN } = APP_TYPES_FQNS;

const LOG = new Logger('FormSchemasSagas');

function* getFormSchemaWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {};
  try {
    const { value } = action;
    if (isEmptyString(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getFormSchema.request(action.id, value));

    const edm :Map = yield select((state) => state.get('edm'));
    const app :Map = yield select((state) => state.get('app', Map()));
    const formESID = getESIDFromApp(app, FORMS_FQN);
    const typePTID = edm.getIn(['fqnToIdMap', FQN.TYPE_FQN]);

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
    const form = searchResponse.data.hits[0];
    if (searchResponse.data.hits.length > 1) {
      LOG.warn(action.type, 'more than one form schema found');
    }

    const jsonSchema = getIn(form, [FQN.JSON_SCHEMA_FQN, 0]);
    const parsedSchemas = jsonSchema ? JSON.parse(jsonSchema) : undefined;
    response.data = parsedSchemas;

    yield put(getFormSchema.success(action.id, {
      type: value,
      schemas: fromJS(parsedSchemas)
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getFormSchema.failure(action.id, error));
  }
  return response;
}

function* getFormSchemaWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_FORM_SCHEMA, getFormSchemaWorker);
}

export {
  getFormSchemaWatcher,
  getFormSchemaWorker,
};
