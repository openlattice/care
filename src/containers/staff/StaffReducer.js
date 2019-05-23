// @flow
import { RequestStates } from 'redux-reqseq';
import { Map, fromJS } from 'immutable';
import {
  getCurrentUserStaffMemberData
} from './StaffActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  currentUserStaffMemberData: Map(),
});

export default function staffReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case getCurrentUserStaffMemberData.case(action.type): {
      return getCurrentUserStaffMemberData.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('currentUserStaffMemberData', fromJS(action.value)),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
