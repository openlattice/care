// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_BASICS_AND_PHYSICALS :'GET_BASICS_AND_PHYSICALS' = 'GET_BASICS_AND_PHYSICALS';
const getBasicsAndPhysicals = newRequestSequence(GET_BASICS_AND_PHYSICALS);

const UPDATE_BASICS_AND_PHYSICALS :'UPDATE_BASICS_AND_PHYSICALS' = 'UPDATE_BASICS_AND_PHYSICALS';
const updateBasicsAndPhysicals = newRequestSequence(UPDATE_BASICS_AND_PHYSICALS);

export {
  GET_BASICS_AND_PHYSICALS,
  UPDATE_BASICS_AND_PHYSICALS,
  getBasicsAndPhysicals,
  updateBasicsAndPhysicals,
};
