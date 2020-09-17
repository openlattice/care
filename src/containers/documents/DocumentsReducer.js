/*
 * @flow
 */

import { Set, Map } from 'immutable';

import {
  ADD_PERSON,
  REMOVE_PERSON,
  loadUsedTags,
  searchPeopleForDocuments,
  uploadDocuments
} from './DocumentsActionFactory';
import { DOCUMENTS } from '../../utils/constants/StateConstants';

const {
  IS_SEARCHING,
  IS_UPLOADING,
  PEOPLE_BY_ID,
  PERSON_RESULTS,
  TAGS,
} = DOCUMENTS;

const INITIAL_STATE :Map<*, *> = Map().withMutations((map :Map<*, *>) => {
  map.set(IS_SEARCHING, false);
  map.set(IS_UPLOADING, false);
  map.set(PEOPLE_BY_ID, Map());
  map.set(PERSON_RESULTS, Map());
  map.set(TAGS, Set());
});

function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case loadUsedTags.case(action.type): {
      return loadUsedTags.reducer(state, action, {
        SUCCESS: () => state.set(TAGS, action.value)
      });
    }

    case searchPeopleForDocuments.case(action.type): {
      return searchPeopleForDocuments.reducer(state, action, {
        REQUEST: () => state.set(IS_SEARCHING, true),
        SUCCESS: () => state.set(PERSON_RESULTS, action.value),
        FINALLY: () => state.set(IS_SEARCHING, false)
      });
    }

    case uploadDocuments.case(action.type): {
      return uploadDocuments.reducer(state, action, {
        REQUEST: () => state.set(IS_UPLOADING, true),
        FINALLY: () => state.set(IS_UPLOADING, false)
      });
    }

    default:
      return state;
  }
}

export default reducer;
