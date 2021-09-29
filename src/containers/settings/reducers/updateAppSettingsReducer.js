/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import {
  UPDATE_APP_SETTINGS,
  updateAppSettings,
} from '../actions';

export default function updateAppSettingsReducer(state :Map, action :SequenceAction) {

  return updateAppSettings.reducer(state, action, {
    REQUEST: () => state
      .setIn([UPDATE_APP_SETTINGS, REQUEST_STATE], RequestStates.PENDING)
      .merge(action.value),
    SUCCESS: () => state.setIn([UPDATE_APP_SETTINGS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([UPDATE_APP_SETTINGS, REQUEST_STATE], RequestStates.FAILURE),
  });
}
