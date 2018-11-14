/*
 * @flow
 */

import { List, Map, fromJS} from 'immutable';

import {
  CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS,
  CLEAR_CONSUMER_SEARCH_RESULTS,
  searchConsumerNeighbors,
  searchConsumers
} from './SearchActionFactory';

const INITIAL_STATE :Map<*, *> = fromJS({
  consumerNeighbors: {
    isSearching: false,
    searchResults: List()
  },
  consumers: {
    isSearching: false,
    searchResults: List(),
    searchComplete: false
  }
});

export default function searchReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case searchConsumerNeighbors.case(action.type): {
      return searchConsumerNeighbors.reducer(state, action, {
        REQUEST: () => {
          return state
            .setIn(['consumerNeighbors', 'isSearching'], true)
            .setIn(['consumerNeighbors', 'searchResults'], List());
        },
        SUCCESS: () => {
          return state.setIn(['consumerNeighbors', 'searchResults'], fromJS(action.value));
        },
        FAILURE: () => {
          return state.setIn(['consumerNeighbors', 'searchResults'], List());
        },
        FINALLY: () => {
          return state.setIn(['consumerNeighbors', 'isSearching'], false);
        }
      });
    }

    case searchConsumers.case(action.type): {
      return searchConsumers.reducer(state, action, {
        REQUEST: () => {
          return state
            .setIn(['consumers', 'isSearching'], true)
            .setIn(['consumers', 'searchResults'], List())
            .setIn(['consumers', 'searchComplete'], false);
        },
        SUCCESS: () => {
          return state.setIn(['consumers', 'searchResults'], fromJS(action.value.hits));
        },
        FAILURE: () => {
          return state.setIn(['consumers', 'searchResults'], List());
        },
        FINALLY: () => {
          return state.setIn(['consumers', 'isSearching'], false).setIn(['consumers', 'searchComplete'], true);
        }
      });
    }

    case CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS: {
      return state.setIn(['consumerNeighbors', 'searchResults'], List());
    }

    case CLEAR_CONSUMER_SEARCH_RESULTS: {
      return state.setIn(['consumers', 'searchResults'], List());
    }

    default:
      return state;
  }
}
