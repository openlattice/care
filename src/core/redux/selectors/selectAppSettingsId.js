// @flow

import { Map } from 'immutable';

import { ID, SETTINGS } from '../constants';

export default function selectAppSettingsId() {

  return (state :Map) :Map => state.getIn([SETTINGS, ID]);
}
