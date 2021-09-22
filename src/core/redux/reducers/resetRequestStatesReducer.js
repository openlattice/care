/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { REQUEST_STATE } from '../constants';
import type { ResetRequestStatesAction } from '../actions';

export default function resetRequestStatesReducer(state :Map, action :ResetRequestStatesAction) {

  const { actions = [] } = action;
  let newState = state;
  actions.forEach((requestStateAction :string) => {
    if (state.hasIn([requestStateAction])) {
      newState = newState
        .setIn([requestStateAction, REQUEST_STATE], RequestStates.STANDBY);
    }
  });

  return newState;
}
