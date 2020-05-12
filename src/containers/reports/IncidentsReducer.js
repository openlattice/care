/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { CLEAR_INCIDENTS, getProfileIncidents } from '../profile/actions/ReportActions';

const INITIAL_STATE :Map<*, *> = fromJS({
  fetchState: RequestStates.STANDBY,
  data: List()
});

export default function incidentsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case CLEAR_INCIDENTS: {
      return INITIAL_STATE;
    }

    case getProfileIncidents.case(action.type): {
      return getProfileIncidents.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('data', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
