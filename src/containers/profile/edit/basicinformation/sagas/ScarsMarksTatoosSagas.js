// @flow
import {
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
} from 'lattice-sagas';

import Logger from '../../../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isDefined } from '../../../../../utils/LangUtils';
import { isValidUuid } from '../../../../../utils/Utils';
import {
  GET_SCARS_MARKS_TATOOS,
  SUBMIT_SCARS_MARKS_TATOOS,
  UPDATE_SCARS_MARKS_TATOOS,
  getScarsMarksTatoos,
  submitScarsMarksTatoos,
  updateScarsMarksTatoos,
} from '../actions/ScarsMarksTatoosActions';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../../core/sagas/data/DataSagas';

import { getESIDFromApp } from '../../../../../utils/AppUtils';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { getFormDataFromEntity } from '../../../../../utils/DataUtils';
import * as FQN from '../../../../../edm/DataModelFqns';

const LOG = new Logger('ScarsMarksTatoosSagas');
const { getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getScarsMarksTatoosWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getScarsMarksTatoos.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const identifyingCharacteristicsESID :UUID = getESIDFromApp(app, IDENTIFYING_CHARACTERISTICS_FQN);
    const observedInESID :UUID = getESIDFromApp(app, OBSERVED_IN_FQN);

    const characteristicsParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [observedInESID],
        destinationEntitySetIds: [identifyingCharacteristicsESID],
        sourceEntitySetIds: [],
      }
    };

    const characteristicsRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(characteristicsParams)
    );

    if (characteristicsRequest.error) throw characteristicsRequest.error;
    const characteristicsDataList = fromJS(characteristicsRequest.data).get(entityKeyId, List());
    if (characteristicsDataList.count() > 1) {
      LOG.warn('more than one characteristics found in person', entityKeyId);
    }

    const characteristicsData = characteristicsDataList
      .getIn([0, 'neighborDetails'], Map());

    if (!characteristicsData.isEmpty()) {

      const marksProperties = [FQN.DESCRIPTION_FQN];

      const characteristicsEKID = characteristicsData.getIn([OPENLATTICE_ID_FQN, 0]);

      const characteristicsFormData = getFormDataFromEntity(
        characteristicsData,
        IDENTIFYING_CHARACTERISTICS_FQN,
        marksProperties,
        0
      );
      response.entityIndexToIdMap = Map().setIn([IDENTIFYING_CHARACTERISTICS_FQN, 0], characteristicsEKID);
      response.formData = Map().set(getPageSectionKey(1, 1), characteristicsFormData);
    }

    response.data = characteristicsData;

    yield put(getScarsMarksTatoos.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    yield put(getScarsMarksTatoos.failure(action.id, error));
  }

  return response;
}

function* getScarsMarksTatoosWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SCARS_MARKS_TATOOS, getScarsMarksTatoosWorker);
}

function* submitScarsMarksTatoosWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitScarsMarksTatoos.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const marksEKID = newEntityKeyIdsByEntitySetName.getIn([IDENTIFYING_CHARACTERISTICS_FQN, 0]);

    const entityIndexToIdMap = Map().setIn([IDENTIFYING_CHARACTERISTICS_FQN.toString(), 0], marksEKID);

    const { path, properties } = value;

    yield put(submitScarsMarksTatoos.success(action.id, {
      entityIndexToIdMap,
      path,
      properties: fromJS(properties)
    }));
  }
  catch (error) {
    yield put(submitScarsMarksTatoos.failure(action.id, error));
  }
}

function* submitScarsMarksTatoosWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_SCARS_MARKS_TATOOS, submitScarsMarksTatoosWorker);
}

function* updateScarsMarksTatoosWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateScarsMarksTatoos.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateScarsMarksTatoos.success(action.id));
  }
  catch (error) {
    LOG.error('updateScarsMarksTatoosWorker', error);
    yield put(updateScarsMarksTatoos.failure(action.id, error));
  }
}

function* updateScarsMarksTatoosWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_SCARS_MARKS_TATOOS, updateScarsMarksTatoosWorker);
}

export {
  getScarsMarksTatoosWatcher,
  getScarsMarksTatoosWorker,
  submitScarsMarksTatoosWatcher,
  submitScarsMarksTatoosWorker,
  updateScarsMarksTatoosWatcher,
  updateScarsMarksTatoosWorker,
};
