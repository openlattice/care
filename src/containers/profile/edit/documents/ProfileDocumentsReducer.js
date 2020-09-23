// @flow
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getProfileDocuments,
} from './ProfileDocumentsActions';

const INITIAL_STATE :Map = fromJS({
  data: List(),
  fetchState: RequestStates.STANDBY,
});

const EmergencyContactsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getProfileDocuments.case(action.type): {
      return getProfileDocuments.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default EmergencyContactsReducer;
