// @flow

import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import citations from './CitationsReducer';
import person from './PersonReducer';
import physicalAppearance from './PhysicalAppearanceReducer';
import policeCad from './PoliceCADReducer';
import reports from './ReportsReducer';

import about from '../edit/about/AboutReducer';
import basicInformation from '../edit/basicinformation/reducers/BasicInformationReducer';
import documents from '../edit/documents/ProfileDocumentsReducer';
import emergencyContacts from '../edit/contacts/EmergencyContactsReducer';
import officerSafety from '../edit/officersafety/reducers/OfficerSafetyReducer';
import responsePlan from '../edit/responseplan/ResponsePlanReducer';
import symptomReports from '../../reports/symptoms/ProfileSymptomsReducer';
import visibility from '../edit/visibility/VisibilityReducer';
import { CLEAR_PROFILE } from '../ProfileActions';

const subReducers = combineReducers({
  about,
  basicInformation,
  citations,
  documents,
  emergencyContacts,
  officerSafety,
  person,
  physicalAppearance,
  policeCad,
  reports,
  responsePlan,
  symptomReports,
  visibility,
});

const profileReducer = (state :Map, action :Object) => {
  if (action.type === CLEAR_PROFILE) {
    return subReducers(undefined, action);
  }

  return subReducers(state, action);
};

export default profileReducer;
