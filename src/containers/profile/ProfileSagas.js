// @flow
import isPlainObject from 'lodash/isPlainObject';
import {
  all,
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
import { Models, Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PERSON_DATA,
  GET_PHYSICAL_APPEARANCE,
  GET_PROFILE_CITATIONS,
  GET_PROFILE_POLICE_CAD,
  GET_PROFILE_REPORTS,
  UPDATE_PROFILE_ABOUT,
  createPhysicalAppearance,
  getPersonData,
  getPhysicalAppearance,
  getProfileCitations,
  getProfilePoliceCAD,
  getProfileReports,
  updatePhysicalAppearance,
  updateProfileAbout,
} from './ProfileActions';
import { personFqnsByName, physicalAppearanceFqnsByName } from './constants';
import { countCrisisCalls, countSafetyIncidents, countTopBehaviors } from './premium/Utils';

import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../utils/AppUtils';
import {
  getEKIDsFromNeighborResponseData,
  getEntityKeyId,
  getNeighborDetailsFromNeighborResponseData,
  simulateResponseData,
} from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { getInvolvedPeople } from '../explore/ExploreActions';
import { getInvolvedPeopleWorker } from '../explore/ExploreSagas';

const LOG = new Logger('ProfileSagas');

const { DataGraphBuilder } = Models;
const { UpdateTypes } = Types;
const { isDefined } = LangUtils;
const { isValidUUID } = ValidationUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { createEntityAndAssociationData, getEntityData, updateEntityData } = DataApiActions;
const { createEntityAndAssociationDataWorker, getEntityDataWorker, updateEntityDataWorker } = DataApiSagas;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  CITATION_FQN,
  EMPLOYEE_FQN,
  INVOLVED_IN_FQN,
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
  POLICE_CAD_FQN,
} = APP_TYPES_FQNS;

function* getPhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getPhysicalAppearance.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
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

    response.data = appearanceData;

    yield put(getPhysicalAppearance.success(action.id, appearanceData));
  }
  catch (error) {
    response.error = error;
    yield put(getPhysicalAppearance.failure(action.id, error));
  }
  finally {
    yield put(getPhysicalAppearance.finally(action.id));
  }

  return response;
}

function* getPhysicalAppearanceWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PHYSICAL_APPEARANCE, getPhysicalAppearanceWorker);
}

function* getPersonDataWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getPersonData.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
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
    response.data = personData;
    yield put(getPersonData.success(action.id, personData));
  }
  catch (error) {
    response.error = error;
    yield put(getPersonData.failure(action.id, error));
  }
  finally {
    yield put(getPersonData.finally(action.id));
  }
  return response;
}

function* getPersonDataWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PERSON_DATA, getPersonDataWorker);
}

function* getProfileReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileReports.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const reportESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const appearsInESID :UUID = getESIDFromApp(app, APPEARS_IN_FQN);

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
      .sortBy((report :Map) :number => {
        const time = DateTime.fromISO(report.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));

        return -time.valueOf();
      });

    const behaviorSummary = countTopBehaviors(reportsData, FQN.OBSERVED_BEHAVIORS_FQN);
    const crisisSummary = countCrisisCalls(reportsData, FQN.DATE_TIME_OCCURRED_FQN);
    const safetySummary = countSafetyIncidents(reportsData);

    yield put(getProfileReports.success(action.id, fromJS({
      data: reportsData,
      behaviorSummary,
      crisisSummary,
      safetySummary,
    })));
  }
  catch (error) {
    yield put(getProfileReports.failure(action.id));
  }
  finally {
    yield put(getProfileReports.finally(action.id));
  }
}

function* getProfileReportsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PROFILE_REPORTS, getProfileReportsWorker);
}

function* createPhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } :Object = action;
    const { appearanceProperties, personEKID } = value;

    if (!isDefined(appearanceProperties)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUUID(personEKID) || !isPlainObject(appearanceProperties)) throw ERR_ACTION_VALUE_TYPE;
    yield put(createPhysicalAppearance.request(action.id, personEKID));

    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const app = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const observedInESID :UUID = getESIDFromApp(app, OBSERVED_IN_FQN);
    const physicalAppearanceESID :UUID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);
    const datetimePTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', FQN.COMPLETED_DT_FQN]));

    const now = DateTime.local().toISO();
    const associations = {
      [observedInESID]: [{
        srcEntityIndex: 0,
        srcEntitySetId: physicalAppearanceESID,
        dstEntityKeyId: personEKID,
        dstEntitySetId: peopleESID,
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

    const createResponse = yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData(dataGraph)
    );

    if (createResponse.error) throw createResponse.error;

    const createdAppearanceEKID = fromJS(createResponse.data).getIn([
      'entityKeyIds',
      physicalAppearanceESID,
      0
    ]);

    const newPhysicalAppearance = simulateResponseData(
      fromJS(appearanceProperties),
      createdAppearanceEKID,
      propertyTypesById
    );
    response.data = newPhysicalAppearance;

    yield put(createPhysicalAppearance.success(action.id, newPhysicalAppearance));
  }
  catch (error) {
    response.error = error;
    yield put(createPhysicalAppearance.failure(action.id, error));
  }
  finally {
    yield put(createPhysicalAppearance.finally(action.id));
  }

  return response;
}

function* updatePhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } :Object = action;
    const { appearanceEKID, appearanceProperties } = value;
    if (!isDefined(appearanceProperties)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUUID(appearanceEKID) || !isPlainObject(appearanceProperties)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updatePhysicalAppearance.request(action.id));

    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const app = yield select((state) => state.get('app', Map()));
    const physicalAppearanceESID :UUID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);

    const updateResponse = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: physicalAppearanceESID,
        entities: {
          [appearanceEKID]: appearanceProperties
        },
        updateType: UpdateTypes.PartialReplace,
      })
    );

    if (updateResponse.error) throw updateResponse.error;

    const updatedPhysicalAppearance = simulateResponseData(
      fromJS(appearanceProperties),
      appearanceEKID,
      propertyTypesById
    );
    response.data = updatedPhysicalAppearance;

    yield put(updatePhysicalAppearance.success(action.id, updatedPhysicalAppearance));
  }
  catch (error) {
    response.error = error;
    yield put(updatePhysicalAppearance.failure(action.id, error));
  }
  finally {
    yield put(updatePhysicalAppearance.finally(action.id));
  }

  return response;
}

const getUpdatedPropertiesByName = (data, fqnsByName :any, fqnToIdMap) :Object => {
  const updatedProperties = {};
  Object.keys(fqnsByName).forEach((name) => {
    const fqn = fqnsByName[name];
    const propertyTypeId = fqnToIdMap.get(fqn);
    let formattedValue = [];
    const currentValue = data.get(name);
    if (Array.isArray(currentValue)) {
      formattedValue = currentValue;
    }
    else if (currentValue !== '' && currentValue !== undefined && currentValue !== null) {
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
    if (!isValidUUID(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updateProfileAbout.request(action.id, personEKID));

    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const fqnToIdMap :Map = yield select((state) => state.getIn(['edm', 'fqnToIdMap']), Map());
    const app = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);

    const newPersonProperties = getUpdatedPropertiesByName(
      data,
      personFqnsByName,
      fqnToIdMap
    );

    const appearanceProperties = getUpdatedPropertiesByName(
      data,
      physicalAppearanceFqnsByName,
      fqnToIdMap
    );

    const updatePersonRequest = call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: peopleESID,
        entities: {
          [personEKID]: newPersonProperties
        },
        updateType: UpdateTypes.PartialReplace,
      })
    );

    let physicalAppearanceRequest = call(
      createPhysicalAppearanceWorker,
      createPhysicalAppearance({ appearanceProperties, personEKID })
    );

    // update appearance if it already exists
    if (appearanceEKID) {
      physicalAppearanceRequest = call(
        updatePhysicalAppearanceWorker,
        updatePhysicalAppearance({ appearanceEKID, appearanceProperties })
      );
    }

    const [personResponse, appearanceResponse] = yield all([
      updatePersonRequest,
      physicalAppearanceRequest,
    ]);

    if (personResponse.error) throw personResponse.error;
    if (appearanceResponse.error) throw appearanceResponse.error;

    const updatedPerson = simulateResponseData(fromJS(newPersonProperties), personEKID, propertyTypesById);
    const updatedPhysicalAppearance = appearanceResponse.data;

    yield put(updateProfileAbout.success(action.id, { updatedPerson, updatedPhysicalAppearance }));
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

function* getProfilePoliceCADWorker(action :SequenceAction) :Saga<void> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getProfilePoliceCAD.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      policeCadESID,
      involvedInESID
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      POLICE_CAD_FQN,
      INVOLVED_IN_FQN,
    ]);

    const response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: peopleESID,
        filter: {
          entityKeyIds: [entityKeyId],
          edgeEntitySetIds: [involvedInESID],
          destinationEntitySetIds: [policeCadESID],
          sourceEntitySetIds: [],
        },
      })
    );

    if (response.error) throw response.error;

    const hits = fromJS(response.data)
      .get(entityKeyId, List())
      .map((entity :Map) => entity.get('neighborDetails'))
      .toSet()
      .toList()
      .sortBy((entity :Map) :number => {
        const time = DateTime.fromISO(entity.getIn([FQN.DATETIME_REPORTED_FQN, 0]));

        return -time.valueOf();
      });
    let payload = { hits };
    const policeCadEKIDs = hits.map(getEntityKeyId);

    if (!policeCadEKIDs.isEmpty()) {

      const peopleResponse = yield call(
        getInvolvedPeopleWorker,
        getInvolvedPeople({
          entitySetId: policeCadESID,
          entityKeyIds: policeCadEKIDs,
        })
      );

      if (peopleResponse.error) throw peopleResponse.error;
      payload = Object.assign(payload, peopleResponse.data);
    }

    yield put(getProfilePoliceCAD.success(action.id, payload));
  }
  catch (error) {
    yield put(getProfilePoliceCAD.failure(action.id));
  }
  finally {
    yield put(getProfilePoliceCAD.finally(action.id));
  }
}

function* getProfilePoliceCADWatcher() :Saga<void> {
  yield takeLatest(GET_PROFILE_POLICE_CAD, getProfilePoliceCADWorker);
}

function* getProfileCitationsWorker(action :SequenceAction) :Saga<void> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUUID(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getProfileCitations.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      citationsESID,
      employeeESID,
      involvedInESID,
      peopleESID,
    ] = getESIDsFromApp(app, [
      CITATION_FQN,
      EMPLOYEE_FQN,
      INVOLVED_IN_FQN,
      PEOPLE_FQN,
    ]);

    const response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: peopleESID,
        filter: {
          entityKeyIds: [entityKeyId],
          edgeEntitySetIds: [involvedInESID],
          destinationEntitySetIds: [citationsESID],
          sourceEntitySetIds: [],
        },
      })
    );

    if (response.error) throw response.error;

    const hits = fromJS(response.data)
      .get(entityKeyId, List())
      .map((entity :Map) => entity.get('neighborDetails'))
      .toSet()
      .toList()
      .sortBy((entity :Map) :number => {
        const time = DateTime.fromISO(entity.getIn([FQN.DATE_TIME_FQN, 0]));

        return -time.valueOf();
      });
    let payload = { hits };
    const citationEKIDs = hits.map(getEntityKeyId);

    if (!citationEKIDs.isEmpty()) {

      const employeeRequest = call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({
          entitySetId: citationsESID,
          filter: {
            entityKeyIds: citationEKIDs.toJS(),
            edgeEntitySetIds: [involvedInESID],
            destinationEntitySetIds: [],
            sourceEntitySetIds: [employeeESID],
          },
        })
      );

      const peopleRequest = yield call(
        getInvolvedPeopleWorker,
        getInvolvedPeople({
          entitySetId: citationsESID,
          entityKeyIds: citationEKIDs,
        })
      );

      const [employeeResponse, peopleResponse] = yield all([
        employeeRequest,
        peopleRequest,
      ]);

      if (employeeResponse.error) throw employeeResponse.error;
      const employeeResponseData = fromJS(employeeResponse.data);
      const employeesByHitEKID = getEKIDsFromNeighborResponseData(employeeResponseData);
      const employeesByEKID = getNeighborDetailsFromNeighborResponseData(employeeResponseData);
      payload = { ...payload, employeesByHitEKID, employeesByEKID };

      if (peopleResponse.error) throw peopleResponse.error;
      payload = Object.assign(payload, peopleResponse.data);
    }

    yield put(getProfileCitations.success(action.id, payload));
  }
  catch (error) {
    yield put(getProfileCitations.failure(action.id));
  }
  finally {
    yield put(getProfileCitations.finally(action.id));
  }
}

function* getProfileCitationsWatcher() :Saga<void> {
  yield takeLatest(GET_PROFILE_CITATIONS, getProfileCitationsWorker);
}

export {
  getPersonDataWatcher,
  getPersonDataWorker,
  getPhysicalAppearanceWatcher,
  getPhysicalAppearanceWorker,
  getProfileCitationsWatcher,
  getProfileCitationsWorker,
  getProfilePoliceCADWatcher,
  getProfilePoliceCADWorker,
  getProfileReportsWatcher,
  getProfileReportsWorker,
  updateProfileAboutWatcher,
  updateProfileAboutWorker,
};
