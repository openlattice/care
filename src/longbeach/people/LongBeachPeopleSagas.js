/*
 * @flow
 */

import isPlainObject from 'lodash/isPlainObject';
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
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_LB_PEOPLE_PHOTOS,
  SEARCH_LB_PEOPLE,
  getLBPeoplePhotos,
  searchLBPeople,
} from './LongBeachPeopleActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  getESIDFromApp,
  getPeopleESId,
} from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const {
  // APPEARS_IN_FQN,
  // BEHAVIORAL_HEALTH_REPORT_FQN,
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const LOG = new Logger('PeopleSagas');

export function* getLBPeoplePhotosWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value: entityKeyIds } = action;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getLBPeoplePhotos.request(action.id));

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

    yield put(getLBPeoplePhotos.success(action.id, profilePicByEKID));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBPeoplePhotos.failure(action.id));
  }
}

export function* getLBPeoplePhotosWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_LB_PEOPLE_PHOTOS, getLBPeoplePhotosWorker);
}

// export function* getRecentIncidentsWorker(action :SequenceAction) :Generator<any, any, any> {
//   try {
//     const { value: entityKeyIds } = action;
//     if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

//     yield put(getRecentIncidents.request(action.id, entityKeyIds));

//     const app :Map = yield select((state) => state.get('app', Map()));
//     const reportESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
//     const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
//     const appearsInESID :UUID = getESIDFromApp(app, APPEARS_IN_FQN);

//     // all reports for each person
//     const reportsSearchParams = {
//       entitySetId: peopleESID,
//       filter: {
//         entityKeyIds: entityKeyIds.toJS(),
//         edgeEntitySetIds: [appearsInESID],
//         destinationEntitySetIds: [reportESID],
//         sourceEntitySetIds: [],
//       }
//     };

//     const incidentsResponse = yield call(
//       searchEntityNeighborsWithFilterWorker,
//       searchEntityNeighborsWithFilter(reportsSearchParams)
//     );

//     if (incidentsResponse.error) throw incidentsResponse.error;

//     // get most recent incident per EKID
//     const recentIncidentsByEKID = fromJS(incidentsResponse.data)
//       .map((reports) => {
//         const recentIncident = reports
//           .map((report :Map) => report.get('neighborDetails'))
//           .toSet()
//           .toList()
//           .sortBy((report :Map) :number => {
//             const time = DateTime.fromISO(report.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));

//             return -time.valueOf();
//           })
//           .first();

//         const recentIncidentDT = DateTime.fromISO(recentIncident.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));
//         const totalIncidents = reports.count();

//         return Map({
//           recentIncidentDT,
//           totalIncidents,
//         });
//       });

//     yield put(getRecentIncidents.success(action.id, recentIncidentsByEKID));
//   }
//   catch (error) {
//     yield put(getRecentIncidents.failure(action.id));
//   }
// }

// export function* getRecentIncidentsWatcher() :Generator<any, any, any> {
//   yield takeLatest(GET_RECENT_INCIDENTS, getRecentIncidentsWorker);
// }

function* searchLBPeopleWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    yield put(searchLBPeople.request(action.id, { searchInputs }));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);
    const dobPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_DOB_FQN]);

    const searchFields = [];
    const updateSearchField = (searchTerm :string, property :string) => {
      searchFields.push({
        searchTerm,
        property,
        exact: true
      });
    };

    const firstName :string = searchInputs.get('firstName', '').trim();
    const lastName :string = searchInputs.get('lastName', '').trim();
    const dob :string = searchInputs.get('dob');

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID);
    }
    const dobDT = DateTime.fromISO(dob);
    if (dobDT.isValid) {
      updateSearchField(dobDT.toISODate(), dobPTID);
    }

    const searchOptions = {
      searchFields,
      start,
      maxHits
    };

    const entitySetId = getPeopleESId(app);

    const { data, error } = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId,
        searchOptions
      })
    );

    if (error) throw error;

    const hits = fromJS(data.hits)
      .sortBy((entity) => entity.getIn([FQN.PERSON_LAST_NAME_FQN]));

    const peopleEKIDs = hits.map((person) => person.getIn([OPENLATTICE_ID_FQN, 0]));

    yield put(searchLBPeople.success(action.id, { hits, totalHits: data.numHits }));
    if (!peopleEKIDs.isEmpty()) {
      yield put(getLBPeoplePhotos(peopleEKIDs));
      // yield put(getRecentIncidents(peopleEKIDs));
    }
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchLBPeople.failure(action.id, error));
  }
}

export function* searchLBPeopleWatcher() :Generator<*, *, *> {
  yield takeEvery(SEARCH_LB_PEOPLE, searchLBPeopleWorker);
}
