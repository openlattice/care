// @flow
import { RequestStates } from 'redux-reqseq';
import { Map, fromJS } from 'immutable';
import {
  getCurrentUserStaffMemberData,
  getResponsibleUserOptions,
} from './StaffActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  currentUserStaffMemberData: Map(),
  responsibleUsers: Map(),
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

    case getResponsibleUserOptions.case(action.type): {
      return getResponsibleUserOptions.reducer(state, action, {
        REQUEST: () => state.set('responsibleUsers', 'fetchState', RequestStates.PENDING),
        SUCCESS: () => state.set('responsibleUsers', 'fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('responsibleUsers', 'fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
