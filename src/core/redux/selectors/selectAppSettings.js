// @flow

import { Map } from 'immutable';

import { SETTINGS } from '../constants';

export default function selectAppSettings() {

  return (state :Map) :Map => state.getIn([SETTINGS, SETTINGS]);
}
