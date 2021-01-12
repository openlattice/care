// @flow
import {
  all,
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { EXPORT_CRISIS_XML, exportCrisisXML } from './ExportActions';
import { generateXMLFromReportData } from './ExportUtils';

import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDsFromApp } from '../../../utils/AppUtils';
import { getEntityKeyId, groupNeighborsByFQNs } from '../../../utils/DataUtils';
import { ERR_UNEXPECTED } from '../../../utils/Errors';
import { NEIGHBOR_DETAILS, NEIGHBOR_ID } from '../../../utils/constants/EntityConstants';
import { getChargeEvents } from '../crisis/CrisisActions';
import { getChargeEventsWorker } from '../crisis/CrisisReportSagas';

const LOG = new Logger('ExportSagas');

const {
  CHARGE_EVENT_FQN,
  CHARGE_FQN,
  CRISIS_REPORT_CLINICIAN_FQN,
  CRISIS_REPORT_FQN,
  DISPOSITION_FQN,
  GENERAL_PERSON_FQN,
  INCIDENT_FQN,
  OFFENSE_FQN,
  PART_OF_FQN,
  PEOPLE_FQN,
  PERSON_DETAILS_FQN,
  REPORTED_FQN,
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* exportCrisisXMLWorker(action :SequenceAction) :Saga<void> {
  try {
    yield put(exportCrisisXML.request(action.id));
    const app :Map = yield select((state) => state.get('app', Map()));
    const clinicianReportData :Map = yield select(
      (state) => state.getIn(['crisisReport', CRISIS_REPORT_CLINICIAN_FQN])
    );
    const selectedOrganizationId = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));
    const title = yield select(
      (state) => state.getIn(['app', 'organizations', selectedOrganizationId, 'title'], '').split(' ')[0]
    );

    const person :Map = yield select((state) => state.getIn(['crisisReport', 'subjectData']));
    const subjectEKID = getEntityKeyId(person);

    if (!clinicianReportData || !subjectEKID) throw ERR_UNEXPECTED;

    const incident = clinicianReportData.getIn([INCIDENT_FQN, 0, NEIGHBOR_DETAILS]);
    const incidentEKID = getEntityKeyId(incident);

    const entitySetFQNs = [
      CRISIS_REPORT_FQN,
      INCIDENT_FQN,
      PART_OF_FQN,
      PEOPLE_FQN,
      PERSON_DETAILS_FQN,
      REPORTED_FQN,
      // officer report contents
      CHARGE_FQN,
      DISPOSITION_FQN,
      GENERAL_PERSON_FQN,
      OFFENSE_FQN,
    ];

    const [
      crisisReportESID,
      incidentESID,
      partOfESID,
      peopleESID,
      personDetailsESID,
      reportedESID,
      ...neighborESIDs
    ] = getESIDsFromApp(app, entitySetFQNs);

    const personDetailsRequest = call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: peopleESID,
        filter: {
          entityKeyIds: [subjectEKID],
          edgeEntitySetIds: [reportedESID],
          destinationEntitySetIds: [personDetailsESID],
          sourceEntitySetIds: [],
        },
      })
    );

    const reportRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: incidentESID,
        filter: {
          entityKeyIds: [incidentEKID],
          edgeEntitySetIds: [partOfESID],
          destinationEntitySetIds: [crisisReportESID],
          sourceEntitySetIds: [],
        },
      })
    );

    const [personDetailsResponse, reportResponse] = yield all([
      personDetailsRequest,
      reportRequest,
    ]);

    const personDetails = fromJS(personDetailsResponse.data || {})
      .getIn([subjectEKID, 0, NEIGHBOR_DETAILS], Map());
    const crisisReport = fromJS(reportResponse.data || {})
      .getIn([incidentEKID, 0, NEIGHBOR_DETAILS], Map());
    const crisisReportEKID = getEntityKeyId(crisisReport);

    const neighborsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId: crisisReportESID,
        filter: {
          entityKeyIds: [crisisReportEKID],
          edgeEntitySetIds: [partOfESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [...neighborESIDs],
        },
      })
    );

    const neighbors = fromJS(neighborsResponse.data || {}).get(crisisReportEKID) || List();
    const appTypeFqnsByIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds']).flip());
    const neighborsByFQN = groupNeighborsByFQNs(neighbors, appTypeFqnsByIds);
    const chargeEKIDs = neighborsByFQN
      .get(CHARGE_FQN, List())
      .map((charge) => charge.get(NEIGHBOR_ID))
      .toJS();

    const chargeEventsResponse = yield call(
      getChargeEventsWorker,
      getChargeEvents(chargeEKIDs)
    );

    const chargeEventsData = chargeEKIDs
      .map((chargeEKID) => chargeEventsResponse.data.getIn([chargeEKID, 0], Map()));

    const crisisReportData = neighborsByFQN
      .set(CHARGE_EVENT_FQN.toString(), chargeEventsData);

    const payload = generateXMLFromReportData({
      clinicianReportData,
      crisisReportData,
      person,
      personDetails,
      title,
    });

    yield put(exportCrisisXML.success(action.id, payload));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exportCrisisXML.failure(action.id, error));
  }
  finally {
    yield put(exportCrisisXML.finally(action.id));

  }
}

function* exportCrisisXMLWatcher() :Saga<void> {
  yield takeLatest(EXPORT_CRISIS_XML, exportCrisisXMLWorker);
}

export {
  exportCrisisXMLWorker,
  exportCrisisXMLWatcher,
};
