/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { List, Map } from 'immutable';
import { Models } from 'lattice';
import { DataIntegrationApiActionFactory } from 'lattice-sagas';
import { put, take, takeEvery } from 'redux-saga/effects';

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
  createEntityAndAssociationData
} = DataIntegrationApiActionFactory;

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

    const selectedOrganizationId = app.get('selectedOrganization');

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

    const reportESId :string = app.getIn([
      FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(),
      'entitySetsByOrganization',
      selectedOrganizationId
    ]);

    const reportPKPropertyTypeIds :List<string> = app.getIn(
      [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'primaryKeys'],
      List()
    ).valueSeq();

    const reportPropertyTypes :Map<*, *> = app.getIn(
      [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'propertyTypes'],
      Map()
    ).valueSeq();

    /*
     * 3. prepare entity data for submission
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
     * 4. write entity data
     */

    const createAction :SequenceAction = createEntityAndAssociationData({
      associations: [appearsInData],
      entities: [reportData],
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
