// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { submitRequestChanges } from './RequestChangesActions';

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

const RequestChangesReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case submitRequestChanges.case(action.type): {
      return submitRequestChanges.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state.set('submitState', RequestStates.SUCCESS),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
};

export default RequestChangesReducer;
