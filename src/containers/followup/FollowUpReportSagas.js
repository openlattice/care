/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { List, Map } from 'immutable';
import { Models } from 'lattice';
import { DataIntegrationApiActions, DataIntegrationApiSagas } from 'lattice-sagas';

import { APP_TYPES_FQNS, STRING_ID_FQN } from '../../shared/Consts';
import { PERSON_ID_FQN } from '../../edm/DataModelFqns';

import {
  CLINICIAN_NAME_VAL,
  DATE_VAL,
  OFFICER_NAME_VAL,
  OFFICER_SEQ_ID_VAL,
  REASON_VAL,
  SUMMARY_VAL,
} from './FollowUpReportConstants';

import {
  SUBMIT_FOLLOW_UP_REPORT,
  submitFollowUpReport
} from './FollowUpReportActionFactory';

const { FullyQualifiedName } = Models;

const { createEntityAndAssociationData } = DataIntegrationApiActions;
const { createEntityAndAssociationDataWorker } = DataIntegrationApiSagas;

const {
  APPEARS_IN_FQN,
  FOLLOW_UP_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

/*
 * helpers
 */

function prepReportEntityData(
  reportInfo :Object,
  consumer :Map<*, *>,
  neighbor :Map<*, *>,
  entitySetId :string,
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
    'event.comments': reportInfo[SUMMARY_VAL],
    'health.staff': reportInfo[CLINICIAN_NAME_VAL],
    [PERSON_ID_FQN]: consumer.getIn([PERSON_ID_FQN, 0])
  };

  const details = {};
  propertyTypes.forEach((propertyType :Map<*, *>) => {
    const id :string = propertyType.get('id');
    const fqn :FullyQualifiedName = new FullyQualifiedName(propertyType.get('type'));
    const value = propertyTypeFqnToValuesMap[fqn.toString()];
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
  };

  return { details, key };
}

function prepAppearsInEntityData(
  consumer :Map<*, *>,
  reportData :Object,
  appearsInEntitySetId,
  peopleEntitySetId,
  propertyTypes :List
) :Object {

  const consumerIdentification = consumer.getIn([PERSON_ID_FQN, 0]);
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
  };

  return {
    details,
    key,
    dst: reportData.key,
    src: {
      entityId: consumerEntityId,
      entitySetId: peopleEntitySetId,
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

    const {
      app,
      consumer,
      neighbor,
      reportInfo
    } = action.value;

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

    const reportESId :string = app.getIn([
      FOLLOW_UP_REPORT_FQN.toString(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const reportPKPropertyTypeIds :List<string> = app.getIn(
      [FOLLOW_UP_REPORT_FQN.toString(), 'primaryKeys'],
      List()
    ).valueSeq();

    const reportPropertyTypes :Map<*, *> = app.getIn(
      [FOLLOW_UP_REPORT_FQN.toString(), 'propertyTypes'],
      Map()
    ).valueSeq();

    /*
     * 1. prepare entity data for submission
     */

    const reportData :Object = prepReportEntityData(
      reportInfo,
      consumer,
      neighbor,
      reportESId,
      reportPKPropertyTypeIds,
      reportPropertyTypes
    );

    const appearsInData :Object = prepAppearsInEntityData(
      consumer,
      reportData,
      appearsInESId,
      peopleESId,
      appearsInPropertyTypes
    );

    /*
     * 2. write entity data
     */

    const response :Response = yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData({
        associations: [appearsInData],
        entities: [reportData],
      })
    );

    if (response.error) {
      throw new Error(response.error);
    }

    yield put(submitFollowUpReport.success(action.id));
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
