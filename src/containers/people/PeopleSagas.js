/*
 * @flow
 */

import isPlainObject from 'lodash/isPlainObject';
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
  getIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { getPersonBasicsAssociations } from './NewPersonUtils';
import {
  GET_PEOPLE_PHOTOS,
  GET_RECENT_INCIDENTS,
  SEARCH_PEOPLE,
  SUBMIT_NEW_PERSON,
  getPeoplePhotos,
  getRecentIncidents,
  searchPeople,
  submitNewPerson,
} from './PeopleActions';

import * as FQN from '../../edm/DataModelFqns';
import { selectAppSettings } from '../../core/redux/selectors';
import { submitDataGraph } from '../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  getESIDFromApp,
  getPeopleESId,
} from '../../utils/AppUtils';
import { indexSubmittedDataGraph } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { processEntityData, processAssociationEntityData } = DataProcessingUtils;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  IMAGE_FQN,
  INCIDENT_FQN,
  INVOLVED_IN_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('PeopleSagas');

export function* getPeoplePhotosWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value: entityKeyIds } = action;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getPeoplePhotos.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const imageESID :UUID = getESIDFromApp(app, IMAGE_FQN);
    const isPictureOfESID :UUID = getESIDFromApp(app, IS_PICTURE_OF_FQN);

    const imageSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds: [isPictureOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [imageESID]
      }
    };

    const imageResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(imageSearchParams)
    );

    const profilePicByEKID = fromJS(imageResponse.data)
      .map((entity) => entity.first().get('neighborDetails'));

    yield put(getPeoplePhotos.success(action.id, profilePicByEKID));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getPeoplePhotos.failure(action.id));
  }
  finally {
    yield put(getPeoplePhotos.finally(action.id));
  }
}

export function* getPeoplePhotosWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_PEOPLE_PHOTOS, getPeoplePhotosWorker);
}

export function* getRecentIncidentsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyIds } = action;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getRecentIncidents.request(action.id, entityKeyIds));

    const app :Map = yield select((state) => state.get('app', Map()));
    const bhrESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const appearsInESID :UUID = getESIDFromApp(app, APPEARS_IN_FQN);
    const involvedInESID :UUID = getESIDFromApp(app, INVOLVED_IN_FQN);
    const incidentESID :UUID = getESIDFromApp(app, INCIDENT_FQN);
    const settings :Map = yield select(selectAppSettings());

    const isV2 = settings.get('v2');

    let edgeEntitySetIds = [appearsInESID];
    let destinationEntitySetIds = [bhrESID];

    if (isV2) {
      edgeEntitySetIds = [involvedInESID];
      destinationEntitySetIds = [incidentESID];
    }

    // all reports for each person
    const reportsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds,
        destinationEntitySetIds,
        sourceEntitySetIds: [],
      }
    };

    const incidentsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(reportsSearchParams)
    );

    if (incidentsResponse.error) throw incidentsResponse.error;

    // get most recent incident per EKID
    const recentIncidentsByEKID = fromJS(incidentsResponse.data)
      .map((incidents) => {
        const dateFQN = isV2 ? FQN.DATETIME_START_FQN : FQN.DATE_TIME_OCCURRED_FQN;
        const recentIncident = incidents
          .map((incident :Map) => incident.get('neighborDetails'))
          .toSet()
          .toList()
          .sortBy((incident :Map) :number => {
            const time = DateTime.fromISO(incident.getIn([dateFQN, 0]));

            return -time.valueOf();
          })
          .first();

        const recentIncidentDT = DateTime.fromISO(recentIncident.getIn([dateFQN, 0]));

        return Map({
          recentIncidentDT,
        });
      });

    yield put(getRecentIncidents.success(action.id, recentIncidentsByEKID));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getRecentIncidents.failure(action.id));
  }
  finally {
    yield put(getRecentIncidents.finally(action.id));
  }
}

export function* getRecentIncidentsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_RECENT_INCIDENTS, getRecentIncidentsWorker);
}

function* searchPeopleWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    yield put(searchPeople.request(action.id, { searchInputs }));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const peopleESID = getPeopleESId(app);
    const dobPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_DOB_FQN]);
    const ethnicityPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_ETHNICITY_FQN]);
    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);
    const numReportsPTID :UUID = edm.getIn(['fqnToIdMap', FQN.NUM_REPORTS_FOUND_IN_FQN]);
    const racePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_RACE_FQN]);
    const sexPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_SEX_FQN]);

    const searchFields = [];
    const updateSearchField = (searchTerm :string, property :string, metaphone :boolean = false) => {
      searchFields.push({
        searchTerm: metaphone ? searchTerm : `${searchTerm}*`,
        property,
        exact: true
      });
    };

    const firstName :string = searchInputs.get('firstName', '').trim();
    const lastName :string = searchInputs.get('lastName', '').trim();
    const dob :string = searchInputs.get('dob');
    const race :Object = searchInputs.get('race');
    const sex :Object = searchInputs.get('sex');
    const ethnicity :Object = searchInputs.get('ethnicity');
    const metaphone :boolean = searchInputs.get('metaphone');
    const includeRMS :boolean = searchInputs.get('includeRMS');

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID, metaphone);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID, metaphone);
    }
    const dobDT = DateTime.fromISO(dob);
    if (dobDT.isValid) {
      updateSearchField(dobDT.toISODate(), dobPTID, true);
    }
    if (isPlainObject(race)) {
      updateSearchField(race.value, racePTID, true);
    }
    if (isPlainObject(sex)) {
      updateSearchField(sex.value, sexPTID, true);
    }
    if (isPlainObject(ethnicity)) {
      updateSearchField(ethnicity.value, ethnicityPTID, true);
    }

    const reportThresholdConstraint = {
      constraints: [{
        type: 'simple',
        searchTerm: `entity.${numReportsPTID}:[1 TO *]`,
        fuzzy: false
      }, {
        type: 'simple',
        fuzzy: false,
        searchTerm: `_exists_:entity.${numReportsPTID}`
      }],
      min: 2
    };

    const constraints = [{
      constraints: [{
        type: 'advanced',
        searchFields,
      }]
    }];

    if (!includeRMS) {
      constraints.push(reportThresholdConstraint);
    }

    const searchConstraints = {
      entitySetIds: [peopleESID],
      maxHits,
      start,
      constraints,
      sort: {
        propertyTypeId: numReportsPTID,
        type: 'field'
      }
    };

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (response.error) throw response.error;

    const hits = fromJS(response.data.hits);

    const peopleEKIDs = hits.map((person) => person.getIn([OPENLATTICE_ID_FQN, 0]));

    yield put(searchPeople.success(action.id, { hits, totalHits: response.data.numHits }));
    if (!peopleEKIDs.isEmpty()) {
      yield put(getPeoplePhotos(peopleEKIDs));
      yield put(getRecentIncidents(peopleEKIDs));
    }
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchPeople.failure(action.id, error));
  }
  finally {
    yield put(searchPeople.finally(action.id));
  }
}

export function* searchPeopleWatcher() :Generator<*, *, *> {
  yield takeEvery(SEARCH_PEOPLE, searchPeopleWorker);
}

export function* submitNewPersonWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitNewPerson.request(action.id));
    const { formData } = value;

    const app = yield select((state) => state.get('app', Map()));
    const entitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const propertyFqnToIdMap = yield select((state) => state.getIn(['edm', 'fqnToIdMap'], Map()));
    const propertyTypesById = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);

    const entityData = processEntityData(formData, entitySetIds, propertyFqnToIdMap);
    const associationEntityData = processAssociationEntityData(
      getPersonBasicsAssociations(),
      entitySetIds,
      propertyFqnToIdMap,
    );

    const dataGraph = {
      entityData,
      associationEntityData,
    };

    const dataGraphResponse = yield call(
      submitDataGraphWorker,
      submitDataGraph(dataGraph)
    );

    if (dataGraphResponse.error) throw dataGraphResponse.error;
    const indexedDataGraph = indexSubmittedDataGraph(dataGraph, dataGraphResponse, propertyTypesById);
    const createdPerson = fromJS(getIn(indexedDataGraph, ['entities', peopleESID, 0]));

    yield put(submitNewPerson.success(action.id, createdPerson));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(submitNewPerson.failure(action.id));
  }
  finally {
    yield put(submitNewPerson.finally(action.id));
  }
  return response;
}

export function* submitNewPersonWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_NEW_PERSON, submitNewPersonWorker);
}
