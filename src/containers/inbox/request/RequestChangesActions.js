// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_REQUEST_CHANGES :'SUBMIT_REQUEST_CHANGES' = 'SUBMIT_REQUEST_CHANGES';
const submitRequestChanges :RequestSequence = newRequestSequence(SUBMIT_REQUEST_CHANGES);

const RESET_REQUEST_CHANGES_STATE :'RESET_REQUEST_CHANGES_STATE' = 'RESET_REQUEST_CHANGES_STATE';
const resetRequestChangesState = () => ({
  type: RESET_REQUEST_CHANGES_STATE
});

export {
  RESET_REQUEST_CHANGES_STATE,
  SUBMIT_REQUEST_CHANGES,
  resetRequestChangesState,
  submitRequestChanges,
};
