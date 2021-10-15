// @flow
import { Map } from 'immutable';

import {
  FORM_SCHEMAS,
  SCHEMAS,
} from '../constants';

export default function selectFormSchemas(type :string) {

  return (state :Map) => state.getIn([FORM_SCHEMAS, SCHEMAS, type]);
}
