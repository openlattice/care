/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import { LOCATION_CHANGE } from 'connected-react-router';
import type { SequenceAction } from 'redux-reqseq';

import {
  CLEAR_SEARCH_RESULTS,
  getPeoplePhotos,
  searchPeople,
} from './PeopleActions';
import { HOME_PATH } from '../../core/router/Routes';

const INITIAL_STATE :Map<*, *> = fromJS({
  fetchState: RequestStates.STANDBY,
  peopleSearchResults: List(),
  searchFields: Map({
    firstName: '',
    lastName: '',
    dob: undefined,
  })
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

    case CLEAR_SEARCH_RESULTS: {
      return INITIAL_STATE;
    }

    case LOCATION_CHANGE: {
      const {
        // $FlowFixMe SequenceAction does not support 'payload' property
        payload: {
          location: {
            pathname
          },
          action: routingAction
        }
      } = action;

      // clear search results when pushing directly to /home
      if (pathname.startsWith(HOME_PATH) && routingAction === 'PUSH') {
        return INITIAL_STATE;
      }
      return state;
    }

    default:
      return state;
  }

}
