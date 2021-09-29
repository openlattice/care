import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

const { REQUEST_STATE } = ReduxConstants;

const CRISIS_REPORT = 'crisisReport';
const SETTINGS = 'settings';

export const RS_INITIAL_STATE = {
  [REQUEST_STATE]: RequestStates.STANDBY,
};

export {
  CRISIS_REPORT,
  REQUEST_STATE,
  SETTINGS,
};
