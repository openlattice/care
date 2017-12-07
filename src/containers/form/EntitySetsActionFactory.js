/*
 * @flow
 */

import { newRequestSequence } from '../../core/redux/RequestSequence';
import type { RequestSequence } from '../../core/redux/RequestSequence';

const LOAD_DATA_MODEL :'LOAD_DATA_MODEL' = 'LOAD_DATA_MODEL';
const loadDataModel :RequestSequence = newRequestSequence(LOAD_DATA_MODEL);

export {
  LOAD_DATA_MODEL,
  loadDataModel,
};
