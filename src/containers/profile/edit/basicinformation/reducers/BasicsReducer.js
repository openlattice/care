// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getBasics,
  updateBasics,
} from '../actions/BasicInformationActions';

const INITIAL_STATE :Map = fromJS({
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  updateState: RequestStates.STANDBY,
});

const basicsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {

  switch (action.type) {

    case getBasics.case(action.type): {
      return getBasics.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            formData,
          } = action.value;
          return state
            .set('fetchState', RequestStates.SUCCESS)
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .set('formData', formData);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case updateBasics.case(action.type): {
      return updateBasics.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], properties);
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default basicsReducer;
