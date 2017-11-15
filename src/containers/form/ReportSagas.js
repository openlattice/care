/*
 * @flow
 */

import Immutable from 'immutable';
import { Models } from 'lattice';
import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import { ENTITY_SET_NAMES, NC_SUBJ_ID_FQN, PERSON, STRING_ID_FQN } from '../../shared/Consts';

import {
  acquireSyncTicket,
  createEntityAndAssociationData,
  fetchCurrentSyncId
} from '../../core/lattice/LatticeActionFactory';

import {
  acquireSyncTicketWorker,
  createEntityAndAssociationDataWorker,
  fetchCurrentSyncIdWorker
} from '../../core/lattice/LatticeSagas';

import {
  SUBMIT_REPORT,
  submitReport
} from './ReportActionFactory';

import type { SequenceAction } from '../../core/redux/RequestSequence';

const { FullyQualifiedName } = Models;

/*
 * helpers
 */

function prepReportEntityData(syncId :string, entitySet :Map<*, *>, allInfo :Object) :Object {

  /*
   * details
   */

  const details = {};
  const propertyTypes :List<Map<*, *>> = entitySet.get('propertyTypes', Immutable.List());
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

  const primaryKeys :List<string> = entitySet.getIn(['entityType', 'key'], Immutable.List());
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

  const entitySetId :string = entitySet.getIn(['entitySet', 'id'], '');
  const key = {
    entityId,
    entitySetId,
    syncId
  };

  return { details, key };
}

function prepPeopleEntityData(syncId :string, entitySet :Map<*, *>, consumerInfo :Object) :Object {

  const {
    age,
    dob,
    firstName,
    gender,
    identification,
    lastName,
    middleName,
    race
  } = consumerInfo;

  /*
   * details
   */

  const props = {};
  const propertyTypes :List<Map<*, *>> = entitySet.get('propertyTypes', Immutable.List());
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

  /*
   * key
   */

  const entityId = btoa(identification);
  const entitySetId :string = entitySet.getIn(['entitySet', 'id'], '');
  const key = {
    entityId,
    entitySetId,
    syncId
  };

  return { details, key };
}

function prepAppearsInEntityData(
  syncId :string,
  entitySet :Map<*, *>,
  consumerInfo :Object,
  reportData :Object,
  peopleData :Object
) :Object {

  /*
   * details
   */

  const propertyTypes :List<Map<*, *>> = entitySet.get('propertyTypes', Immutable.List());
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
  const entitySetId :string = entitySet.getIn(['entitySet', 'id'], '');
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

/*
 * sagas
 */

export function* submitReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(submitReport.request());

    const { FORM, PEOPLE, APPEARS_IN } = ENTITY_SET_NAMES;
    const {
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      entitySets,
      officerInfo,
      reportInfo
    } = action.data;

    const allInfo = Object.assign(
      {},
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo
    );

    const reportES :Map<*, *> = entitySets.get(FORM, Immutable.Map());
    const peopleES :Map<*, *> = entitySets.get(PEOPLE, Immutable.Map());
    const appearsInES :Map<*, *> = entitySets.get(APPEARS_IN, Immutable.Map());

    const reportESId :string = reportES.getIn(['entitySet', 'id'], '');
    const peopleESId :string = peopleES.getIn(['entitySet', 'id'], '');
    const appearsInESId :string = appearsInES.getIn(['entitySet', 'id'], '');

    // 1. get sync ids for each EntitySet
    // TODO: it's not terrible to invoke the worker sagas, but it's not ideal
    const syncIds :Object = yield all({
      [reportESId]: call(fetchCurrentSyncIdWorker, fetchCurrentSyncId({ entitySetId: reportESId })),
      [peopleESId]: call(fetchCurrentSyncIdWorker, fetchCurrentSyncId({ entitySetId: peopleESId })),
      [appearsInESId]: call(fetchCurrentSyncIdWorker, fetchCurrentSyncId({ entitySetId: appearsInESId }))
    });

    // 2. acquire sync tickets
    const ticketIds :Object = yield all([
      call(
        acquireSyncTicketWorker,
        acquireSyncTicket({ entitySetId: reportESId, syncId: syncIds[reportESId] })
      ),
      call(
        acquireSyncTicketWorker,
        acquireSyncTicket({ entitySetId: peopleESId, syncId: syncIds[peopleESId] })
      ),
      call(
        acquireSyncTicketWorker,
        acquireSyncTicket({ entitySetId: appearsInESId, syncId: syncIds[appearsInESId] })
      )
    ]);

    // 3. prepare entity data for submission
    const reportData :Object = prepReportEntityData(syncIds[reportESId], reportES, allInfo);
    const peopleData :Object = prepPeopleEntityData(syncIds[peopleESId], peopleES, consumerInfo);
    const appearsInData :Object = prepAppearsInEntityData(
      syncIds[appearsInESId],
      appearsInES,
      consumerInfo,
      reportData,
      peopleData
    );

    // 4. write entity data
    yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData({
        associations: [appearsInData],
        entities: [reportData, peopleData],
        syncTickets: ticketIds
      })
    );

    yield put(submitReport.success());
  }
  catch (error) {
    yield put(submitReport.failure({ error }));
  }
  finally {
    yield put(submitReport.finally());
  }
}

export function* submitReportWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_REPORT, submitReportWorker);
}
