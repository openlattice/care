// @flow
import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PROFILE_DOCUMENTS,
  getProfileDocuments,
} from './ProfileDocumentsActions';

import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';

const LOG = new Logger('DocumentsSagas');

const { isValidUUID } = ValidationUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  FILE_FQN,
  INCLUDES_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

function* getProfileDocumentsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: personEKID } = action;
    if (!isValidUUID(personEKID)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileDocuments.request(action.id));
    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const fileESID :UUID = getESIDFromApp(app, FILE_FQN);
    const includesESID :UUID = getESIDFromApp(app, INCLUDES_FQN);

    const filesSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [personEKID],
        edgeEntitySetIds: [includesESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [fileESID]
      }
    };

    const filesResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(filesSearchParams)
    );
    if (filesResponse.error) throw filesResponse.error;
    const fileData = fromJS(filesResponse.data)
      .get(personEKID, List())
      .map((file) => file.get('neighborDetails'));

    response.data = fileData;

    yield put(getProfileDocuments.success(action.id, {
      data: fileData
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getProfileDocuments.failure(action.id));
  }
  return response;
}

function* getProfileDocumentsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PROFILE_DOCUMENTS, getProfileDocumentsWorker);
}

export {
  getProfileDocumentsWorker,
  getProfileDocumentsWatcher,
};
