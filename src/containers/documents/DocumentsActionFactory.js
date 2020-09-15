/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const UPLOAD_DOCUMENT :string = 'UPLOAD_DOCUMENT';
const uploadDocument :RequestSequence = newRequestSequence(UPLOAD_DOCUMENT);

export {
  UPLOAD_DOCUMENT,
  uploadDocument
};
