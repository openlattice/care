// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { getIn } from 'immutable';
import { Constants } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../../utils/Logger';
import {
  GET_OFFICER_SAFETY,
  getOfficerSafety,
  getOfficerSafetyConcerns,
} from '../OfficerSafetyActions';
import { getResponsePlan } from '../../responseplan/ResponsePlanActions';
import { getResponsePlanWorker } from '../../responseplan/ResponsePlanSagas';
import { getOfficerSafetyConcernsWorker } from './OfficerSafetyConcernsSagas';
import { ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isValidUuid } from '../../../../../utils/Utils';

const { OPENLATTICE_ID_FQN } = Constants;
const LOG = new Logger('ProfileSagas');

function* getOfficerSafetyWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getOfficerSafety.request(action.id));

    const responsePlanResponse = yield call(
      getResponsePlanWorker,
      getResponsePlan(entityKeyId)
    );

    if (responsePlanResponse.error) throw responsePlanResponse.error;

    const responsePlanEKID = getIn(responsePlanResponse.data, [OPENLATTICE_ID_FQN, 0]);

    if (responsePlanEKID) {
      const safetyConcernsResponse = yield call(
        getOfficerSafetyConcernsWorker,
        getOfficerSafetyConcerns(responsePlanEKID)
      );
    }


    yield put(getOfficerSafety.success(action.id));
  }
  catch (error) {
    LOG.error('getOfficerSafetyWorker', error);
    yield put(getOfficerSafety.failure(action.id));
  }
  finally {
    yield put(getOfficerSafety.finally(action.id));
  }
}

function* getOfficerSafetyWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_OFFICER_SAFETY, getOfficerSafetyWorker);
}

export {
  getOfficerSafetyWorker,
  getOfficerSafetyWatcher,
};
