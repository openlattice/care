// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_REQUEST_CHANGES :'SUBMIT_REQUEST_CHANGES' = 'SUBMIT_REQUEST_CHANGES';
const submitRequestChanges :RequestSequence = newRequestSequence(SUBMIT_REQUEST_CHANGES);

export {
  SUBMIT_REQUEST_CHANGES,
  submitRequestChanges
};
