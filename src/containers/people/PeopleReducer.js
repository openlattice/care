/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CLEAR_SEARCH_RESULTS,
  editPerson,
  searchPeople,
  getPeoplePhotos
} from './PeopleActions';

const { OPENLATTICE_ID_FQN } = Constants;

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

    case editPerson.case(action.type): {
      return editPerson.reducer(state, action, {
        REQUEST: () => state.set('isEditingPerson', true),
        SUCCESS: () => {
          const { person, entityKeyId } = action.value;
          if (state.get('selectedPerson', Map()).getIn([OPENLATTICE_ID_FQN, 0]) === entityKeyId) {
            return state.set('selectedPerson', fromJS(person));
          }
          return state;
        },
        FINALLY: () => state.set('isEditingPerson', false)
      });
    }

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
