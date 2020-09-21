/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_SUBSCRIPTIONS,
  getSubscriptions,
} from './SubscriptionActions';
import { ISSUE_ALERT_TYPE, SUBSCRIPTION_TYPE } from './constants';

import { SUBSCRIBE } from '../../utils/constants/StateConstants';

const {
  SUBSCRIPTIONS
} = SUBSCRIBE;

const INITIAL_STATE :Map<*, *> = fromJS({
  fetchState: RequestStates.STANDBY,
  [SUBSCRIPTIONS]: List()
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getSubscriptions.case(action.type): {
      return getSubscriptions.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set(
            SUBSCRIPTIONS,
            fromJS(action.value.filter(({ type }) => (type === SUBSCRIPTION_TYPE || type === ISSUE_ALERT_TYPE)))
          ),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }
    case CLEAR_SUBSCRIPTIONS:
      return INITIAL_STATE;

    default:
      return state;
  }
}
