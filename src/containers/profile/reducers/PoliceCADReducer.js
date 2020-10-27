/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { getProfilePoliceCAD } from '../ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  hits: List(),
  people: Map(),
});

export default function policeCadReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getProfilePoliceCAD.case(action.type): {
      return getProfilePoliceCAD.reducer(state, action, {
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
