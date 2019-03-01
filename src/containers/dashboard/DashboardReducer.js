/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { Map, fromJS } from 'immutable';

import * as Routes from '../../core/router/Routes';
import { loadDashboardData } from './DashboardActionFactory';

/*
 * TODO: use an actual state machine - https://github.com/davestewart/javascript-state-machine
 */

// TODO: stop copying things
export const SUBMISSION_STATES = {
  PRE_SUBMIT: 0,
  IS_SUBMITTING: 1,
  SUBMIT_SUCCESS: 2,
  SUBMIT_FAILURE: 3
};

const INITIAL_STATE :Map<*, *> = fromJS({
  submissionState: SUBMISSION_STATES.PRE_SUBMIT,
  dashboardCounts: Map(),
  summaryStats :Map()
});

export default function dashboardReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case loadDashboardData.case(action.type): {
      return loadDashboardData.reducer(state, action, {
        REQUEST: () => {
          return state.set('submissionState', SUBMISSION_STATES.IS_SUBMITTING);
        },
        SUCCESS: () => {
          const { dashboardCounts, summaryStats } = action.value;
          return state
            .set('submissionState', SUBMISSION_STATES.SUBMIT_SUCCESS)
            .set('summaryStats', fromJS(summaryStats))
            .set('dashboardCounts', fromJS(dashboardCounts))
        },
        FAILURE: () => {
          return state.set('submissionState', SUBMISSION_STATES.SUBMIT_FAILURE);
        }
      });
    }

    default:
      return state;
  }
}
