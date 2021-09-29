// @flow

import { Map } from 'immutable';
import type { FQN, UUID } from 'lattice';

import { EDM, FQN_TO_ID_MAP } from '../constants';

export default function selectPropertyTypeId(fqn :FQN) {

  return (state :Map) :UUID => state.getIn([EDM, FQN_TO_ID_MAP, fqn]);
}
