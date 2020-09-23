// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PROFILE_DOCUMENTS :'GET_PROFILE_DOCUMENTS' = 'GET_PROFILE_DOCUMENTS';
const getProfileDocuments :RequestSequence = newRequestSequence(GET_PROFILE_DOCUMENTS);

export {
  GET_PROFILE_DOCUMENTS,
  getProfileDocuments,
};
