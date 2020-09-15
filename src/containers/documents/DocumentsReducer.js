/*
 * @flow
 */

import { Map } from 'immutable';

import { uploadDocument } from './DocumentsActionFactory';
import { DOCUMENTS } from '../../utils/constants/StateConstants';

const {
  IS_UPLOADING
} = DOCUMENTS;

const INITIAL_STATE :Map<*, *> = Map().withMutations((map :Map<*, *>) => {
  map.set(IS_UPLOADING, false);
});

function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

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
