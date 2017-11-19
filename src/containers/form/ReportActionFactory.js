/*
 * @flow
 */

import { newRequestSequence } from '../../core/redux/RequestSequence';
import type { RequestSequence } from '../../core/redux/RequestSequence';

const HARD_RESTART :'HARD_RESTART' = 'HARD_RESTART';

function hardRestart() :Object {

  return {
    type: HARD_RESTART
  };
}

const SUBMIT_REPORT :'SUBMIT_REPORT' = 'SUBMIT_REPORT';
const submitReport :RequestSequence = newRequestSequence(SUBMIT_REPORT);

export {
  HARD_RESTART,
  SUBMIT_REPORT,
  hardRestart,
  submitReport
};
