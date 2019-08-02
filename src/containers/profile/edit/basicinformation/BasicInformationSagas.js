// @flow
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { DataProcessingUtils } from 'lattice-fabricate';
import { List, Map, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
  DataApiActions,
  DataApiSagas,
} from 'lattice-sagas';

import Logger from '../../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';
import {
  GET_APPEARANCE,
  GET_BASIC_INFORMATION,
  GET_BASIC_INFO_CONTAINER,
  SUBMIT_APPEARANCE,
  UPDATE_APPEARANCE,
  UPDATE_BASIC_INFORMATION,
  getAppearance,
  getBasicInfoContainer,
  getBasicInformation,
  submitAppearance,
  updateAppearance,
  updateBasicInformation
} from './BasicInformationActions';
import {
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';

import { getESIDFromApp } from '../../../../utils/AppUtils';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getFormDataFromEntity } from '../../../../utils/DataUtils';
import * as FQN from '../../../../edm/DataModelFqns';

const LOG = new Logger('BasicInformationSagas');
const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { createEntityAndAssociationData, getEntityData, updateEntityData } = DataApiActions;
const { createEntityAndAssociationDataWorker, getEntityDataWorker, updateEntityDataWorker } = DataApiSagas;

function* getAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getAppearance.request(action.id, entityKeyId));

    const app :Map = yield select(state => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const physicalAppearanceESID :UUID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);
    const observedInESID :UUID = getESIDFromApp(app, OBSERVED_IN_FQN);

    const appearanceSearchParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [observedInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [physicalAppearanceESID],
      }
    };

    const appearanceRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(appearanceSearchParams)
    );

    if (appearanceRequest.error) throw appearanceRequest.error;
    const appearanceDataList = fromJS(appearanceRequest.data).get(entityKeyId, List());
    if (appearanceDataList.count() > 1) {
      LOG.warn('more than one appearance found in person', entityKeyId);
    }

    const appearanceData = appearanceDataList
      .getIn([0, 'neighborDetails'], Map());

    if (!appearanceData.isEmpty()) {

      const appearanceProperties = [
        FQN.EYE_COLOR_FQN,
        FQN.HAIR_COLOR_FQN,
        FQN.HEIGHT_FQN,
        FQN.WEIGHT_FQN,
      ];

      const appearanceEKID = appearanceData.getIn([OPENLATTICE_ID_FQN, 0]);

      const appearanceFormData = getFormDataFromEntity(
        appearanceData,
        PHYSICAL_APPEARANCE_FQN,
        appearanceProperties,
        0
      );
      response.entityIndexToIdMap = Map().setIn([PHYSICAL_APPEARANCE_FQN, 0], appearanceEKID);
      response.formData = Map().set(getPageSectionKey(1, 1), appearanceFormData);
    }

    response.data = appearanceData;

    yield put(getAppearance.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    yield put(getAppearance.failure(action.id, error));
  }

  return response;
}

function* getApperanceWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_APPEARANCE, getAppearanceWorker);
}

function* getBasicInformationWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getBasicInformation.request(action.id, entityKeyId));

    const app :Map = yield select(state => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);

    const personResponse = yield call(
      getEntityDataWorker,
      getEntityData({
        entitySetId,
        entityKeyId
      })
    );

    if (personResponse.error) throw personResponse.error;

    const personData = fromJS(personResponse.data);
    if (!personData.isEmpty()) {

      const personProperties = [
        FQN.PERSON_DOB_FQN,
        FQN.PERSON_FIRST_NAME_FQN,
        FQN.PERSON_LAST_NAME_FQN,
        FQN.PERSON_MIDDLE_NAME_FQN,
        FQN.PERSON_RACE_FQN,
        FQN.PERSON_SEX_FQN,
      ];

      const aliases = personData.get(FQN.PERSON_NICK_NAME_FQN) || List();

      const personEKID = personData.getIn([OPENLATTICE_ID_FQN, 0]);

      const personFormData :Map = getFormDataFromEntity(
        personData,
        PEOPLE_FQN,
        personProperties,
        0
      );

      response.entityIndexToIdMap = Map().setIn([PEOPLE_FQN, 0], personEKID);
      response.formData = Map()
        .set(getPageSectionKey(1, 1), personFormData)
        .setIn([
          getPageSectionKey(1, 1),
          getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_NICK_NAME_FQN),
        ], aliases);
    }

    response.data = personData;
    yield put(getBasicInformation.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    yield put(getBasicInformation.failure(action.id, error));
  }
  finally {
    yield put(getBasicInformation.finally(action.id));
  }
  return response;
}

function* getBasicInformationWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_BASIC_INFORMATION, getBasicInformationWorker);
}

function* getBasicInfoContainerWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: personEKID } = action;
    if (!isDefined(personEKID)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getBasicInfoContainer.request(action.id, personEKID));

    const appearanceRequest = call(
      getAppearanceWorker,
      getAppearance(personEKID)
    );

    const basicInformationRequest = call(
      getBasicInformationWorker,
      getBasicInformation(personEKID)
    );

    const [basicInformationResponse, appearanceResponse] = yield all([
      basicInformationRequest,
      appearanceRequest,
    ]);

    if (basicInformationResponse.error) throw basicInformationResponse.error;
    if (appearanceResponse.error) throw appearanceResponse.error;

    yield put(getBasicInfoContainer.success(action.id));
  }
  catch (error) {
    LOG.error(error);
    yield put(getBasicInfoContainer.failure(action.id, error));
  }
  finally {
    yield put(getBasicInfoContainer.finally(action.id));
  }
}

function* getBasicInfoContainerWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_BASIC_INFO_CONTAINER, getBasicInfoContainerWorker);
}

export {
  getAppearanceWorker,
  getApperanceWatcher,
  getBasicInfoContainerWatcher,
  getBasicInfoContainerWorker,
  getBasicInformationWatcher,
  getBasicInformationWorker,
};
