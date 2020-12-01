// @flow

import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { RESET_EXPORT_CRISIS_XML, exportCrisisXML } from './ExportActions';

const INITIAL_STATE :Map = fromJS({
  errors: List(),
  fetchState: RequestStates.STANDBY,
  filename: '',
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case exportCrisisXML.case(action.type): {
      return exportCrisisXML.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const { errors, filename } = action.value;
          return state
            .set('errors', errors)
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
