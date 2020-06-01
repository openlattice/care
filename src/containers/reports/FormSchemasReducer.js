// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { getFormSchema } from './FormSchemasActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  schemas: Map()
});

export default function crisisReportReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case getFormSchema.case(action.type): {
      return getFormSchema.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const { type, schemas } = action.value;
          return state
            .set('fetchState', RequestStates.SUCCESS)
            .mergeIn(['schemas', type], schemas);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
