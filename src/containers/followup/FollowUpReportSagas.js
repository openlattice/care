/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import Immutable from 'immutable';
import { Models } from 'lattice';
import { DataApiActionFactory, SyncApiActionFactory } from 'lattice-sagas';
import { all, put, take, takeEvery } from 'redux-saga/effects';

import {
  APP_TYPES_FQNS,
  NC_SUBJ_ID_FQN,
  STRING_ID_FQN
} from '../../shared/Consts';

import {
  CLINICIAN_NAME_VAL,
  DATE_VAL,
  OFFICER_NAME_VAL,
  OFFICER_SEQ_ID_VAL,
  REASON_VAL,
  SUMMARY_VAL,
  TIME_VAL
} from './FollowUpReportConstants';

import {
  SUBMIT_FOLLOW_UP_REPORT,
  submitFollowUpReport
} from './FollowUpReportActionFactory';

const { FullyQualifiedName } = Models;

const {
  acquireSyncTicket,
  createEntityAndAssociationData
} = DataApiActionFactory;

const {
  getCurrentSyncId
} = SyncApiActionFactory;

const {
  APPEARS_IN_FQN,
  FOLLOW_UP_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

/*
 * helpers
 */

function takeReqSeqSuccessFailure(reqseq :RequestSequence, seqAction :SequenceAction) {
  return take(
    (anAction :Object) => {
      return (anAction.type === reqseq.SUCCESS && anAction.id === seqAction.id)
        || (anAction.type === reqseq.FAILURE && anAction.id === seqAction.id);
    }
  );
}

function prepReportEntityData(
  reportInfo :Object,
  consumer :Map<*, *>,
  neighbor :Map<*, *>,
  entitySetId :string,
  syncId :string,
  pkPropertyTypeIds :List<string>,
  propertyTypes :List<Map<*, *>>,
) :Object {

  /*
   * details
   */

  // TODO: this is terrible, need to rewrite

  const propertyTypeFqnToValuesMap = {
    'bhr.complaintNumber': neighbor.getIn(['neighborDetails', 'bhr.complaintNumber', 0]),
    'bhr.dateReported': reportInfo[DATE_VAL],
    // 'bhr.emotionalState': null,
    'bhr.followupreason': reportInfo[REASON_VAL],
    'bhr.officerName': reportInfo[OFFICER_NAME_VAL],
    'bhr.officerSeqID': reportInfo[OFFICER_SEQ_ID_VAL],
    'bhr.timeReported': reportInfo[TIME_VAL],
    'event.comments': reportInfo[SUMMARY_VAL],
    'health.staff': reportInfo[CLINICIAN_NAME_VAL],
    [NC_SUBJ_ID_FQN]: consumer.getIn([NC_SUBJ_ID_FQN, 0])
  };

  const details = {};
  propertyTypes.forEach((propertyType :Map<*, *>) => {
    const id :string = propertyType.get('id');
    const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.get('type'));
    const value = propertyTypeFqnToValuesMap[fqn.getFullyQualifiedName()];
    if (value !== null && value !== undefined && value !== '') {
      details[id] = [value];
    }
  });

  const entityId :string = pkPropertyTypeIds
    .map((pkPropertyTypeId :string) => {
      if (details[pkPropertyTypeId]) {
        const value :any = details[pkPropertyTypeId][0];
        return btoa(encodeURI(value));
      }
      return btoa('');
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

function prepAppearsInEntityData(
  consumer :Map<*, *>,
  reportData :Object,
  appearsInEntitySetId,
  appearsInSyncId,
  peopleEntitySetId,
  peopleSyncId,
  propertyTypes :List
) :Object {

  const consumerIdentification = consumer.getIn([NC_SUBJ_ID_FQN, 0]);
  const consumerEntityId = btoa(consumerIdentification);

  /*
   * details
   */

  const idPropertyType :Map<*, *> = propertyTypes.find((propertyType :Map<*, *>) => {
    return FullyQualifiedName.toString(propertyType.get('type')) === STRING_ID_FQN;
  });

  const details = {
    [idPropertyType.get('id')]: [consumerIdentification]
  };

  /*
   * key
   */

  const key = {
    entityId: consumerEntityId,
    entitySetId: appearsInEntitySetId,
    syncId: appearsInSyncId
  };

  return {
    details,
    key,
    dst: reportData.key,
    src: {
      entityId: consumerEntityId,
      entitySetId: peopleEntitySetId,
      syncId: peopleSyncId
    }
  };
}

/*
 * sagas
 */

function* submitFollowUpReportWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_FOLLOW_UP_REPORT, submitFollowUpReportWorker);
}

function* submitFollowUpReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(submitFollowUpReport.request(action.id));

    let anyErrors :boolean = false;
    let errorValue :any;

    const {
      app,
      consumer,
      neighbor,
      reportInfo
    } = action.value;

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

    const reportESId :string = app.getIn([
      FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const reportPKPropertyTypeIds :List<string> = app.getIn(
      [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'primaryKeys'],
      Immutable.List()
    ).valueSeq();

    const reportPropertyTypes :Map<*, *> = app.getIn(
      [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'propertyTypes'],
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

    const reportSyncTicketAction :SequenceAction = acquireSyncTicket({
      entitySetId: reportESId,
      syncId: syncIds[reportESId]
    });

    yield all([
      put(appearsInSyncTicketAction),
      put(reportSyncTicketAction)
    ]);

    const syncTicketResponseActions :SequenceAction[] = yield all([
      takeReqSeqSuccessFailure(acquireSyncTicket, appearsInSyncTicketAction),
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
      reportInfo,
      consumer,
      neighbor,
      reportESId,
      syncIds[reportESId],
      reportPKPropertyTypeIds,
      reportPropertyTypes
    );

    const appearsInData :Object = prepAppearsInEntityData(
      consumer,
      reportData,
      appearsInESId,
      syncIds[appearsInESId],
      peopleESId,
      syncIds[peopleESId],
      appearsInPropertyTypes
    );

    /*
     * 4. write entity data
     */

    const createAction :SequenceAction = createEntityAndAssociationData({
      associations: [appearsInData],
      entities: [reportData],
      syncTickets: ticketIds
    });

    yield put(createAction);
    const createResponseAction :SequenceAction = yield takeReqSeqSuccessFailure(
      createEntityAndAssociationData,
      createAction
    );

    if (createResponseAction.type === createEntityAndAssociationData.SUCCESS) {
      yield put(submitFollowUpReport.success(action.id));
    }
    else {
      throw new Error(createResponseAction.value);
    }
  }
  catch (error) {
    yield put(submitFollowUpReport.failure(action.id));
  }
  finally {
    yield put(submitFollowUpReport.finally(action.id));
  }
}

export {
  submitFollowUpReportWatcher,
  submitFollowUpReportWorker
};
