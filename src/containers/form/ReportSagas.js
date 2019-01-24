/*
 * @flow
 */

import randomUUID from 'uuid/v4';
import { List, Map } from 'immutable';
import { Models } from 'lattice';
import { DataIntegrationApiActionFactory, DataIntegrationApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import { APP_TYPES_FQNS, STRING_ID_FQN } from '../../shared/Consts';
import { FORM_TYPE, CONTENT_TYPE } from '../../utils/DataConstants';
import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN,
  PERSON_PICTURE_FQN,
  COMPLAINT_NUMBER_FQN,
  OL_ID_FQN,
  TYPE_FQN
} from '../../edm/DataModelFqns';

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
    const value = allInfo[fqn.toString()];
    let formattedValue = Array.isArray(value) ? value : [value];
    if (formattedValue.length > 0) {
      if (formattedValue[0] === null || formattedValue[0] === undefined || formattedValue[0] === '') {
        formattedValue = [];
      }
    }
    details[id] = formattedValue;
  });

  // !!! HACK START !!! - this is to make data migration easier later on when the new data model is ready
  const ncSubjectIdPropertyType :Map<*, *> = propertyTypes.find((propertyType :Map<*, *>) => {
    return FullyQualifiedName.toString(propertyType.get('type', {})) === PERSON_ID_FQN.toString();
  });

  details[ncSubjectIdPropertyType.get('id', '')] = [allInfo[PERSON_ID_FQN]];
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
  consumerInfo :Object,
) :Object {

  /*
   * details
   */

  const props = {};
  propertyTypes.forEach((propertyType :Map<*, *>) => {
    const fqn :string = FullyQualifiedName.toString(propertyType.get('type', {}));
    props[fqn] = propertyType.get('id', '');
  });

  const id = consumerInfo[PERSON_ID_FQN];
  const firstName = consumerInfo[PERSON_FIRST_NAME_FQN];
  const lastName = consumerInfo[PERSON_LAST_NAME_FQN];
  const middleName = consumerInfo[PERSON_MIDDLE_NAME_FQN];
  const dob = consumerInfo[PERSON_DOB_FQN];
  const race = consumerInfo[PERSON_RACE_FQN];
  const sex = consumerInfo[PERSON_SEX_FQN];
  const picture = {
    [CONTENT_TYPE]: consumerInfo[CONTENT_TYPE],
    data: consumerInfo[PERSON_PICTURE_FQN]
  };

  const details = {};
  details[props[PERSON_ID_FQN]] = [id];
  details[props[PERSON_FIRST_NAME_FQN]] = firstName ? [firstName] : [];
  details[props[PERSON_LAST_NAME_FQN]] = lastName ? [lastName] : [];
  details[props[PERSON_MIDDLE_NAME_FQN]] = middleName ? [middleName] : [];
  details[props[PERSON_DOB_FQN]] = dob ? [dob] : [];
  details[props[PERSON_RACE_FQN]] = race ? [race] : [];
  details[props[PERSON_SEX_FQN]] = sex ? [sex] : [];
  details[props[PERSON_PICTURE_FQN]] = picture ? [picture] : [];

  /*
   * key
   */

  const entityId = btoa(id);
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
    [idPropertyType.get('id', '')]: [consumerInfo[PERSON_ID_FQN]]
  };

  /*
   * key
   */

  const entityId = btoa(consumerInfo[PERSON_ID_FQN]);
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

    let formID = allInfo[OL_ID_FQN.toString()];
    if (!formID.trim().length) {
      formID = randomUUID();
    }
    allInfo[COMPLAINT_NUMBER_FQN] = formID;
    allInfo[TYPE_FQN] = FORM_TYPE.BHR;

    const selectedOrganizationId = app.get('selectedOrganizationId');

    const appearsInESId :string = app.getIn([
      APPEARS_IN_FQN.toString(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const appearsInPropertyTypes :Map<*, *> = app.getIn(
      [APPEARS_IN_FQN.toString(), 'propertyTypes'],
      Map()
    ).valueSeq();

    const peopleESId :string = app.getIn([
      PEOPLE_FQN.toString(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const peoplePropertyTypes :Map<*, *> = app.getIn(
      [PEOPLE_FQN.toString(), 'propertyTypes'],
      Map()
    ).valueSeq();

    const reportESId :string = app.getIn([
      BEHAVIORAL_HEALTH_REPORT_FQN.toString(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const reportPrimaryKeys :List<string> = app.getIn(
      [BEHAVIORAL_HEALTH_REPORT_FQN.toString(), 'primaryKeys'],
      List()
    ).valueSeq();

    const reportPropertyTypes :Map<*, *> = app.getIn(
      [BEHAVIORAL_HEALTH_REPORT_FQN.toString(), 'propertyTypes'],
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

    const response = yield call(
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
