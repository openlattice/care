// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getBasicsAndPhysicals,
  updateBasicsAndPhysicals,
} from './BasicInformationActions';

const INITIAL_STATE :Map = fromJS({
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  updateState: RequestStates.STANDBY,
});

const basicInformationReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {

  switch (action.type) {

    case getBasicsAndPhysicals.case(action.type): {
      return getBasicsAndPhysicals.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            formData,
          } = action.value;
          return state
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .set('formData', formData);
        },
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case updateBasicsAndPhysicals.case(action.type): {
      return updateBasicsAndPhysicals.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.SUCCESS)
            .setIn(['formData', ...path], properties);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default basicInformationReducer;
