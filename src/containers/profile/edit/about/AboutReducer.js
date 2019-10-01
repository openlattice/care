// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { getAboutPlan, updateAboutPlan } from './AboutActions';

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  updateState: RequestStates.STANDBY,
});

const AboutReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getAboutPlan.case(action.type): {
      return getAboutPlan.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case updateAboutPlan.case(action.type): {
      return updateAboutPlan.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], properties);
        },
        SUCCESS: () => state
          .mergeDeep(action.value)
          .set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default AboutReducer;
