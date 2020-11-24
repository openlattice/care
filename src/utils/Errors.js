/*
 * @flow
 */

const ERR_ACTION_VALUE_NOT_DEFINED :Error = Error('invalid parameter: action.value is required and must be defined');
const ERR_INVALID_ROUTE :Error = Error('invalid path: a path must be a non-empty string that starts with "/"');
const ERR_ACTION_VALUE_TYPE :Error = Error('invalid parameter: action.value is the incorrect type');
const ERR_WORKER_SAGA :Error = Error('caught exception in worker saga');
const ERR_UNEXPECTED :Error = Error('An unexpected error has occured. Try again later or contact support.');

export {
  ERR_ACTION_VALUE_NOT_DEFINED,
  ERR_ACTION_VALUE_TYPE,
  ERR_INVALID_ROUTE,
  ERR_UNEXPECTED,
  ERR_WORKER_SAGA,
};
