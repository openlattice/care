/*
 * @flow
 */

import { Set, Map } from 'immutable';

import {
  loadUsedTags,
  uploadDocument
} from './DocumentsActionFactory';
import { DOCUMENTS } from '../../utils/constants/StateConstants';

const {
  IS_UPLOADING,
  TAGS
} = DOCUMENTS;

const INITIAL_STATE :Map<*, *> = Map().withMutations((map :Map<*, *>) => {
  map.set(IS_UPLOADING, false);
  map.set(TAGS, Set());
});

function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case loadUsedTags.case(action.type): {
      return loadUsedTags.reducer(state, action, {
        SUCCESS: () => state.set(TAGS, action.value)
      });
    }

    case uploadDocument.case(action.type): {
      return uploadDocument.reducer(state, action, {
        REQUEST: () => state.set(IS_UPLOADING, true),
        FINALLY: () => state.set(IS_UPLOADING, false)
      });
    }

    default:
      return state;
  }
}

export default reducer;
