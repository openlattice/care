// @flow

import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import issue from './issue/IssueReducer';
import { CLEAR_INBOX } from './IssuesActions';

const subReducers = combineReducers({
  issue,
});

const issuesReducer = (state :Map, action :Object) => {
  if (action.type === CLEAR_INBOX) {
    return subReducers(undefined, action);
  }

  return subReducers(state, action);
};

export default issuesReducer;
