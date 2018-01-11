/*
 * @flow
 */

import Immutable from 'immutable';
import { Models } from 'lattice';
import { DataApiActionFactory, SyncApiActionFactory } from 'lattice-sagas';
import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import {
  APP_TYPES_FQNS,
  NC_SUBJ_ID_FQN,
  PERSON,
  STRING_ID_FQN
} from '../../shared/Consts';

import {
  HARD_RESTART,
  SUBMIT_REPORT,
  submitReport
} from './ReportActionFactory';

const {
  FullyQualifiedName
} = Models;

const {
  acquireSyncTicket,
  createEntityAndAssociationData
} = DataApiActionFactory;

const {
  getCurrentSyncId
} = SyncApiActionFactory;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

/*
 * helpers
 */

function prepReportEntityData(
  syncId :string,
  entitySetId :string,
  propertyTypes :List,
  primaryKeys :List,
  allInfo :Object
) :Object {

  /*
   * details
   */

  const details = {};
  propertyTypes.forEach((propertyType :Map<*, *>) => {
    const id :string = propertyType.get('id', '');
    const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.get('type', {}));
    const value = allInfo[fqn.getName()];
    let formattedValue = Array.isArray(value) ? value : [value];
    if (formattedValue.length > 0
      && (formattedValue[0] === null || formattedValue[0] === undefined || formattedValue[0] === '')
    ) {
      formattedValue = [];
    }
    details[id] = formattedValue;
  });

  // !!! HACK START !!! - this is to make data migration easier later on when the new data model is ready
  const ncSubjectIdPropertyType :Map<*, *> = propertyTypes.find((propertyType :Map<*, *>) => {
    return FullyQualifiedName.toString(propertyType.get('type', {})) === NC_SUBJ_ID_FQN;
  });

  details[ncSubjectIdPropertyType.get('id', '')] = [allInfo.identification];
  // !!! HACK END !!!

  const entityId :string = primaryKeys
    .map((keyId) => {
      const val = (details[keyId] && details[keyId][0]) ? details[keyId][0] : '';
      const utf8Val = (details[keyId].length > 0) ? encodeURI(val) : '';
      return btoa(utf8Val);
    })
    .join(',');


  /*
   * key
   */

  const key = {
    entityId,
    entitySetId,
    syncId
  };

  return { details, key };
}

function prepPeopleEntityData(
  syncId :string,
  entitySetId :string,
  propertyTypes :List,
  consumerInfo :Object
) :Object {

  const {
    age,
    dob,
    firstName,
    gender,
    identification,
    lastName,
    middleName,
    picture,
    race
  } = consumerInfo;

  /*
   * details
   */

  const props = {};
  propertyTypes.forEach((propertyType :Map<*, *>) => {
    const fqn :string = FullyQualifiedName.toString(propertyType.get('type', {}));
    props[fqn] = propertyType.get('id', '');
  });

  const details = {};
  details[props[PERSON.ID_FQN]] = [identification];
  details[props[PERSON.LAST_NAME_FQN]] = (lastName && lastName.length) ? [lastName] : [];
  details[props[PERSON.FIRST_NAME_FQN]] = (firstName && firstName.length) ? [firstName] : [];
  details[props[PERSON.MIDDLE_NAME_FQN]] = (middleName && middleName.length) ? [middleName] : [];
  details[props[PERSON.DOB_FQN]] = (dob && dob.length) ? [dob] : [];
  details[props[PERSON.SEX_FQN]] = (gender && gender.length) ? [gender] : [];
  details[props[PERSON.RACE_FQN]] = (race && race.length) ? [race] : [];
  details[props[PERSON.AGE_FQN]] = (age && age.length) ? [age] : [];
  details[props[PERSON.PICTURE_FQN]] = (picture && picture.length) ? [picture] : [];

  /*
   * key
   */

  const entityId = btoa(identification);
  const key = {
    entityId,
    entitySetId,
    syncId
  };

  return { details, key };
}

function prepAppearsInEntityData(
  syncId :string,
  entitySetId :string,
  propertyTypes :List,
  consumerInfo :Object,
  reportData :Object,
  peopleData :Object
) :Object {

  /*
   * details
   */

  const idPropertyType :Map<*, *> = propertyTypes.find((propertyType :Map<*, *>) => {
    return FullyQualifiedName.toString(propertyType.get('type', {})) === STRING_ID_FQN;
  });

  const details = {
    [idPropertyType.get('id', '')]: [consumerInfo.identification]
  };

  /*
   * key
   */

  const entityId = btoa(consumerInfo.identification);
  const key = {
    entityId,
    entitySetId,
    syncId
  };

  return {
    details,
    key,
    dst: reportData.key,
    src: peopleData.key
  };
}

function takeReqSeqSuccessFailure(reqseq :RequestSequence, seqAction :SequenceAction) {
  return take(
    (anAction :Object) => {
      return (anAction.type === reqseq.SUCCESS && anAction.id === seqAction.id)
        || (anAction.type === reqseq.FAILURE && anAction.id === seqAction.id);
    }
  );
}

/*
 * sagas
 */

export function* submitReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(submitReport.request(action.id));

    let anyErrors :boolean = false;
    let errorValue :any;

    const {
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo,
      app
    } = action.value;

    const allInfo = Object.assign(
      {},
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo
    );

    const selectedOrganizationId = app.get('selectedOrganization');

    const appearsInESId :string = app.getIn([
      APPEARS_IN_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const appearsInPropertyTypes :Map<*, *> = app.getIn(
      [APPEARS_IN_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Immutable.Map()
    ).valueSeq();

    const peopleESId :string = app.getIn([
      PEOPLE_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const peoplePropertyTypes :Map<*, *> = app.getIn(
      [PEOPLE_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Immutable.Map()
    ).valueSeq();

    const reportESId :string = app.getIn([
      BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const reportPrimaryKeys :List<string> = app.getIn(
      [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'primaryKeys'],
      Immutable.List()
    ).valueSeq();

    const reportPropertyTypes :Map<*, *> = app.getIn(
      [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Immutable.Map()
    ).valueSeq();

    /*
     * 1. get sync ids for each EntitySet
     */

    const appearsInSyncIdAction :SequenceAction = getCurrentSyncId(appearsInESId);
    const peopleSyncIdAction :SequenceAction = getCurrentSyncId(peopleESId);
    const reportSyncIdAction :SequenceAction = getCurrentSyncId(reportESId);

    yield all([
      put(appearsInSyncIdAction),
      put(peopleSyncIdAction),
      put(reportSyncIdAction)
    ]);

    const syncIdResponseActions :{[key :string] :SequenceAction} = yield all({
      [appearsInESId]: takeReqSeqSuccessFailure(getCurrentSyncId, appearsInSyncIdAction),
      [peopleESId]: takeReqSeqSuccessFailure(getCurrentSyncId, peopleSyncIdAction),
      [reportESId]: takeReqSeqSuccessFailure(getCurrentSyncId, reportSyncIdAction)
    });

    const syncIds :{[key :string] :string} = {};
    Object.keys(syncIdResponseActions).forEach((entitySetId :string) => {
      const syncIdResponseAction :SequenceAction = syncIdResponseActions[entitySetId];
      if (syncIdResponseAction.type === getCurrentSyncId.SUCCESS && syncIdResponseAction.value) {
        syncIds[entitySetId] = syncIdResponseAction.value;
      }
      else {
        anyErrors = true;
        errorValue = syncIdResponseAction.value;
      }
    });

    if (anyErrors) {
      throw new Error(errorValue);
    }

    /*
     * 2. acquire sync tickets
     */

    const appearsInSyncTicketAction :SequenceAction = acquireSyncTicket({
      entitySetId: appearsInESId,
      syncId: syncIds[appearsInESId]
    });

    const peopleSyncTicketAction :SequenceAction = acquireSyncTicket({
      entitySetId: peopleESId,
      syncId: syncIds[peopleESId]
    });

    const reportSyncTicketAction :SequenceAction = acquireSyncTicket({
      entitySetId: reportESId,
      syncId: syncIds[reportESId]
    });

    yield all([
      put(appearsInSyncTicketAction),
      put(peopleSyncTicketAction),
      put(reportSyncTicketAction)
    ]);

    const syncTicketResponseActions :SequenceAction[] = yield all([
      takeReqSeqSuccessFailure(acquireSyncTicket, appearsInSyncTicketAction),
      takeReqSeqSuccessFailure(acquireSyncTicket, peopleSyncTicketAction),
      takeReqSeqSuccessFailure(acquireSyncTicket, reportSyncTicketAction)
    ]);

    const ticketIds :string[] = [];
    syncTicketResponseActions.forEach((syncTicketResponseAction :SequenceAction) => {
      if (syncTicketResponseAction.type === acquireSyncTicket.SUCCESS && syncTicketResponseAction.value) {
        ticketIds.push(syncTicketResponseAction.value);
      }
      else {
        anyErrors = true;
        errorValue = syncTicketResponseAction.value;
      }
    });

    if (anyErrors) {
      throw new Error(errorValue);
    }

    /*
     * 3. prepare entity data for submission
     */

    const reportData :Object = prepReportEntityData(
      syncIds[reportESId],
      reportESId,
      reportPropertyTypes,
      reportPrimaryKeys,
      allInfo
    );

    const peopleData :Object = prepPeopleEntityData(
      syncIds[peopleESId],
      peopleESId,
      peoplePropertyTypes,
      consumerInfo
    );

    const appearsInData :Object = prepAppearsInEntityData(
      syncIds[appearsInESId],
      appearsInESId,
      appearsInPropertyTypes,
      consumerInfo,
      reportData,
      peopleData
    );

    /*
     * 4. write entity data
     */

    const createAction :SequenceAction = createEntityAndAssociationData({
      associations: [appearsInData],
      entities: [reportData, peopleData],
      syncTickets: ticketIds
    });

    yield put(createAction);
    const createResponseAction :SequenceAction = yield takeReqSeqSuccessFailure(
      createEntityAndAssociationData,
      createAction
    );

    if (createResponseAction.type === createEntityAndAssociationData.SUCCESS) {
      yield put(submitReport.success(action.id));
    }
    else {
      throw new Error(createResponseAction.value);
    }
  }
  catch (error) {
    yield put(submitReport.failure(action.id, error));
  }
  finally {
    yield put(submitReport.finally(action.id));
  }
}

export function* submitReportWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_REPORT, submitReportWorker);
}

export function* hardRestartWorker() :Generator<*, *, *> {

  // this is hacky, we can do better
  yield call(() => {
    window.location.href = `${window.location.origin}${window.location.pathname}`;
  });
}

export function* hardRestartWatcher() :Generator<*, *, *> {

  yield takeEvery(HARD_RESTART, hardRestartWorker);
}
