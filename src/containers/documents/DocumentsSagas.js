/*
 * @flow
 */

import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  OrderedSet,
  Set,
  fromJS,
} from 'immutable';
import { Constants, DataApi } from 'lattice';
import { Logger } from 'lattice-utils';
import type { SequenceAction } from 'redux-reqseq';

import { getFilesESId } from '../../utils/AppUtils';
import {
  LOAD_USED_TAGS,
  UPLOAD_DOCUMENTS,
  loadUsedTags,
  uploadDocuments,
} from './DocumentsActionFactory';
import {
  FILE_DATA_FQN,
  FILE_TAG_FQN,
  FILE_TEXT_FQN,
  NAME_FQN,
  TYPE_FQN
} from '../../edm/DataModelFqns';


const { OPENLATTICE_ID_FQN } = Constants;
const BASE_64_SUBSTR = ';base64,';

const LOG = new Logger('DocumentsSagas');

function* loadUsedTagsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(loadUsedTags.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    // const filesEntitySetId = getFilesESId(app);
    const filesEntitySetId = "8a5f923c-2193-40a3-9d23-d6f3da4d433a"; // // TODO
    const tagPropertyTypeId = propertyTypeIds.get(FILE_TAG_FQN, 'f2dbdc90-bf80-43d4-b015-196864ac4045');

    const entityTags = yield call(DataApi.getEntitySetData, filesEntitySetId, [tagPropertyTypeId]);
    let allTags = Set();
    entityTags.forEach((entity) => {
      const { [FILE_TAG_FQN]: values } = entity;
      if (values && values.length) {
        values.forEach((tagValue) => {
          allTags = allTags.add(tagValue);
        });
      }
    });

    yield put(loadUsedTags.success(action.id, allTags));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(loadUsedTags.failure(action.id, { error }));
  }
  finally {
    yield put(loadUsedTags.finally(action.id));
  }
}

function* loadUsedTagsWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_USED_TAGS, loadUsedTagsWorker);
}

const cleanBase64ForUpload = (base64String) => {
  const splitPoint = base64String.indexOf(BASE_64_SUBSTR);
  if (splitPoint < 0) {
    return base64String;
  }
  return base64String.substring(splitPoint + BASE_64_SUBSTR.length);
};

function* uploadDocumentsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(uploadDocuments.request(action.id));

    const { files } = action.value;

    const app = yield select((state) => state.get('app', Map()));
    const propertyTypeIds = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    // const filesEntitySetId = getFilesESId(app);
    const filesEntitySetId = "8a5f923c-2193-40a3-9d23-d6f3da4d433a"; // // TODO
    const tagPropertyTypeId = propertyTypeIds.get(FILE_TAG_FQN, 'f2dbdc90-bf80-43d4-b015-196864ac4045');
    const namePropertyTypeId = propertyTypeIds.get(NAME_FQN, 'f2dbdc90-bf80-43d4-b015-196864ac4045');
    const typePropertyTypeId = propertyTypeIds.get(TYPE_FQN, 'f2dbdc90-bf80-43d4-b015-196864ac4045');
    const fileDataPropertyTypeId = propertyTypeIds.get(FILE_DATA_FQN, '5364cb1b-ecf4-459d-b8d4-99b47b31281c');
    const fileTextPropertyTypeId = propertyTypeIds.get(FILE_TEXT_FQN, '5364cb1b-ecf4-459d-b8d4-99b47b31281c');

    const entities = files.map(({
      name,
      type,
      base64
    }) => ({
      [tagPropertyTypeId]: [type],
      [typePropertyTypeId]: [type],
      [namePropertyTypeId]: [name],
      [fileDataPropertyTypeId]: [{
        'content-type': type,
        data: cleanBase64ForUpload(base64)
      }]
    }));

    yield call(DataApi.createOrMergeEntityData, filesEntitySetId, entities);

    yield put(uploadDocuments.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(uploadDocuments.failure(action.id, { error }));
  }
  finally {
    yield put(uploadDocuments.finally(action.id));
  }
}

function* uploadDocumentsWatcher() :Generator<*, *, *> {
  yield takeEvery(UPLOAD_DOCUMENTS, uploadDocumentsWorker);
}

export {
  loadUsedTagsWatcher,
  loadUsedTagsWorker,
  uploadDocumentsWatcher,
  uploadDocumentsWorker,
};
