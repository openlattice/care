/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { getProfileCitations } from '../ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  hits: List(),
  people: Map(),
});

export default function citationsReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getProfileCitations.case(action.type): {
      return getProfileCitations.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }

}
