// @flow
import { Map, fromJS } from 'immutable';
import {
  getCurrentUserStaffMemberData
} from './StaffActions';
import RequestStates from '../../utils/constants/RequestStates';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.PRE_REQUEST,
  currentUserStaffMemberData: Map(),
});

export default function staffReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case getCurrentUserStaffMemberData.case(action.type): {
      return getCurrentUserStaffMemberData.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.IS_REQUESTING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.REQUEST_SUCCESS)
          .set('currentUserStaffMemberData', fromJS(action.value)),
        FAILURE: () => state.set('fetchState', RequestStates.REQUEST_FAILURE),
      });
    }

    default:
      return state;
  }
}
