/*
 * @flow
 */

import { newRequestSequence } from '../redux/RequestSequence';
import type { RequestSequence } from '../redux/RequestSequence';

const ACQUIRE_SYNC_TICKET :'ACQUIRE_SYNC_TICKET' = 'ACQUIRE_SYNC_TICKET';
const acquireSyncTicket :RequestSequence = newRequestSequence(ACQUIRE_SYNC_TICKET);

const CREATE_ENTITY_AND_ASSOCIATION_DATA :'CREATE_ENTITY_AND_ASSOCIATION_DATA' = 'CREATE_ENTITY_AND_ASSOCIATION_DATA';
const createEntityAndAssociationData :RequestSequence = newRequestSequence(CREATE_ENTITY_AND_ASSOCIATION_DATA);

const FETCH_CURRENT_SYNC_ID :'FETCH_CURRENT_SYNC_ID' = 'FETCH_CURRENT_SYNC_ID';
const fetchCurrentSyncId :RequestSequence = newRequestSequence(FETCH_CURRENT_SYNC_ID);

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

export {
  ACQUIRE_SYNC_TICKET,
  CREATE_ENTITY_AND_ASSOCIATION_DATA,
  FETCH_CURRENT_SYNC_ID,
  FETCH_EDM_PROJECTION,
  FETCH_ENTITY_SET,
  FETCH_ENTITY_SET_ID,
  FETCH_ENTITY_TYPE,
  FETCH_PROPERTY_TYPE,
  FETCH_PROPERTY_TYPES,
  acquireSyncTicket,
  createEntityAndAssociationData,
  fetchCurrentSyncId,
  fetchEntityDataModelProjection,
  fetchEntitySet,
  fetchEntitySetId,
  fetchEntityType,
  fetchPropertyType,
  fetchPropertyTypes
};
