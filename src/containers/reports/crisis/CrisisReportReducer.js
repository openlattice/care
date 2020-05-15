// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_CRISIS_REPORT,
  addOptionalCrisisReportContent,
  deleteCrisisReportContent,
  getCrisisReport,
  getCrisisReportV2,
  submitCrisisReport,
  submitCrisisReportV2,
  updateCrisisReport,
} from './CrisisActions';

const INITIAL_STATE :Map = fromJS({
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  reportData: Map(),
  reporterData: Map(),
  subjectData: Map(),
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

export default function crisisReportReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case submitCrisisReport.case(action.type): {
      return submitCrisisReport.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case submitCrisisReportV2.case(action.type): {
      return submitCrisisReportV2.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case getCrisisReport.case(action.type): {
      return getCrisisReport.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getCrisisReportV2.case(action.type): {
      return getCrisisReportV2.reducer(state, action, {
        REQUEST: () => INITIAL_STATE.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state
          .set('fetchState', RequestStates.FAILURE)
          .set('error', action.value)
      });
    }

    case updateCrisisReport.case(action.type): {
      return updateCrisisReport.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], fromJS(properties));
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE),
      });
    }

    case deleteCrisisReportContent.case(action.type): {
      return deleteCrisisReportContent.reducer(state, action, {
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

    case addOptionalCrisisReportContent.case(action.type): {
      return addOptionalCrisisReportContent.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { entityIndexToIdMap, path, properties } = action.value;
          return state
            .set('updateState', RequestStates.SUCCESS)
            .mergeDeepIn(['entityIndexToIdMap'], entityIndexToIdMap)
            .setIn(['formData', ...path], properties);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    case CLEAR_CRISIS_REPORT: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
