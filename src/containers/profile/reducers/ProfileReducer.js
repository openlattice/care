// @flow

import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import person from './PersonReducer';
import physicalAppearance from './PhysicalAppearanceReducer';
import reports from './ReportsReducer';
import responsePlan from '../edit/responseplan/ResponsePlanReducer';
import basicInformation from '../edit/basicinformation/BasicInformationReducer';
import { CLEAR_PROFILE } from '../ProfileActions';

const subReducers = combineReducers({
  basicInformation,
  person,
  physicalAppearance,
  reports,
  responsePlan,
});

const profileReducer = (state :Map, action :Object) => {
  if (action.type === CLEAR_PROFILE) {
    return subReducers(undefined, action);
  }

  return subReducers(state, action);
};

export default profileReducer;
