// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  GET_FORM_SCHEMA,
  SUBMIT_FORM_SCHEMA,
  getFormSchema,
  submitFormSchema
} from './FormSchemasActions';

import { REQUEST_STATE, RS_INITIAL_STATE, SCHEMAS } from '../../core/redux/constants';

const INITIAL_STATE :Map = fromJS({
  [GET_FORM_SCHEMA]: RS_INITIAL_STATE,
  [SUBMIT_FORM_SCHEMA]: RS_INITIAL_STATE,
  schemas: Map()
});

export default function crisisReportReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case getFormSchema.case(action.type): {
      return getFormSchema.reducer(state, action, {
        REQUEST: () => state.setIn([GET_FORM_SCHEMA, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => {
          const { type, schemas } = action.value;
          return state
            .setIn([GET_FORM_SCHEMA, REQUEST_STATE], RequestStates.SUCCESS)
            .mergeIn([SCHEMAS, type], schemas);
        },
        FAILURE: () => state.setIn([GET_FORM_SCHEMA, REQUEST_STATE], RequestStates.FAILURE),
      });
    }

    case submitFormSchema.case(action.type): {
      return submitFormSchema.reducer(state, action, {
        REQUEST: () => state.setIn([SUBMIT_FORM_SCHEMA, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => state.setIn([SUBMIT_FORM_SCHEMA, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state.setIn([SUBMIT_FORM_SCHEMA, REQUEST_STATE], RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
}
