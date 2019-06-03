/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SUBSCRIBE } from '../../utils/constants/StateConstants';
import { SUBSCRIPTION_TYPE } from './SubscribeConstants';

import {
  getSubscriptions,
} from './SubscribeActionFactory';

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

    default:
      return state;
  }
}
