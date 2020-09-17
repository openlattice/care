/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const LOAD_USED_TAGS :string = 'LOAD_USED_TAGS';
const loadUsedTags :RequestSequence = newRequestSequence(LOAD_USED_TAGS);

const UPLOAD_DOCUMENTS :string = 'UPLOAD_DOCUMENTS';
const uploadDocuments :RequestSequence = newRequestSequence(UPLOAD_DOCUMENTS);

export {
  LOAD_USED_TAGS,
  UPLOAD_DOCUMENTS,
  loadUsedTags,
  uploadDocuments
};
