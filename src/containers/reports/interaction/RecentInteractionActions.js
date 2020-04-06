// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_RECENT_INTERACTIONS :'GET_RECENT_INTERACTIONS' = 'GET_RECENT_INTERACTIONS';
const getRecentInteractions :RequestSequence = newRequestSequence(GET_RECENT_INTERACTIONS);

const SUBMIT_RECENT_INTERACTION :'SUBMIT_RECENT_INTERACTION' = 'SUBMIT_RECENT_INTERACTION';
const submitRecentInteraction :RequestSequence = newRequestSequence(SUBMIT_RECENT_INTERACTION);

const CLEAR_RECENT_INTERACTIONS :'CLEAR_RECENT_INTERACTIONS' = 'CLEAR_RECENT_INTERACTIONS';
const clearRecentInteractions = () => ({
  type: CLEAR_RECENT_INTERACTIONS
});

export {
  CLEAR_RECENT_INTERACTIONS,
  GET_RECENT_INTERACTIONS,
  SUBMIT_RECENT_INTERACTION,
  clearRecentInteractions,
  getRecentInteractions,
  submitRecentInteraction,
};
