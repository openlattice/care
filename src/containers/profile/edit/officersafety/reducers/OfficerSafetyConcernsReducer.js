// @flow
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  deleteOfficerSafetyConcerns,
  getOfficerSafetyConcerns,
  submitOfficerSafetyConcerns,
  updateOfficerSafetyConcerns,
} from '../OfficerSafetyActions';

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  deleteState: RequestStates.STANDBY,
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  updateState: RequestStates.STANDBY,
});

const officerSafetyConcernsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getOfficerSafetyConcerns.case(action.type): {
      return getOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            formData,
            responsePlan,
          } = action.value;

          return state
            .set('data', responsePlan)
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .set('fetchState', RequestStates.SUCCESS)
            .set('formData', formData);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case submitOfficerSafetyConcerns.case(action.type): {
      return submitOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            formData
          } = action.value;
          return state
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .set('formData', formData)
            .set('submitState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case updateOfficerSafetyConcerns.case(action.type): {
      return updateOfficerSafetyConcerns.reducer(state, action, {
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

    case deleteOfficerSafetyConcerns.case(action.type): {
      return deleteOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => state.set('deleteState', RequestStates.PENDING),
        SUCCESS: () => {
          const { path } = action.value;
          return state
            .set('deleteState', RequestStates.SUCCESS)
            .deleteIn(['formData', ...path]);
        },
        FAILURE: () => state.set('deleteState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default officerSafetyConcernsReducer;
