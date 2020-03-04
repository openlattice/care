// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  getCrisisReport,
} from './CrisisActions';

const INITIAL_STATE :Map = fromJS({
  formData: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
  submitState: RequestStates.STANDBY,
});

export default function crisisReportReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case getCrisisReport.case(action.type): {
      return getCrisisReport.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
