/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';

import {
  deleteReport,
  getReportNeighbors,
  getReports,
  getReport,
  updateReport,
} from './ReportsActions';
import RequestStates from '../../utils/constants/RequestStates';

const { OPENLATTICE_ID_FQN } = Constants;

const INITIAL_STATE :Map<*, *> = fromJS({
  actions: {
    deleteReport: { error: Map() },
    getReportNeighbors: { error: Map() },
    getReports: { error: Map() },
  },
  isDeletingReport: false,
  isFetchingReports: false,
  isUpdatingReport: false,
  fetchState: RequestStates.PRE_REQUEST,
  reports: List(),
  selectedReportData: Map(),
  submittedStaff: Map(),
  lastUpdatedStaff: Map()
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

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

    case deleteReport.case(action.type): {
      return deleteReport.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isDeletingReport', true)
            .setIn(['actions', 'deleteReport', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = (action :any);
          const storedSeqAction :Map<*, *> = state.getIn(['actions', 'deleteReport', seqAction.id], Map());
          if (storedSeqAction.isEmpty()) {
            return state;
          }

          const entityKeyId :string = storedSeqAction.getIn(['value', 'entityKeyId']);
          const reports :List<Map<*, *>> = state.get('reports');
          const selectedReportIndex :number = reports
            .findIndex((report :Map<*, *>) => report.getIn([OPENLATTICE_ID_FQN, 0]) === entityKeyId);

          return state
            .set('selectedReportData', Map())
            .set('reports', reports.delete(selectedReportIndex));
        },
        FAILURE: () => {
          // TODO: need error handling
          return state;
        },
        FINALLY: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isDeletingReport', false)
            .deleteIn(['actions', 'deleteReport', seqAction.id]);
        },
      });
    }

    case getReportNeighbors.case(action.type): {
      return getReportNeighbors.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReport', true)
            .set('selectedReportData', Map())
            .setIn(['actions', 'getReportNeighbors', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = (action :any);
          const storedSeqAction :Map<*, *> = state.getIn(['actions', 'getReportNeighbors', seqAction.id], Map());
          if (storedSeqAction.isEmpty()) {
            return state;
          }

          const { value = {} } = seqAction;
          const entityKeyId :string = storedSeqAction.getIn(['value', 'entityKeyId']);
          let selectedReport :Map<*, *> = state.get('reports')
            .find(report => report.getIn([OPENLATTICE_ID_FQN, 0]) === entityKeyId, null, Map());

          fromJS(value).forEach((neighbor :Map<*, *>) => {
            neighbor.get('neighborDetails', Map()).forEach((data :List<*>, key :string) => {
              // TODO: this is probably not the best way to merge neighbor details with the report
              if (!selectedReport.has(key)) {
                selectedReport = selectedReport.set(key, data);
              }
            });
          });

          return state.set('selectedReportData', selectedReport);
        },
        FAILURE: () => {
          // TODO: need to actually handle the error
          return state;
        },
        FINALLY: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReport', false)
            .deleteIn(['actions', 'getReportNeighbors', seqAction.id]);
        },
      });
    }

    case getReports.case(action.type): {
      return getReports.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReports', true)
            .set('selectedReportData', Map())
            .setIn(['actions', 'getReports', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {
          const seqAction :SequenceAction = (action :any);
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
        FAILURE: () => {
          // TODO: need to actually handle the error
          return state.set('reports', List());
        },
        FINALLY: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReports', false)
            .deleteIn(['actions', 'getReports', seqAction.id]);
        },
      });
    }

    case updateReport.case(action.type): {
      return updateReport.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isUpdatingReport', true)
            .setIn(['actions', 'updateReport', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = (action :any);
          const storedSeqAction :Map<*, *> = state.getIn(['actions', 'updateReport', seqAction.id], Map());
          if (storedSeqAction.isEmpty()) {
            return state;
          }

          const reportEdits :Map<*, *> = storedSeqAction.getIn(['value', 'reportEdits']);
          const selectedReportData :Map<*, *> = state.get('selectedReportData');

          // not fully confident in the merge()
          return state.set('selectedReportData', selectedReportData.merge(reportEdits));
        },
        FAILURE: () => {
          // TODO: need to actually handle the error, perhaps set update state as failure?
          return state;
        },
        FINALLY: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isUpdatingReport', false)
            .deleteIn(['actions', 'updateReport', seqAction.id]);
        },
      });
    }

    default:
      return state;
  }
}
