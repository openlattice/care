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
import { DELETE_REPORT, UPDATE_REPORT, SUBMIT_REPORT } from '../reports/ReportsActions';
import { CRISIS_PATH, HOME_PATH, PROFILE_PATH } from '../../core/router/Routes';

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

    case DELETE_REPORT:
    case UPDATE_REPORT:
    case SUBMIT_REPORT:
    case CLEAR_SEARCH_RESULTS: {
      return INITIAL_STATE;
    }

    case LOCATION_CHANGE: {
      const {
        // $FlowFixMe SequenceAction does not support 'payload' property
        payload: {
          location: {
            pathname
          }
        }
      } = action;

      // clear search results only routing away from /crisis, /home, or /profile
      if (!(
        pathname.startsWith(CRISIS_PATH)
        || pathname.startsWith(HOME_PATH))
        || pathname.startsWith(PROFILE_PATH)
      ) {
        return INITIAL_STATE;
      }
      return state;
    }

    default:
      return state;
  }

}
