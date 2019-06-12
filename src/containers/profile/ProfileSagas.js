// @flow
import { DateTime } from 'luxon';
import {
  all,
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
import { Models, Types } from 'lattice';

import type { SequenceAction } from 'redux-reqseq';

import { personFqnsByName, physicalAppearanceFqnsByName } from './constants';
import {
  GET_PERSON_DATA,
  GET_PROFILE_REPORTS,
  UPDATE_PROFILE_ABOUT,
  createPhysicalAppearance,
  getPersonData,
  getProfileReports,
  updateProfileAbout,
} from './ProfileActions';
import {
  getAppearsInESId,
  getPeopleESId,
  getReportESId,
  getHasESId,
  getPhysicalAppearanceESId,
} from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isDefined } from '../../utils/LangUtils';
import { isValidUuid } from '../../utils/Utils';
import * as FQN from '../../edm/DataModelFqns';

const { DataGraphBuilder } = Models;
const { UpdateTypes } = Types;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { createEntityAndAssociationData, getEntityData, updateEntityData } = DataApiActions;
const { createEntityAndAssociationDataWorker, getEntityDataWorker, updateEntityDataWorker } = DataApiSagas;

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

function* createPhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  let response = {};
  try {
    const { value } :Object = action;
    const { appearanceProperties, personEKID } = value;

    if (!isDefined(appearanceProperties)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID) || Map.isMap(appearanceProperties)) throw ERR_ACTION_VALUE_TYPE;
    // if (!isValidUuid(appearanceEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(createPhysicalAppearance.request(action.id, personEKID));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const app = yield select(state => state.get('app', Map()));
    const peopleESID :UUID = getPeopleESId(app);
    const hasESID :UUID = getHasESId(app);
    const physicalAppearanceESID :UUID = getPhysicalAppearanceESId(app);
    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_FQN]);

    const now = DateTime.local().toISO();
    const associations = {
      [hasESID]: [{
        srcEntityKeyId: personEKID,
        srcEntitySetId: peopleESID,
        dstEntityIndex: 0,
        dstEntitySetId: physicalAppearanceESID,
        data: {
          [datetimePTID]: [now]
        }
      }]
    };

    const entities = {
      [physicalAppearanceESID]: [appearanceProperties]
    };

    const dataGraph = new DataGraphBuilder()
      .setAssociations(associations)
      .setEntities(entities)
      .build();

    response = yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData(dataGraph)
    );

    yield put(createPhysicalAppearance.success(action.id));
  }
  catch (error) {
    response.error = error;
    yield put(createPhysicalAppearance.failure(action.id));
  }
  finally {
    yield put(createPhysicalAppearance.finally(action.id));
  }

  return response;
}

const getUpdatedPropertiesByName = ({ data, fqnsByName, edm }) :Object => {
  const updatedProperties = {};
  Object.keys(fqnsByName).forEach((name) => {
    const fqn = fqnsByName[name];
    const propertyTypeId = edm.getIn(['fqnToIdMap', fqn]);
    let formattedValue;
    const currentValue = data.get(name);
    if (Array.isArray(currentValue)) {
      formattedValue = currentValue;
    }
    else {
      formattedValue = [currentValue];
    }
    updatedProperties[propertyTypeId] = formattedValue;
  });

  return updatedProperties;
};

function* updateProfileAboutWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } :Object = action;
    const { data, personEKID, appearanceEKID } = value;

    if (!isDefined(data)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updateProfileAbout.request(action.id, personEKID));

    const edm :Map<*, *> = yield select(state => state.get('edm'));
    const app = yield select(state => state.get('app', Map()));
    const peopleESID :UUID = getPeopleESId(app);
    const physicalAppearanceESID :UUID = getPhysicalAppearanceESId(app);

    const newPersonProperties = getUpdatedPropertiesByName({
      data,
      fqnsByName: personFqnsByName,
      edm
    });

    const appearanceProperties = getUpdatedPropertiesByName({
      data,
      fqnsByName: physicalAppearanceFqnsByName,
      edm
    });

    const personRequest = call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: peopleESID,
        entities: {
          [personEKID]: newPersonProperties
        },
        updateType: UpdateTypes.PartialReplace,
      })
    );

    // only do this if appearanceEKID is valid;
    let appearanceRequest = call(
      createPhysicalAppearanceWorker,
      createPhysicalAppearance({
        appearanceProperties,
        personEKID
      })
    );

    if (appearanceEKID) {
      appearanceRequest = call(
        updateEntityDataWorker,
        updateEntityData({
          entitySetId: physicalAppearanceESID,
          entities: {
            [appearanceEKID]: appearanceProperties
          },
          updateType: UpdateTypes.PartialReplace,
        })
      );
    }

    const responses = yield all([
      personRequest,
      appearanceRequest,
    ]);

    yield put(updateProfileAbout.success(action.id));
  }
  catch (error) {
    yield put(updateProfileAbout.failure(action.id, error));
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
