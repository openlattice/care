// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  SELECT_PERSON,
  createMissingPersonDetails,
  getBasics,
  updateBasics,
} from '../actions/BasicInformationActions';

const { PERSON_DETAILS_FQN } = APP_TYPES_FQNS;

const INITIAL_STATE :Map = fromJS({
  [PERSON_DETAILS_FQN]: Map(),
  data: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  updateState: RequestStates.STANDBY,
});

const basicsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {

  switch (action.type) {

    case createMissingPersonDetails.case(action.type): {
      return createMissingPersonDetails.reducer(state, action, {
        SUCCESS: () => {
          const { entityIndexToIdMap } = action.value;
          return state.mergeDeepIn(['entityIndexToIdMap'], entityIndexToIdMap);
        }
      });
    }

    case getBasics.case(action.type): {
      return getBasics.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case updateBasics.case(action.type): {
      return updateBasics.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], fromJS(properties));
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    case SELECT_PERSON:
      return state.set('data', fromJS(action.value));

    default:
      return state;
  }
};

export default basicsReducer;
