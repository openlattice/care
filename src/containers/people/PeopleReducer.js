/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';

import {
  CLEAR_SEARCH_RESULTS,
  SELECT_PERSON,
  editPerson,
  searchPeople
} from './PeopleActionFactory';

const { OPENLATTICE_ID_FQN } = Constants;

const INITIAL_STATE :Map<*, *> = fromJS({
  isLoadingPeople: false,
  isEditingPerson: false,
  peopleSearchResults: List(),
  selectedPerson: Map(),
  searchHasRun: false
});

export default function peopleReducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Action) {

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
        REQUEST: () => state.set('isLoadingPeople', true),
        SUCCESS: () => state.set('peopleSearchResults', fromJS(action.value)),
        FINALLY: () => state.set('isLoadingPeople', false).set('searchHasRun', true)
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
