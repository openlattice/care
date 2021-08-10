// @flow

import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { RESET_EXPORT_CRISIS_XML, exportCrisisCSVByDateRange, exportCrisisXMLByDateRange } from './ExportActions';

const INITIAL_STATE :Map = fromJS({
  errors: List(),
  fetchState: RequestStates.STANDBY,
  filename: '',
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case exportCrisisXMLByDateRange.case(action.type): {
      return exportCrisisXMLByDateRange.reducer(state, action, {
        REQUEST: () => state
          .set('errors', INITIAL_STATE.get('errors'))
          .set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const { errors, filename, skipped } = action.value;
          const SKIPPED_COUNT = `Failed to load ${skipped.length} reports.`;
          const allErrors = skipped.length ? errors.push(SKIPPED_COUNT) : errors;
          return state
            .set('errors', allErrors)
            .set('filename', filename)
            .set('fetchState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case exportCrisisCSVByDateRange.case(action.type): {
      return exportCrisisCSVByDateRange.reducer(state, action, {
        REQUEST: () => state
          .set('errors', INITIAL_STATE.get('errors'))
          .set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const { errors, filename, skipped } = action.value;
          const SKIPPED_COUNT = `Failed to load ${skipped.length} reports.`;
          const allErrors = skipped.length ? errors.push(SKIPPED_COUNT) : errors;
          return state
            .set('errors', allErrors)
            .set('filename', filename)
            .set('fetchState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case RESET_EXPORT_CRISIS_XML: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}
