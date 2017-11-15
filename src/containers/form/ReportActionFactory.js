/*
 * @flow
 */

import { newRequestSequence } from '../../core/redux/RequestSequence';
import type { RequestSequence } from '../../core/redux/RequestSequence';

const SUBMIT_REPORT :'SUBMIT_REPORT' = 'SUBMIT_REPORT';
const submitReport :RequestSequence = newRequestSequence(SUBMIT_REPORT);

export {
  SUBMIT_REPORT,
  submitReport
};
