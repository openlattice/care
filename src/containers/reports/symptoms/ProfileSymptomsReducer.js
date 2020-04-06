// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  getAllSymptomsReports,
} from './SymptomsReportActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  data: List(),
  recentSymptoms: false
});

export default function symptomsReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case getAllSymptomsReports.case(action.type): {
      return getAllSymptomsReports.reducer(state, action, {
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
