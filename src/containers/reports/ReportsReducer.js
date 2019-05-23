/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import {
  deleteReport,
  getReport,
  updateReport,
  getReportsByDateRange,
} from './ReportsActions';
import { CLEAR_CRISIS_TEMPLATE } from '../crisis/CrisisActionFactory';
import RequestStates from '../../utils/constants/RequestStates';

const INITIAL_STATE :Map<*, *> = fromJS({
  deleteState: RequestStates.PRE_REQUEST,
  fetchState: RequestStates.PRE_REQUEST,
  lastUpdatedStaff: Map(),
  reportsByDateRange: List(),
  submittedStaff: Map(),
  updateState: RequestStates.PRE_REQUEST,
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case CLEAR_CRISIS_TEMPLATE: {
      return INITIAL_STATE;
    }

    case getReport.case(action.type): {
      return getReport.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.IS_REQUESTING),
        SUCCESS: () => {
          const { submitted, lastUpdated } = action.value;
          return state
            .set('fetchState', RequestStates.REQUEST_SUCCESS)
            .set('submittedStaff', submitted)
            .set('lastUpdatedStaff', lastUpdated);
        },
        FAILURE: () => state.set('fetchState', RequestStates.REQUEST_FAILURE),
      });
    }

    case getReportsByDateRange.case(action.type): {
      return getReportsByDateRange.reducer(state, (action :any), {
        REQUEST: () => state.set('fetchState', RequestStates.IS_REQUESTING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.REQUEST_SUCCESS)
          .set('reportsByDateRange', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.REQUEST_FAILURE),
      });
    }

    case updateReport.case(action.type): {
      return updateReport.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.IS_REQUESTING),
        SUCCESS: () => state.set('updateState', RequestStates.REQUEST_SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.REQUEST_FAILURE),
      });
    }

    case deleteReport.case(action.type): {
      return deleteReport.reducer(state, action, {
        REQUEST: () => state.set('deleteState', RequestStates.IS_REQUESTING),
        SUCCESS: () => state.set('deleteState', RequestStates.REQUEST_SUCCESS),
        FAILURE: () => state.set('deleteState', RequestStates.REQUEST_FAILURE),
      });
    }

    default:
      return state;
  }
}
