// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_SYMPTOMS_REPORT,
  getSymptomsReport,
  submitSymptomsReport,
  updateSymptomsReport,
} from './SymptomsReportActions';

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
    case submitSymptomsReport.case(action.type): {
      return submitSymptomsReport.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case getSymptomsReport.case(action.type): {
      return getSymptomsReport.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case updateSymptomsReport.case(action.type): {
      return updateSymptomsReport.reducer(state, action, {
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

    case CLEAR_SYMPTOMS_REPORT: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
