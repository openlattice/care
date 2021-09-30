// @flow

import { Map } from 'immutable';
import type { UUID } from 'lattice';

import { APP, SELECTED_ORGANIZATION_ID } from '../constants';

export default function selectCurrentOrganizationId() {

  return (state :Map) :UUID => state.getIn([APP, SELECTED_ORGANIZATION_ID]);
}
