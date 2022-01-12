// @flow
import { List, Map, fromJS } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  deleteInteractionStrategies,
  getAllResponsePlansExport,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';

const { getPageSectionKey } = DataProcessingUtils;

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  downloadState: RequestStates.STANDBY,
  deleteState: RequestStates.STANDBY,
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: {
    [getPageSectionKey(1, 2)]: []
  },
  interactionStrategies: List(),
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
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
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            path,
            properties,
          } = action.value;
          return state
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .setIn(['formData', ...path], fromJS(properties))
            .set('submitState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case updateResponsePlan.case(action.type): {
      return updateResponsePlan.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], fromJS(properties));
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    case deleteInteractionStrategies.case(action.type): {
      return deleteInteractionStrategies.reducer(state, action, {
        REQUEST: () => state.set('deleteState', RequestStates.PENDING),
        SUCCESS: () => {
          const { entityIndexToIdMap, path } = action.value;
          return state
            .set('deleteState', RequestStates.SUCCESS)
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .deleteIn(['formData', ...path]);
        },
        FAILURE: () => state.set('deleteState', RequestStates.FAILURE)
      });
    }

    case getAllResponsePlansExport.case(action.type): {
      return getAllResponsePlansExport.reducer(state, action, {
        REQUEST: () => state.set('downloadState', RequestStates.PENDING),
        SUCCESS: () => state.set('downloadState', RequestStates.SUCCESS),
        FAILURE: () => state.set('downloadState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
};

export default responsePlanReducer;
