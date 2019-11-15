// @flow

import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import requestChanges from './request/RequestChangesReducer';
import { CLEAR_INBOX } from './InboxActions';

const subReducers = combineReducers({
  requestChanges,
});

const inboxReducer = (state :Map, action :Object) => {
  if (action.type === CLEAR_INBOX) {
    return subReducers(undefined, action);
  }

  return subReducers(state, action);
};

export default inboxReducer;
