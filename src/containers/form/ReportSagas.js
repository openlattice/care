/*
 * @flow
 */

import { List, Map } from 'immutable';
import { Models } from 'lattice';
import { DataIntegrationApiActionFactory, DataIntegrationApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  formatDateWithTZOAsZeros,
  formatTimeWithSecondsAsZeros,
} from '../../utils/DateUtils';

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

const { FullyQualifiedName } = Models;
const { createEntityAndAssociationData } = DataIntegrationApiActionFactory;
const { createEntityAndAssociationDataWorker } = DataIntegrationApiSagas;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

/*
 * helpers
 */

function prepReportEntityData(
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
    if (formattedValue.length > 0) {
      if (formattedValue[0] === null || formattedValue[0] === undefined || formattedValue[0] === '') {
        formattedValue = [];
      }
      // !!! HACK START !!!
      else if (fqn.getName() === 'dateOccurred') {
        // HACK: temp hack. "dateOccurred" is "DateTimeOffset", but should actually just be "Date".
        formattedValue = [formatDateWithTZOAsZeros(formattedValue[0])];
      }
      else if (fqn.getName() === 'dateReported') {
        // HACK: temp hack. "dateReported" is "DateTimeOffset", but should actually just be "Date".
        formattedValue = [formatDateWithTZOAsZeros(formattedValue[0])];
      }
      else if (fqn.getName() === 'timeOccurred') {
        formattedValue = [formatTimeWithSecondsAsZeros(formattedValue[0])];
      }
      else if (fqn.getName() === 'timeReported') {
        formattedValue = [formatTimeWithSecondsAsZeros(formattedValue[0])];
      }
      // !!! HACK END !!!
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
  };

  return { details, key };
}

function prepPeopleEntityData(
  entitySetId :string,
  propertyTypes :List,
  consumerInfo :Object
) :Object {

  const {
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
  details[props[PERSON.PICTURE_FQN]] = (picture && picture.length) ? [picture] : [];

  /*
   * key
   */

  const entityId = btoa(identification);
  const key = {
    entityId,
    entitySetId,
  };

  return { details, key };
}

function prepAppearsInEntityData(
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
    yield put(submitReport.request(action.id));

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

    const selectedOrganizationId = app.get('selectedOrganizationId');

    const appearsInESId :string = app.getIn([
      APPEARS_IN_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const appearsInPropertyTypes :Map<*, *> = app.getIn(
      [APPEARS_IN_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Map()
    ).valueSeq();

    const peopleESId :string = app.getIn([
      PEOPLE_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const peoplePropertyTypes :Map<*, *> = app.getIn(
      [PEOPLE_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Map()
    ).valueSeq();

    const reportESId :string = app.getIn([
      BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const reportPrimaryKeys :List<string> = app.getIn(
      [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'primaryKeys'],
      List()
    ).valueSeq();

    const reportPropertyTypes :Map<*, *> = app.getIn(
      [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Map()
    ).valueSeq();


    /*
     * 1. prepare entity data for submission
     */

    const reportData :Object = prepReportEntityData(
      reportESId,
      reportPropertyTypes,
      reportPrimaryKeys,
      allInfo
    );

    const peopleData :Object = prepPeopleEntityData(
      peopleESId,
      peoplePropertyTypes,
      consumerInfo
    );

    const appearsInData :Object = prepAppearsInEntityData(
      appearsInESId,
      appearsInPropertyTypes,
      consumerInfo,
      reportData,
      peopleData
    );

    /*
     * 2. write entity data
     */

    const response :Response = yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData({
        associations: [appearsInData],
        entities: [reportData, peopleData],
      })
    );

    if (response.error) {
      throw new Error(response.error);
    }

    yield put(submitReport.success(action.id));
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
