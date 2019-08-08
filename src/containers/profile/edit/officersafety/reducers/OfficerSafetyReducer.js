// @flow

import { combineReducers } from 'redux-immutable';

import officerSafetyConcerns from './OfficerSafetyConcernsReducer';
// import triggers from './TriggersReducer';
// import descalations from './DescalationsReducer';

const officerSafetyReducer = combineReducers({
  officerSafetyConcerns
});

export default officerSafetyReducer;
