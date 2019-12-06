/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CLEAR_SEARCH_RESULTS,
  searchPeople,
  getPeoplePhotos
} from './PeopleActions';

const INITIAL_STATE :Map<*, *> = fromJS({
  fetchState: RequestStates.STANDBY,
  isEditingPerson: false,
  peopleSearchResults: List(),
  searchFields: Map({
    firstName: '',
    lastName: '',
    dob: undefined,
  }),
  selectedPerson: Map(),
});

export default function peopleReducer(state :Map<*, *> = INITIAL_STATE, action :SequenceAction) {

  switch (action.type) {

    case searchPeople.case(action.type): {
      return searchPeople.reducer(state, action, {
        REQUEST: () => state
          .set('fetchState', RequestStates.PENDING)
          .merge(action.value),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case getPeoplePhotos.case(action.type): {
      return getPeoplePhotos.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('profilePicsByEKID', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;

    default:
      return state;
  }

}
