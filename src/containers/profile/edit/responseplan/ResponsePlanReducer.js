// @flow
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { getResponsePlan, submitResponsePlan } from './ResponsePlanActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  updateResponsePlan: RequestStates.STANDBY,
  responsePlan: Map(),
  interactionStrategies: List()
});

const responsePlanReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getResponsePlan.case(action.type): {
      return getResponsePlan.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            formData,
            interactionStrategies,
            responsePlan,
          } = action.value;

          return state
            .set('data', responsePlan)
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

    default:
      return state;
  }
};

export default responsePlanReducer;
