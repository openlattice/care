/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import {
  GET_APP_SETTINGS,
  getAppSettings,
} from '../actions';

export default function getAppSettingsReducer(state :Map, action :SequenceAction) {

  return getAppSettings.reducer(state, action, {
    REQUEST: () => state.setIn([GET_APP_SETTINGS, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state
      .setIn([GET_APP_SETTINGS, REQUEST_STATE], RequestStates.SUCCESS)
      .merge(action.value),
    FAILURE: () => state.setIn([GET_APP_SETTINGS, REQUEST_STATE], RequestStates.FAILURE),
  });
}
