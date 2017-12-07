/*
 * @flow
 */

import Immutable from 'immutable';
import isError from 'lodash/isError';
import { Models } from 'lattice';
import { push } from 'react-router-redux';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import * as Routes from '../../core/router/Routes';
import { APP_NAMES, NC_SUBJ_ID_FQN, PERSON, STRING_ID_FQN } from '../../shared/Consts';

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
  HARD_RESTART,
  SUBMIT_REPORT,
  submitReport
} from './ReportActionFactory';

import type { SequenceAction } from '../../core/redux/RequestSequence';

const { FullyQualifiedName } = Models;

/*
 * helpers
 */

function prepReportEntityData(syncId :string, entitySetId :string, propertyTypes :List, primaryKeys :List, allInfo :Object) :Object {

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

function prepPeopleEntityData(syncId :string, entitySetId :string, propertyTypes :List, consumerInfo :Object) :Object {

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

/*
 * sagas
 */

export function* submitReportWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(submitReport.request());

    let anyErrors :boolean = false;
    const { FORM, PEOPLE, APPEARS_IN } = APP_NAMES;
    const {
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo,
      app
    } = action.data;

    const allInfo = Object.assign(
      {},
      complainantInfo,
      consumerInfo,
      dispositionInfo,
      officerInfo,
      reportInfo
    );

    const selectedOrganizationId = app.get('selectedOrganization');
    const reportESId :string = app.getIn([FORM, 'entitySetsByOrganization', selectedOrganizationId], '');
    const peopleESId :string = app.getIn([PEOPLE, 'entitySetsByOrganization', selectedOrganizationId], '');
    const appearsInESId :string = app.getIn([APPEARS_IN, 'entitySetsByOrganization', selectedOrganizationId], '');

    const reportPropertyTypes :List = app.getIn([FORM, 'propertyTypes'], Immutable.Map()).valueSeq();
    const peoplePropertyTypes :List = app.getIn([PEOPLE, 'propertyTypes'], Immutable.Map()).valueSeq();
    const appearsInPropertyTypes :List = app.getIn([APPEARS_IN, 'propertyTypes'], Immutable.Map()).valueSeq();

    const reportPrimaryKeys :List = app.getIn([FORM, 'primaryKeys'], Immutable.Map()).valueSeq();

    // 1. get sync ids for each EntitySet
    // TODO: it's not terrible to invoke the worker sagas, but it's not ideal
    const syncIds :Object = yield all({
      [reportESId]: call(fetchCurrentSyncIdWorker, fetchCurrentSyncId({ entitySetId: reportESId })),
      [peopleESId]: call(fetchCurrentSyncIdWorker, fetchCurrentSyncId({ entitySetId: peopleESId })),
      [appearsInESId]: call(fetchCurrentSyncIdWorker, fetchCurrentSyncId({ entitySetId: appearsInESId }))
    });

    // !!! HACK !!! - quick fix
    Object.keys(syncIds).forEach((entitySetId :string) => {
      if (isError(syncIds[entitySetId])) {
        anyErrors = true;
      }
    });

    if (anyErrors) {
      throw new Error();
    }

    // 2. acquire sync tickets
    const ticketIds :string[] = yield all([
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

    // !!! HACK !!! - quick fix
    ticketIds.forEach((ticketId) => {
      if (isError(ticketId)) {
        anyErrors = true;
      }
    });

    if (anyErrors) {
      throw new Error();
    }

    // 3. prepare entity data for submission
    const reportData :Object = prepReportEntityData(syncIds[reportESId], reportESId, reportPropertyTypes, reportPrimaryKeys, allInfo);
    const peopleData :Object = prepPeopleEntityData(syncIds[peopleESId], peopleESId, peoplePropertyTypes, consumerInfo);
    const appearsInData :Object = prepAppearsInEntityData(
      syncIds[appearsInESId],
      appearsInESId,
      appearsInPropertyTypes,
      consumerInfo,
      reportData,
      peopleData
    );

    // 4. write entity data
    const response = yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData({
        associations: [appearsInData],
        entities: [reportData, peopleData],
        syncTickets: ticketIds
      })
    );

    // !!! HACK !!! - quick fix
    if (isError(response)) {
      throw new Error();
    }

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

export function* hardRestartWorker() :Generator<*, *, *> {

  // this is hacky, we can do better
  yield call(() => {
    window.location.href = `${window.location.origin}${window.location.pathname}`;
  });
}

export function* hardRestartWatcher() :Generator<*, *, *> {

  yield takeEvery(HARD_RESTART, hardRestartWorker);
}
