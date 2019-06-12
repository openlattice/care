// @flow
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
  fromJS
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
  DataApiActions,
  DataApiSagas,
} from 'lattice-sagas';

import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PERSON_DATA,
  GET_PROFILE_REPORTS,
  getPersonData,
  getProfileReports,
  UPDATE_PROFILE_ABOUT,
  updateProfileAbout,
} from './ProfileActions';
import {
  getAppearsInESId,
  getPeopleESId,
  getReportESId,
} from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isDefined } from '../../utils/LangUtils';
import { isValidUuid } from '../../utils/Utils';
import * as FQN from '../../edm/DataModelFqns';

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityData } = DataApiActions;
const { getEntityDataWorker } = DataApiSagas;

function* getPersonDataWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getPersonData.request(action.id, entityKeyId));

    const app :Map = yield select(state => state.get('app', Map()));
    const entitySetId :UUID = getPeopleESId(app);

    const personResponse = yield call(
      getEntityDataWorker,
      getEntityData({
        entitySetId,
        entityKeyId
      })
    );

    if (personResponse.error) throw personResponse.error;

    const personData = fromJS(personResponse.data);

    yield put(getPersonData.success(action.id, personData));
  }
  catch (error) {
    yield put(getPersonData.failure(action.id, error));
  }
  finally {
    yield put(getPersonData.finally(action.id));
  }
}

function* getPersonDataWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_PERSON_DATA, getPersonDataWorker);
}

function* getProfileReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileReports.request(action.id, entityKeyId));

    const app :Map = yield select(state => state.get('app', Map()));
    const reportESID :UUID = getReportESId(app);
    const peopleESID :UUID = getPeopleESId(app);
    const appearsInESID :UUID = getAppearsInESId(app);

    // all reports for person
    const reportsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [appearsInESID],
        destinationEntitySetIds: [reportESID],
        sourceEntitySetIds: [],
      }
    };

    const reportsRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(reportsSearchParams)
    );

    if (reportsRequest.error) throw reportsRequest.error;

    // Sort unique reports by datetime occurred DESC
    const reportsData = fromJS(reportsRequest.data)
      .get(entityKeyId, List())
      .map((report :Map) => report.get('neighborDetails'))
      .toSet()
      .toList()
      .sort((reportA :Map, reportB :Map) :number => {
        const timeA = DateTime.fromISO(reportA.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));
        const timeB = DateTime.fromISO(reportB.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));

        if (!timeA.isValid) return 1;
        if (!timeB.isValid) return -1;

        return timeB.diff(timeA).toObject().milliseconds;
      });

    yield put(getProfileReports.success(action.id, reportsData));
  }
  catch (error) {
    yield put(getProfileReports.failure(action.id));
  }
  finally {
    yield put(getProfileReports.finally(action.id));

  }
}

function* getProfileReportsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_PROFILE_REPORTS, getProfileReportsWorker);
}

function* updateProfileAboutWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } :Object = action;
    const { data, personEKID, appearanceEKID } = value;

    if (!isDefined(data)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID) || Map.isMap(data)) throw ERR_ACTION_VALUE_TYPE;
    // if (!isValidUuid(appearanceEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updateProfileAbout.request(action.id, personEKID));

    
    yield put(updateProfileAbout.success(action.id));
  }
  catch (error) {
    yield put(updateProfileAbout.failure(action.id));
  }
  finally {
    yield put(updateProfileAbout.finally(action.id));
  }
}

function* updateProfileAboutWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_PROFILE_ABOUT, updateProfileAboutWorker);
}

export {
  getPersonDataWatcher,
  getPersonDataWorker,
  getProfileReportsWatcher,
  getProfileReportsWorker,
  updateProfileAboutWorker,
  updateProfileAboutWatcher,
};
