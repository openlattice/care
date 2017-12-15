/*
 * @flow
 */

import Immutable from 'immutable';

import { submitFollowUpReport } from './FollowUpReportActionFactory';

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

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  submissionState: SUBMISSION_STATES.PRE_SUBMIT
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case submitFollowUpReport.case(action.type): {
      return submitFollowUpReport.reducer(state, action, {
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

    default:
      return state;
  }
}
