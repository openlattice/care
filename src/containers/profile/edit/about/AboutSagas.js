// @flow
import {
  call,
  put,
  all,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  getIn,
  has,
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';
import { DateTime } from 'luxon';

import Logger from '../../../../utils/Logger';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { getResponsePlan } from '../responseplan/ResponsePlanActions';
import { getResponsePlanWorker } from '../responseplan/ResponsePlanSagas';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';
import {
  GET_ABOUT_PLAN,
  GET_RESPONSIBLE_USER,
  UPDATE_ABOUT_PLAN,
  getAboutPlan,
  getResponsibleUser,
  updateAboutPlan,
} from './AboutActions';
import { constructEntityIndexToIdMap, constructFormData } from './AboutUtils';
import {
  createOrReplaceAssociation,
  submitDataGraph,
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  createOrReplaceAssociationWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';
import { DATE_TIME_FQN } from '../../../../edm/DataModelFqns';

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { OPENLATTICE_ID_FQN } = Constants;

const {
  ASSIGNED_TO_FQN,
  PEOPLE_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('AboutSagas');

function* getResponsibleUserWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getResponsibleUser.request(action.id));
    const app :Map = yield select(state => state.get('app', Map()));
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const assignedToESID = getESIDFromApp(app, ASSIGNED_TO_FQN);

    const staffSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [assignedToESID],
        destinationEntitySetIds: [staffESID],
        sourceEntitySetIds: []
      }
    };

    const staffResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(staffSearchParams)
    );

    if (staffResponse.error) throw staffResponse.error;
    const responsibleUsers = fromJS(staffResponse.data).get(entityKeyId, List());
    if (responsibleUsers.count() > 1) {
      LOG.warn('more than one reponsible user found for person', entityKeyId);
    }

    const responsibleUser = responsibleUsers.first() || Map();

    response.data = responsibleUser;

    yield put(getResponsibleUser.success(action.id, responsibleUser));
  }
  catch (error) {
    response.error = error;
    yield put(getResponsibleUser.failure(action.id, error));
  }
  finally {
    yield put(getResponsibleUser.finally(action.id));
  }

  return response;
}

function* getResponsibleUserWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_RESPONSIBLE_USER, getResponsibleUserWorker);
}

function* getAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getAboutPlan.request(action.id, entityKeyId));

    const responsePlanRequest = call(
      getResponsePlanWorker,
      getResponsePlan(entityKeyId)
    );

    const responsibleUserRequest = call(
      getResponsibleUserWorker,
      getResponsibleUser(entityKeyId)
    );

    const [responsePlan, responsibleUser] = yield all([
      responsePlanRequest,
      responsibleUserRequest
    ]);

    if (responsePlan.error) throw responsePlan.error;
    if (responsibleUser.error) throw responsibleUser.error;

    const responsibleUserData = fromJS(responsibleUser).getIn(['data', 'neighborDetails']) || Map();
    const responsePlanEKID = getIn(responsePlan, ['data', OPENLATTICE_ID_FQN, 0]);
    const assignedToEKID = getIn(responsibleUser, ['data', 'associationDetails', OPENLATTICE_ID_FQN, 0]);
    const formData = constructFormData(fromJS(responsePlan.data), responsibleUserData);
    const entityIndexToIdMap = constructEntityIndexToIdMap(responsePlanEKID, assignedToEKID);

    // create formData and entityIndexToIdMap

    yield put(getAboutPlan.success(action.id, {
      data: responsibleUserData,
      entityIndexToIdMap,
      formData,
    }));
  }
  catch (error) {
    yield put(getAboutPlan.failure(action.id));
  }
  finally {
    yield put(getAboutPlan.finally(action.id));
  }
}

function* getAboutPlanWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ABOUT_PLAN, getAboutPlanWorker);
}

function* updateAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    // since you're changing associations, you have to delete the old association, and then create a new one

    yield put(updateAboutPlan.request(action.id, value));

    // check to see if there is a change in the officer field
    const { entityData, properties, path } = value;
    const app :Map = yield select(state => state.get('app', Map()));
    const reservedId = yield select(state => state.getIn(['edm', 'fqnToIdMap', OPENLATTICE_ID_FQN]));
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const assignedToESID = getESIDFromApp(app, ASSIGNED_TO_FQN);
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const datetimePTID :UUID = yield select(state => state.getIn(['edm', 'fqnToIdMap', DATE_TIME_FQN]));

    // get association EKID from entityIndexToIdMap
    // call delete on existing association

    if (has(entityData, staffESID)) {
      const newStaffEKID = getIn(entityData, [staffESID, 0, reservedId, 0]);
      const entityKeyId = yield select(state => state.getIn(
        ['profile', 'about', 'entityIndexToIdMap', ASSIGNED_TO_FQN, 0]
      ));
      const personEKID = yield select(state => state.getIn(
        ['profile', 'basicInformation', 'basics', 'data', OPENLATTICE_ID_FQN, 0]
      ));

      const association = {
        [assignedToESID]: [{
          data: {
            [datetimePTID]: [DateTime.local().toISO()]
          },
          dst: {
            entitySetId: staffESID,
            entityKeyId: newStaffEKID
          },
          src: {
            entitySetId: peopleESID,
            entityKeyId: personEKID
          }
        }]
      };

      const associationResponse = yield call(
        createOrReplaceAssociationWorker,
        createOrReplaceAssociation({
          association,
          entityKeyId,
          entitySetId: assignedToESID,
        })
      );

      if (associationResponse.error) throw associationResponse.error;

      // store updated value and remove from entityData,
      delete entityData[staffESID];
    }


    // if successful, submit new data graph between officer, person, and new association
    // if sucessful, call partial replace on the general.notes on response plan.
    // update formData with newly selected officer and notes
    // update entityIndexToIdMap with new assignedTo association


    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateAboutPlan.success(action.id));
  }
  catch (error) {
    LOG.error('updateAboutPlanWorker', error);
    yield put(updateAboutPlan.failure(action.id, error));
  }
  finally {
    yield put(updateAboutPlan.finally(action.id));
  }
}

function* updateAboutPlanWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_ABOUT_PLAN, updateAboutPlanWorker);
}

export {
  getAboutPlanWatcher,
  getAboutPlanWorker,
  getResponsibleUserWatcher,
  getResponsibleUserWorker,
  updateAboutPlanWatcher,
  updateAboutPlanWorker,
};
