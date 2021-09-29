// @flow

import { Map } from 'immutable';
import type { FQN, UUID } from 'lattice';

import { APP, SELECTED_ORG_ENTITY_SET_IDS } from '../constants';

export default function selectEntitySetId(fqn :FQN) {

  return (state :Map) :UUID => state.getIn([APP, SELECTED_ORG_ENTITY_SET_IDS, fqn.toString()]);
}
