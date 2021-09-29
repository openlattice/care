// @flow

import { Map } from 'immutable';

import { APP } from '../constants';

export default function selectApp() {

  return (state :Map) :Map => state.get(APP, Map());
}
