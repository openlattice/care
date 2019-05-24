/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CLEAR_SEARCH_RESULTS,
  SELECT_PERSON,
  editPerson,
  searchPeople
} from './PeopleActions';

const { OPENLATTICE_ID_FQN } = Constants;

const INITIAL_STATE :Map<*, *> = fromJS({
  isEditingPerson: false,
  peopleSearchResults: List(),
  selectedPerson: Map(),
  fetchState: RequestStates.STANDBY,
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
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('peopleSearchResults', fromJS(action.value)),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;

    case SELECT_PERSON:
      return state.set('selectedPerson', fromJS(action.value));

    default:
      return state;
  }

}
