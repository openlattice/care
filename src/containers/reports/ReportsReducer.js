/*
 * @flow
 */

import isNumber from 'lodash/isNumber';
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';

import { getReportInFull, getReports } from './ReportsActions';

const { OPENLATTICE_ID_FQN } = Constants;

const INITIAL_STATE :Map<*, *> = fromJS({
  actions: {
    getReportInFull: { error: Map() },
    getReports: { error: Map() },
  },
  isFetchingReportInFull: false,
  isFetchingReports: false,
  reports: List(),
  selectedReportEntityKeyId: '',
  selectedReportData: Map(),
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getReportInFull.case(action.type): {
      return getReportInFull.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReportInFull', true)
            .set('selectedReportData', Map())
            .set('selectedReportEntityKeyId', seqAction.value)
            .setIn(['actions', 'getReportInFull', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {
          const seqAction :SequenceAction = (action :any);
          if (!state.hasIn(['actions', 'getReportInFull', seqAction.id])) {
            return state;
          }

          const { value } = seqAction;
          if (value === null || value === undefined) {
            // TODO: perhaps set error state?
            return state;
          }

          const selectedReportEntityKeyId :string = state.get('selectedReportEntityKeyId');
          let selectedReport :Map<*, *> = state.get('reports').find(report => (
            report.getIn([OPENLATTICE_ID_FQN, 0]) === selectedReportEntityKeyId
          ));

          if (!selectedReport || selectedReport.isEmpty()) {
            // TODO: perhaps set error state?
            return state;
          }

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
          return state.set('reports', List());
        },
        FINALLY: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReportInFull', false)
            .deleteIn(['actions', 'getReportInFull', seqAction.id]);
        },
      });
    }

    case getReports.case(action.type): {
      return getReports.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isFetchingReports', true)
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

    default:
      return state;
  }
}
