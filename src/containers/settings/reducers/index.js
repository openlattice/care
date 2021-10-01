// @flow
import { Map, fromJS } from 'immutable';

import getAppSettingsReducer from './getAppSettingsReducer';
import updateAppSettingsReducer from './updateAppSettingsReducer';

import resetRequestStatesReducer from '../../../core/redux/reducers/resetRequestStatesReducer';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { RS_INITIAL_STATE, SETTINGS } from '../../../core/redux/constants';
import {
  GET_APP_SETTINGS,
  UPDATE_APP_SETTINGS,
  getAppSettings,
  updateAppSettings
} from '../actions';

const INITIAL_STATE = fromJS({
  [GET_APP_SETTINGS]: RS_INITIAL_STATE,
  [UPDATE_APP_SETTINGS]: RS_INITIAL_STATE,
  [SETTINGS]: Map(),
  id: ''
});

export default function settingsReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }

    case getAppSettings.case(action.type): {
      return getAppSettingsReducer(state, action);
    }

    case updateAppSettings.case(action.type): {
      return updateAppSettingsReducer(state, action);
    }

    default:
      return state;
  }
}
