/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const LOAD_USED_TAGS :string = 'LOAD_USED_TAGS';
const loadUsedTags :RequestSequence = newRequestSequence(LOAD_USED_TAGS);

const UPLOAD_DOCUMENT :string = 'UPLOAD_DOCUMENT';
const uploadDocument :RequestSequence = newRequestSequence(UPLOAD_DOCUMENT);

export {
  LOAD_USED_TAGS,
  UPLOAD_DOCUMENT,
  loadUsedTags,
  uploadDocument
};
