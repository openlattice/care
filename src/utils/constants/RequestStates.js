/*
 * @flow
 */

type RequestStateEnum = {|
  PRE_REQUEST :0;
  IS_REQUESTING :1;
  REQUEST_SUCCESS :2;
  REQUEST_FAILURE :3;
|};
type RequestState = $Values<RequestStateEnum>;

const RequestStates :RequestStateEnum = Object.freeze({
  PRE_REQUEST: 0,
  IS_REQUESTING: 1,
  REQUEST_SUCCESS: 2,
  REQUEST_FAILURE: 3,
});

export default RequestStates;
export type {
  RequestState,
  RequestStateEnum,
};
