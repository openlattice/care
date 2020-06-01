// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

export const GET_FORM_SCHEMA :'GET_FORM_SCHEMA' = 'GET_FORM_SCHEMA';
export const getFormSchema :RequestSequence = newRequestSequence(GET_FORM_SCHEMA);
