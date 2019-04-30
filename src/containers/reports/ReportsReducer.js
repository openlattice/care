/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import {
  getReports,
  getReport,
  updateReport,
} from './ReportsActions';
import { CLEAR_CRISIS_TEMPLATE } from '../crisis/CrisisActionFactory';
import RequestStates from '../../utils/constants/RequestStates';

const INITIAL_STATE :Map<*, *> = fromJS({
  actions: {
    deleteReport: { error: Map() },
    getReports: { error: Map() },
  },
  isDeletingReport: false,
  isFetchingReports: false,
  isUpdatingReport: false,
  fetchState: RequestStates.PRE_REQUEST,
  updateState: RequestStates.PRE_REQUEST,
  reports: List(),
  selectedReportData: Map(),
  submittedStaff: Map(),
  lastUpdatedStaff: Map()
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
          const { submittedStaff, lastUpdatedStaff } = action.value;
          return state
            .set('fetchState', RequestStates.REQUEST_SUCCESS)
            .set('submittedStaff', submittedStaff)
            .set('lastUpdatedStaff', lastUpdatedStaff);
        },
        FAILURE: () => state.set('fetchState', RequestStates.REQUEST_FAILURE),
      });
    }

    case getReports.case(action.type): {
      return getReports.reducer(state, (action :any), {
        REQUEST: () => {
          const seqAction :SequenceAction = action;
          return state
            .set('isFetchingReports', true)
            .set('selectedReportData', Map())
            .setIn(['actions', 'getReports', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {
          const seqAction :SequenceAction = action;
          if (!state.hasIn(['actions', 'getReports', seqAction.id])) {
            return state;
          }

          const { value } = seqAction;
          if (value === null || value === undefined) {
            // TODO: perhaps set error state?
            return state;
          }

          return state.set('reports', fromJS(value));
        },
        FAILURE: () => state.set('reports', List()),
        FINALLY: () => {
          const seqAction :SequenceAction = action;
          return state
            .set('isFetchingReports', false)
            .deleteIn(['actions', 'getReports', seqAction.id]);
        },
      });
    }

    case updateReport.case(action.type): {
      return updateReport.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.IS_REQUESTING),
        SUCCESS: () => state.set('updateState', RequestStates.REQUEST_SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.REQUEST_FAILURE),
      });
    }

    default:
      return state;
  }
}
