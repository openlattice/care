// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_RECENT_INTERACTIONS,
  getRecentInteractions,
} from './RecentInteractionActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  data: List()
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

    case CLEAR_RECENT_INTERACTIONS: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
