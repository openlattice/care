// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_APP_SETTINGS :'GET_APP_SETTINGS' = 'GET_APP_SETTINGS';
const getAppSettings :RequestSequence = newRequestSequence(GET_APP_SETTINGS);

const UPDATE_APP_SETTINGS :'UPDATE_APP_SETTINGS' = 'UPDATE_APP_SETTINGS';
const updateAppSettings :RequestSequence = newRequestSequence(UPDATE_APP_SETTINGS);

const CREATE_APP_SETTINGS :'CREATE_APP_SETTINGS' = 'CREATE_APP_SETTINGS';
const createAppSettings :RequestSequence = newRequestSequence(CREATE_APP_SETTINGS);

export {
  CREATE_APP_SETTINGS,
  GET_APP_SETTINGS,
  UPDATE_APP_SETTINGS,
  createAppSettings,
  getAppSettings,
  updateAppSettings,
};
