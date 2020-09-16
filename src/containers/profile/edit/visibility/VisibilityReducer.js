// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getProfileVisibility,
  putProfileVisibility,
} from './VisibilityActions';

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  fetchState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

const profileVisibilityReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getProfileVisibility.case(action.type): {
      return getProfileVisibility.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('data', action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case putProfileVisibility.case(action.type): {
      return putProfileVisibility.reducer(state, action, {
        REQUEST: () => state
          .set('data', action.value)
          .set('updateState', RequestStates.PENDING),
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default profileVisibilityReducer;
