// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PROFILE_VISIBILITY,
  PUT_PROFILE_VISIBILITY,
  getProfileVisibility,
  putProfileVisibility,
} from './VisibilityActions';
import { VISIBILITY } from './constants';

import { submitDataGraph } from '../../../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../../../core/sagas/data/DataSagas';
import { COMPLETED_DT_FQN, STATUS_FQN, VARIABLE_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { getEntityKeyId } from '../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';

const { UpdateTypes } = Types;
const { isValidUUID } = ValidationUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { updateEntityData } = DataApiActions;
const { updateEntityDataWorker } = DataApiSagas;

const {
  REGISTERED_FOR_FQN,
  SUMMARY_SET_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('VisibilitySagas');

function* getProfileVisibilityWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    const entityKeyId = action.value;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getProfileVisibility.request(action.id, action.value));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const summarySetESID :UUID = getESIDFromApp(app, SUMMARY_SET_FQN);
    const registeredForESID :UUID = getESIDFromApp(app, REGISTERED_FOR_FQN);

    const summarySetSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [registeredForESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [summarySetESID],
      }
    };

    const summarySetResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(summarySetSearchParams)
    );

    if (summarySetResponse.error) throw summarySetResponse.error;
    const summarySets = fromJS(summarySetResponse.data).get(entityKeyId, List());
    if (summarySets.count() > 1) {
      LOG.warn('more than one summary set found for person', entityKeyId);
    }

    const summarySet = summarySets.getIn([0, 'neighborDetails']) || Map();
    response.data = summarySet;
    yield put(getProfileVisibility.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getProfileVisibility.failure(action.id), error);
  }
  return response;
}

function* getProfileVisibilityWatcher() :Saga<void> {
  yield takeLatest(GET_PROFILE_VISIBILITY, getProfileVisibilityWorker);
}

function* putProfileVisibilityWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    const { personEKID, summarySetEKID, status } = action.value;
    if (typeof status !== 'string' || !isValidUUID(personEKID)) throw ERR_ACTION_VALUE_TYPE;

    yield put(putProfileVisibility.request(action.id, action.value));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const summarySetESID :UUID = getESIDFromApp(app, SUMMARY_SET_FQN);
    const registeredForESID :UUID = getESIDFromApp(app, REGISTERED_FOR_FQN);
    const statusPTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', STATUS_FQN]));
    const variablePTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', VARIABLE_FQN]));
    const datetimePTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', COMPLETED_DT_FQN]));

    // if invalid UUID, make one attempt to search for existing summary set before attempting upsert
    let finalSummarySetEKID = summarySetEKID;
    if (!isValidUUID(summarySetEKID)) {
      const summarySetResponse = yield call(getProfileVisibilityWorker, getProfileVisibility(personEKID));
      if (summarySetResponse.error) throw summarySetResponse.error;
      const summarySetData = summarySetResponse.data;
      finalSummarySetEKID = getEntityKeyId(summarySetData);
    }

    const entityDetails = {
      [statusPTID]: [status],
      [variablePTID]: [VISIBILITY]
    };

    if (isValidUUID(finalSummarySetEKID)) {
      const putSummarySetResponse = yield call(
        updateEntityDataWorker,
        updateEntityData({
          entitySetId: summarySetESID,
          entities: {
            [finalSummarySetEKID]: entityDetails
          },
          updateType: UpdateTypes.PartialReplace,
        }),
      );
      if (putSummarySetResponse.error) throw putSummarySetResponse.error;
    }
    else {
      const now = DateTime.local().toISO();
      const associationEntityData = {
        [registeredForESID]: [{
          srcEntityIndex: 0,
          srcEntitySetId: summarySetESID,
          dstEntityKeyId: personEKID,
          dstEntitySetId: peopleESID,
          data: {
            [datetimePTID]: [now]
          }
        }]
      };

      const entityData = {
        [summarySetESID]: [entityDetails]
      };

      const newSummarySetResponse = yield call(
        submitDataGraphWorker,
        submitDataGraph({
          associationEntityData,
          entityData,
        })
      );
      if (newSummarySetResponse.error) throw newSummarySetResponse.error;
    }

    const mockDetails = Map({
      [STATUS_FQN]: [status]
    });
    yield put(putProfileVisibility.success(action.id, mockDetails));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(putProfileVisibility.failure(action.id, error));
  }
  return response;
}

function* putProfileVisibilityWatcher() :Saga<void> {
  yield takeEvery(PUT_PROFILE_VISIBILITY, putProfileVisibilityWorker);
}

export {
  getProfileVisibilityWatcher,
  getProfileVisibilityWorker,
  putProfileVisibilityWatcher,
  putProfileVisibilityWorker,
};
