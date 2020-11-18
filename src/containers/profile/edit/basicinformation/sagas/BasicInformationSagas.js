// @flow
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { SequenceAction } from 'redux-reqseq';

import { getAddressWorker } from './AddressSagas';
import { getAppearanceWorker } from './AppearanceSagas';
import { getContactWorker } from './ContactSagas';
import { getPhotosWorker } from './PhotosSagas';
import { getScarsMarksTattoosWorker } from './ScarsMarksTattoosSagas';

import { submitPartialReplace } from '../../../../../core/sagas/data/DataActions';
import { submitPartialReplaceWorker } from '../../../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { getESIDsFromApp } from '../../../../../utils/AppUtils';
import { groupNeighborsByFQNs } from '../../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import {
  constructFormDataFromNeighbors,
  getEntityIndexToIdMapFromNeighbors
} from '../../../../reports/crisis/CrisisReportUtils';
import { getAddress } from '../actions/AddressActions';
import {
  GET_BASICS,
  GET_BASIC_INFORMATION,
  UPDATE_BASICS,
  getAppearance,
  getBasicInformation,
  getBasics,
  updateBasics
} from '../actions/BasicInformationActions';
import { getContact } from '../actions/ContactActions';
import { getPhotos } from '../actions/PhotosActions';
import { getScarsMarksTattoos } from '../actions/ScarsMarksTattoosActions';
import { schema } from '../schemas/BasicInformationSchemas';

const LOG = new Logger('BasicInformationSagas');

const { isDefined } = LangUtils;
const { isValidUUID } = ValidationUtils;
const { PEOPLE_FQN, PERSON_DETAILS_FQN, REPORTED_FQN } = APP_TYPES_FQNS;

const { getEntityData } = DataApiActions;
const { getEntityDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getBasicsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getBasics.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      personDetailsESID,
      reportedESID,
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      PERSON_DETAILS_FQN,
      REPORTED_FQN,
    ]);

    const personRequest = call(
      getEntityDataWorker,
      getEntityData({
        entitySetId: peopleESID,
        entityKeyId
      })
    );

    const neighborsRequest = call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: peopleESID,
        filter: {
          entityKeyIds: [entityKeyId],
          edgeEntitySetIds: [reportedESID],
          destinationEntitySetIds: [personDetailsESID],
          sourceEntitySetIds: [],
        },
      })
    );

    const [
      neighborsResponse,
      personResponse,
    ] = yield all([
      neighborsRequest,
      personRequest
    ]);

    if (personResponse.error) throw personResponse.error;
    if (neighborsResponse.error) throw neighborsResponse.error;

    const neighbors = fromJS(neighborsResponse.data).get(entityKeyId);
    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());
    const personData = fromJS(personResponse.data);
    const personEntity = fromJS({ neighborDetails: personResponse.data });
    const dataByFQN = groupNeighborsByFQNs(neighbors, appTypeFqnsByIds)
      .set(PEOPLE_FQN, List([personEntity]));

    const formData = fromJS(constructFormDataFromNeighbors(dataByFQN, schema));
    const entityIndexToIdMap = getEntityIndexToIdMapFromNeighbors(dataByFQN, schema);

    if (!personData.isEmpty()) {
      response.entityIndexToIdMap = entityIndexToIdMap;
      response.formData = formData;
    }

    response.data = personData;
    yield put(getBasics.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getBasics.failure(action.id, error));
  }
  finally {
    yield put(getBasics.finally(action.id));
  }
  return response;
}

function* getBasicsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_BASICS, getBasicsWorker);
}

function* updateBasicsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateBasics.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateBasics.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateBasics.failure(action.id, error));
  }
  finally {
    yield put(updateBasics.finally(action.id));
  }
}

function* updateBasicsWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_BASICS, updateBasicsWorker);
}

function* getBasicInformationWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: personEKID } = action;
    if (!isValidUUID(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getBasicInformation.request(action.id, personEKID));

    const appearanceRequest = call(
      getAppearanceWorker,
      getAppearance(personEKID)
    );

    const basicsRequest = call(
      getBasicsWorker,
      getBasics(personEKID)
    );

    const addressRequest = call(
      getAddressWorker,
      getAddress(personEKID)
    );

    const contactRequest = call(
      getContactWorker,
      getContact(personEKID)
    );

    const photosRequest = call(
      getPhotosWorker,
      getPhotos(personEKID)
    );

    const scarsRequest = call(
      getScarsMarksTattoosWorker,
      getScarsMarksTattoos(personEKID)
    );

    const responses = yield all([
      addressRequest,
      appearanceRequest,
      basicsRequest,
      contactRequest,
      photosRequest,
      scarsRequest,
    ]);

    responses.forEach((response) => {
      if (response.error) throw response.error;
    });

    yield put(getBasicInformation.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getBasicInformation.failure(action.id, error));
  }
  finally {
    yield put(getBasicInformation.finally(action.id));
  }
}

function* getBasicInformationWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_BASIC_INFORMATION, getBasicInformationWorker);
}

export {
  getBasicInformationWatcher,
  getBasicInformationWorker,
  getBasicsWatcher,
  getBasicsWorker,
  updateBasicsWatcher,
  updateBasicsWorker
};
