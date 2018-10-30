/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const DOWNLOAD_FORMS :string = 'DOWNLOAD_FORMS';
const downloadForms :RequestSequence = newRequestSequence(DOWNLOAD_FORMS);

export {
  DOWNLOAD_FORMS,
  downloadForms
};
