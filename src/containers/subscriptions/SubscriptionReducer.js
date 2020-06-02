/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import {
  CLEAR_SUBSCRIPTIONS,
  getSubscriptions,
} from './SubscriptionActions';
import { SUBSCRIPTION_TYPE } from './constants';

import { SUBSCRIBE } from '../../utils/constants/StateConstants';

const {
  IS_LOADING_SUBSCRIPTIONS,
  SUBSCRIPTIONS
} = SUBSCRIBE;

const INITIAL_STATE :Map<*, *> = fromJS({
  [IS_LOADING_SUBSCRIPTIONS]: false,
  [SUBSCRIPTIONS]: List()
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getSubscriptions.case(action.type): {
      return getSubscriptions.reducer(state, action, {
        REQUEST: () => state.set(IS_LOADING_SUBSCRIPTIONS, true),
        SUCCESS: () => state.set(SUBSCRIPTIONS, fromJS(action.value.filter(({ type }) => type === SUBSCRIPTION_TYPE))),
        FINALLY: () => state.set(IS_LOADING_SUBSCRIPTIONS, false)
      });
    }
    case CLEAR_SUBSCRIPTIONS:
      return INITIAL_STATE;

    default:
      return state;
  }
}
