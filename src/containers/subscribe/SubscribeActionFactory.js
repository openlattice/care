/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const GET_SUBSCRIPTIONS :string = 'GET_SUBSCRIPTIONS';
const getSubscriptions :RequestSequence = newRequestSequence(GET_SUBSCRIPTIONS);

const CREATE_SUBSCRIPTION :string = 'CREATE_SUBSCRIPTION';
const createSubscription :RequestSequence = newRequestSequence(CREATE_SUBSCRIPTION);

const UPDATE_SUBSCRIPTION :string = 'UPDATE_SUBSCRIPTION';
const updateSubscription :RequestSequence = newRequestSequence(UPDATE_SUBSCRIPTION);

const EXPIRE_SUBSCRIPTION :string = 'EXPIRE_SUBSCRIPTION';
const expireSubscription :RequestSequence = newRequestSequence(EXPIRE_SUBSCRIPTION);

export {
  CREATE_SUBSCRIPTION,
  EXPIRE_SUBSCRIPTION,
  GET_SUBSCRIPTIONS,
  UPDATE_SUBSCRIPTION,
  createSubscription,
  expireSubscription,
  getSubscriptions,
  updateSubscription
};
