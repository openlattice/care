// @flow
import {
  all,
  call,
  put,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { fromJS } from 'immutable';
import { Constants } from 'lattice';

import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../utils/Logger';
import {
  getPersonData,
  getPhysicalAppearance,
} from '../../ProfileActions';
import { getPhysicalAppearanceWorker, getPersonDataWorker } from '../../ProfileSagas';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';
import {
  GET_BASIC_INFORMATION,
  UPDATE_BASIC_INFORMATION,
  getBasicInformation,
  updateBasicInformation
} from './BasicInformationActions';
import {
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';
import { constructBasicFormData, constructBasicEntityIndexToIdMap } from './BasicInformationUtils';

const LOG = new Logger('BasicInformationSagas');

const { OPENLATTICE_ID_FQN } = Constants;

function* getBasicInformationWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: personEKID } = action;
    if (!isDefined(personEKID)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getBasicInformation.request(action.id, personEKID));

    const appearanceRequest = call(
      getPhysicalAppearanceWorker,
      getPhysicalAppearance(personEKID)
    );

    const personRequest = call(
      getPersonDataWorker,
      getPersonData(personEKID)
    );

    const [personResponse, appearanceResponse] = yield all([
      personRequest,
      appearanceRequest,
    ]);

    if (personResponse.error) throw personResponse.error;
    if (appearanceResponse.error) throw appearanceResponse.error;

    const personData = fromJS(personResponse.data);
    const appearanceData = fromJS(appearanceResponse.data);
    const appearanceEKID = appearanceData.getIn([OPENLATTICE_ID_FQN, 0]);

    const formData = constructBasicFormData(personData, appearanceData);
    const entityIndexToIdMap = constructBasicEntityIndexToIdMap(personEKID, appearanceEKID);

    yield put(getBasicInformation.success(action.id, { formData, entityIndexToIdMap }));
  }
  catch (error) {
    LOG.error(error);
    yield put(getBasicInformation.failure(action.id, error));
  }
  finally {
    yield put(getBasicInformation.finally(action.id));
  }
}

function* getBasicInformationWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_BASIC_INFORMATION, getBasicInformationWorker);
}

function* updateBasicInformationWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateBasicInformation.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateBasicInformation.success(action.id));
  }
  catch (error) {
    LOG.error(error);
    yield put(updateBasicInformation.failure(action.id, error));
  }
  finally {
    yield put(updateBasicInformation.finally(action.id));
  }
}

function* updateBasicInformationWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_BASIC_INFORMATION, updateBasicInformationWorker);
}

export {
  getBasicInformationWatcher,
  getBasicInformationWorker,
  updateBasicInformationWatcher,
  updateBasicInformationWorker
};
