// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_RECENT_INTERACTIONS :'GET_RECENT_INTERACTIONS' = 'GET_RECENT_INTERACTIONS';
const getRecentInteractions :RequestSequence = newRequestSequence(GET_RECENT_INTERACTIONS);

const CLEAR_RECENT_INTERACTIONS :'CLEAR_RECENT_INTERACTIONS' = 'CLEAR_RECENT_INTERACTIONS';
const clearRecentInteractions = () => ({
  type: CLEAR_RECENT_INTERACTIONS
});

export {
  CLEAR_RECENT_INTERACTIONS,
  GET_RECENT_INTERACTIONS,
  clearRecentInteractions,
  getRecentInteractions,
};
