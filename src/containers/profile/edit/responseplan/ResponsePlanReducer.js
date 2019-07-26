// @flow
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';

const INITIAL_STATE :Map = fromJS({
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  interactionStrategies: List(),
  data: Map(),
  updateResponsePlan: RequestStates.STANDBY,
});

const responsePlanReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getResponsePlan.case(action.type): {
      return getResponsePlan.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            formData,
            interactionStrategies,
            responsePlan,
          } = action.value;

          return state
            .set('data', responsePlan)
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .set('fetchState', RequestStates.SUCCESS)
            .set('formData', formData)
            .set('interactionStrategies', interactionStrategies);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case submitResponsePlan.case(action.type): {
      return submitResponsePlan.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state.set('submitState', RequestStates.SUCCESS),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case updateResponsePlan.case(action.type): {
      return updateResponsePlan.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { path, formData } = action.value;
          return state
            .set('updateState', RequestStates.SUCCESS)
            .setIn(['formData', ...path], formData);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default responsePlanReducer;
