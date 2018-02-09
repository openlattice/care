/*
 * @flow
 */

import Immutable from 'immutable';

import { loadHospitals } from './AppActionFactory';

const INITIAL_STATE :Map<*, *> = Immutable.List();

export default function hospitalsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case loadHospitals.case(action.type): {
      return loadHospitals.reducer(state, action, {
        SUCCESS: () => Immutable.fromJS(action.value),
        FAILURE: () => INITIAL_STATE
      });
    }

    default:
      return state;
  }
}
