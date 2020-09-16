// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_PROFILE_VISIBILITY :'GET_PROFILE_VISIBILITY' = 'GET_PROFILE_VISIBILITY';
const getProfileVisibility = newRequestSequence(GET_PROFILE_VISIBILITY);

const PUT_PROFILE_VISIBILITY :'PUT_PROFILE_VISIBILITY' = 'PUT_PROFILE_VISIBILITY';
const putProfileVisibility = newRequestSequence(PUT_PROFILE_VISIBILITY);

export {
  GET_PROFILE_VISIBILITY,
  PUT_PROFILE_VISIBILITY,
  getProfileVisibility,
  putProfileVisibility,
};
