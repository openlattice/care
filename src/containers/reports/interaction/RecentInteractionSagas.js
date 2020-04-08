// @flow
import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeLatest
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  getIn
} from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_RECENT_INTERACTIONS,
  SUBMIT_RECENT_INTERACTION,
  getRecentInteractions,
  submitRecentInteraction,
} from './RecentInteractionActions';

import Logger from '../../../utils/Logger';
import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../../shared/Consts';
import { getESIDFromApp } from '../../../utils/AppUtils';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { isValidUuid } from '../../../utils/Utils';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;
const { createAssociations } = DataApiActions;
const { createAssociationsWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const LOG = new Logger('InteractionSagas');

function* getRecentInteractionsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getRecentInteractions.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, APP.PEOPLE_FQN);
    const staffESID :UUID = getESIDFromApp(app, APP.STAFF_FQN);
    const interactedWithESID :UUID = getESIDFromApp(app, APP.INTERACTED_WITH_FQN);

    const interactedSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [interactedWithESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [staffESID]
      }
    };

    const interactedResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(interactedSearchParams),
    );

    if (interactedResponse.error) throw interactedResponse.error;
    const staff = fromJS(interactedResponse.data).get(entityKeyId, List());
    const recentStaffIds = new Set();
    const recentStaff :List = staff
      // filter for interactions within 2 weeks
      .filter((member) => {
        const datetimeStr = member.getIn(['associationDetails', FQN.CONTACT_DATE_TIME_FQN, 0]);

        const contactDateTime = DateTime.fromISO(datetimeStr);
        if (!contactDateTime.isValid) return false;

        const now = DateTime.local();
        const { days = 0 } = contactDateTime.until(now).toDuration(['days'])
          .toObject();

        return days < 14;
      })
      // sort staff by most recent interaction
      .sortBy((member) => {
        const datetimeStr = member.getIn(['associationDetails', FQN.CONTACT_DATE_TIME_FQN, 0]);
        const contactDateTime = DateTime.fromISO(datetimeStr);
        return -contactDateTime.valueOf();
      })
      // filter for unique staff
      .filter((member) => {
        const staffId = member.get('neighborId');
        if (!recentStaffIds.has(staffId)) {
          recentStaffIds.add(staffId);
          return true;
        }
        return false;
      });

    yield put(getRecentInteractions.success(action.id, recentStaff));
  }
  catch (error) {
    response.error = error;
    LOG.error(error);
    yield put(getRecentInteractions.failure(action.id, error));
  }
  return response;
}

function* getRecentInteractionsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_RECENT_INTERACTIONS, getRecentInteractionsWorker);
}

function* submitRecentInteractionWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitRecentInteraction.request(action.id));
    const { formData, selectedPerson } = value;

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));
    const interactedWithESID :UUID = getESIDFromApp(app, APP.INTERACTED_WITH_FQN);
    const staffESID :UUID = getESIDFromApp(app, APP.STAFF_FQN);
    const peopleESID :UUID = getESIDFromApp(app, APP.PEOPLE_FQN);
    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.DATE_TIME_FQN]);
    const contactDatetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.CONTACT_DATE_TIME_FQN]);

    const staffEKID :UUID = yield select(
      (state) => state.getIn(['staff', 'currentUser', 'data', FQN.OPENLATTICE_ID_FQN, 0], '')
    );

    if (!isValidUuid(staffEKID)) {
      throw Error('staff entityKeyId is invalid');
    }

    const personEntityKeyId = getEntityKeyId(selectedPerson);
    const contactAddressKey = getEntityAddressKey(0, APP.INTERACTED_WITH_FQN, FQN.CONTACT_DATE_TIME_FQN);
    const contactDateTime = getIn(formData, [getPageSectionKey(1, 1), contactAddressKey]);

    const now = DateTime.local().toISO();
    const associations = {
      [interactedWithESID]: [{
        dst: {
          entityKeyId: personEntityKeyId,
          entitySetId: peopleESID,
        },
        src: {
          entityKeyId: staffEKID,
          entitySetId: staffESID,
        },
        data: {
          [datetimePTID]: [now],
          [contactDatetimePTID]: [contactDateTime]
        }
      }]
    };

    const interactionResponse = yield call(
      createAssociationsWorker,
      createAssociations(associations)
    );

    if (interactionResponse.error) throw interactionResponse.error;

    yield put(submitRecentInteraction.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitRecentInteraction.failure(action.id, error));
  }
  return response;
}

function* submitRecentInteractionWatcher() :Generator<any, any, any> {
  yield takeLatest(SUBMIT_RECENT_INTERACTION, submitRecentInteractionWorker);
}

export {
  getRecentInteractionsWatcher,
  getRecentInteractionsWorker,
  submitRecentInteractionWatcher,
  submitRecentInteractionWorker,
};
