/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import * as Routes from '../../core/router/Routes';
import { submitCrisisReport } from './CrisisActionFactory';

export const SUBMISSION_STATES = {
  PRE_SUBMIT: 0,
  IS_SUBMITTING: 1,
  SUBMIT_SUCCESS: 2,
  SUBMIT_FAILURE: 3
};

const INITIAL_STATE :Map<*, *> = fromJS({
  submissionState: SUBMISSION_STATES.PRE_SUBMIT
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case submitCrisisReport.case(action.type): {
      return submitCrisisReport.reducer(state, action, {
        REQUEST: () => {
          return state.set('submissionState', SUBMISSION_STATES.IS_SUBMITTING);
        },
        SUCCESS: () => {
          return state.set('submissionState', SUBMISSION_STATES.SUBMIT_SUCCESS);
        },
        FAILURE: () => {
          return state.set('submissionState', SUBMISSION_STATES.SUBMIT_FAILURE);
        }
      });
    }

    // TODO: this feels hacky
    case LOCATION_CHANGE: {

      const { payload } = action;
      const submissionState = state.get('submissionState');
      const { PRE_SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS } = SUBMISSION_STATES;

      // we need to reset submissionState after successful submission and routing to /home, or a failed submission
      if (payload.pathname === Routes.HOME_PATH) {
        if (submissionState === SUBMIT_SUCCESS || submissionState === SUBMIT_FAILURE) {
          return state.set('submissionState', PRE_SUBMIT);
        }
      }

      return state;
    }

    default:
      return state;
  }
}
