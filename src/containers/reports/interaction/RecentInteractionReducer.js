// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_RECENT_INTERACTIONS,
  getRecentInteractions,
  submitRecentInteraction,
} from './RecentInteractionActions';

const INITIAL_STATE :Map = fromJS({
  data: List(),
  fetchState: RequestStates.STANDBY,
  submitState: RequestStates.STANDBY,
});

export default function recentInteractionsReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case getRecentInteractions.case(action.type): {
      return getRecentInteractions.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('data', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case submitRecentInteraction.case(action.type): {
      return submitRecentInteraction.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state.set('submitState', RequestStates.SUCCESS),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case CLEAR_RECENT_INTERACTIONS: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
