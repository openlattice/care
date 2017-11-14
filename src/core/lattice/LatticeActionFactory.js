/*
 * @flow
 */

import { newRequestSequence } from '../redux/RequestSequence';
import type { RequestSequence } from '../redux/RequestSequence';

const FETCH_EDM_PROJECTION :'FETCH_EDM_PROJECTION' = 'FETCH_EDM_PROJECTION';
const fetchEntityDataModelProjection :RequestSequence = newRequestSequence(FETCH_EDM_PROJECTION);

const FETCH_ENTITY_SET :'FETCH_ENTITY_SET' = 'FETCH_ENTITY_SET';
const fetchEntitySet :RequestSequence = newRequestSequence(FETCH_ENTITY_SET);

const FETCH_ENTITY_SET_ID :'FETCH_ENTITY_SET_ID' = 'FETCH_ENTITY_SET_ID';
const fetchEntitySetId :RequestSequence = newRequestSequence(FETCH_ENTITY_SET_ID);

const FETCH_ENTITY_TYPE :'FETCH_ENTITY_TYPE' = 'FETCH_ENTITY_TYPE';
const fetchEntityType :RequestSequence = newRequestSequence(FETCH_ENTITY_TYPE);

const FETCH_PROPERTY_TYPE :'FETCH_PROPERTY_TYPE' = 'FETCH_PROPERTY_TYPE';
const fetchPropertyType :RequestSequence = newRequestSequence(FETCH_PROPERTY_TYPE);

const FETCH_PROPERTY_TYPES :'FETCH_PROPERTY_TYPES' = 'FETCH_PROPERTY_TYPES';
const fetchPropertyTypes :RequestSequence = newRequestSequence(FETCH_PROPERTY_TYPES);

const GET_CURRENT_SYNC_ID :'GET_CURRENT_SYNC_ID' = 'GET_CURRENT_SYNC_ID';
const getCurrentSyncId :RequestSequence = newRequestSequence(GET_CURRENT_SYNC_ID);

export {
  FETCH_EDM_PROJECTION,
  FETCH_ENTITY_SET,
  FETCH_ENTITY_SET_ID,
  FETCH_ENTITY_TYPE,
  FETCH_PROPERTY_TYPE,
  FETCH_PROPERTY_TYPES,
  GET_CURRENT_SYNC_ID,
  fetchEntityDataModelProjection,
  fetchEntitySet,
  fetchEntitySetId,
  fetchEntityType,
  fetchPropertyType,
  fetchPropertyTypes,
  getCurrentSyncId
};
