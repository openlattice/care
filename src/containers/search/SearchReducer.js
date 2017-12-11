/*
 * @flow
 */

import Immutable from 'immutable';

import {
  CLEAR_CONSUMER_SEARCH_RESULTS,
  searchConsumers
} from './SearchActionFactory';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  consumers: {
    isSearching: false,
    searchResults: Immutable.List()
  }
});

export default function searchReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case searchConsumers.case(action.type): {
      return searchConsumers.reducer(state, action, {
        REQUEST: () => {
          return state.setIn(['consumers', 'isSearching'], true);
        },
        SUCCESS: () => {
          return state.setIn(['consumers', 'searchResults'], Immutable.fromJS(action.value.hits));
        },
        FAILURE: () => {
          return state.setIn(['consumers', 'searchResults'], Immutable.List());
        },
        FINALLY: () => {
          return state.setIn(['consumers', 'isSearching'], false);
        }
      });
    }

    case CLEAR_CONSUMER_SEARCH_RESULTS: {
      return state.setIn(['consumers', 'searchResults'], Immutable.List());
    }

    default:
      return state;
  }
}
