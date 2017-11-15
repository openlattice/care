/*
 * @flow
 */

import Immutable from 'immutable';

import { submitReport } from './ReportActionFactory';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isSubmittingReport: false,
  submissionSuccess: false
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case submitReport.case(action.type): {
      return submitReport.reducer(state, action, {
        REQUEST: () => {
          return state.set('isSubmittingReport', true);
        },
        SUCCESS: () => {
          return state.set('submissionSuccess', true);
        },
        FAILURE: () => {
          return state.set('submissionSuccess', false);
        },
        FINALLY: () => {
          return state.set('isSubmittingReport', false);
        }
      });
    }

    default:
      return state;
  }
}
