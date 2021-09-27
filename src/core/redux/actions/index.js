/*
 * @flow
 */

const RESET_REQUEST_STATES :'RESET_REQUEST_STATES' = 'RESET_REQUEST_STATES';
type ResetRequestStatesAction = {|
  actions :string[];
  type :typeof RESET_REQUEST_STATES;
|};

const resetRequestStates = (actions :string[]) :ResetRequestStatesAction => ({
  actions,
  type: RESET_REQUEST_STATES,
});

export {
  RESET_REQUEST_STATES,
  resetRequestStates,
};

export type {
  ResetRequestStatesAction,
};
