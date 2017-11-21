/*
 * @flow
 */

const REQUEST :'REQUEST' = 'REQUEST';
const SUCCESS :'SUCCESS' = 'SUCCESS';
const FAILURE :'FAILURE' = 'FAILURE';
const FINALLY :'FINALLY' = 'FINALLY';

type SequenceActionType =
  | typeof REQUEST
  | typeof SUCCESS
  | typeof FAILURE
  | typeof FINALLY;

type SequenceAction = { data :Object, id :string, type :string };
type SequenceActionCreator = (...args :any[]) => SequenceAction;

function getActionCreator(id :string, type :string) :SequenceActionCreator {
  return (data :any) :SequenceAction => {
    return {
      id,
      type,
      data: {
        ...data
      }
    };
  };
}

function randomId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2);
}

type SwitchCaseMatcher = (type :string) => string;

function getSwitchCaseMatcher(baseType :string, actionCreator :SequenceActionCreator) :SwitchCaseMatcher {

  return (switchType :string) :string => {

    let parsedStage :string = '';
    const slashIndex :number = switchType.lastIndexOf('/');
    if (slashIndex > 0 && slashIndex < switchType.length) {
      parsedStage = switchType.substring(slashIndex + 1);
    }

    return (actionCreator[parsedStage] === switchType) ? switchType : baseType;
  };
}

type SubReducers = {
  REQUEST ? :() => Map<*, *>;
  SUCCESS ? :() => Map<*, *>;
  FAILURE ? :() => Map<*, *>;
  FINALLY ? :() => Map<*, *>;
}

type SequenceReducer = (state :Map<*, *>, action :SequenceAction, subReducers :SubReducers) => Map<*, *>;

function getReducer(baseType :string) :SequenceReducer {

  return (state :Map<*, *>, action :SequenceAction, subReducers :SubReducers) :Map<*, *> => {

    // TODO: need the Logger

    if (action.type === `${baseType}/${REQUEST}`) {
      const requestReducer = subReducers[REQUEST];
      if (requestReducer !== null && requestReducer !== undefined) {
        if (typeof requestReducer === 'function') {
          return requestReducer();
        }
        console.error(`RequestSequence: ${REQUEST} reducer must be a function.`);
      }
      // TODO: error handling
    }
    else if (action.type === `${baseType}/${SUCCESS}`) {
      const successReducer = subReducers[SUCCESS];
      if (successReducer !== null && successReducer !== undefined) {
        if (typeof successReducer === 'function') {
          return successReducer();
        }
        console.error(`RequestSequence: ${SUCCESS} reducer must be a function.`);
      }
      // TODO: error handling
    }
    else if (action.type === `${baseType}/${FAILURE}`) {
      const failureReducer = subReducers[FAILURE];
      if (failureReducer !== null && failureReducer !== undefined) {
        if (typeof failureReducer === 'function') {
          return failureReducer();
        }
        console.error(`RequestSequence: ${FAILURE} reducer must be a function.`);
      }
    }
    else if (action.type === `${baseType}/${FINALLY}`) {
      const finallyReducer = subReducers[FINALLY];
      if (finallyReducer !== null && finallyReducer !== undefined) {
        if (typeof finallyReducer === 'function') {
          return finallyReducer();
        }
        console.error(`RequestSequence: ${FINALLY} reducer must be a function.`);
      }
    }

    return state;
  };
}

type RequestSequence = {
  // sequence action types
  REQUEST :typeof REQUEST;
  SUCCESS :typeof SUCCESS;
  FAILURE :typeof FAILURE;
  FINALLY :typeof FINALLY;
  // sequence action creators
  request :SequenceActionCreator;
  success :SequenceActionCreator;
  failure :SequenceActionCreator;
  finally :SequenceActionCreator;
  // helpers
  $call :SequenceActionCreator;
  case :(type :string) => string;
  reducer :SequenceReducer;
}

function newRequestSequence(baseType :string) :RequestSequence {

  const requestSequenceActionType :string = `${baseType}/${REQUEST}`.toUpperCase();
  const successSequenceActionType :string = `${baseType}/${SUCCESS}`.toUpperCase();
  const failureSequenceActionType :string = `${baseType}/${FAILURE}`.toUpperCase();
  const finallySequenceActionType :string = `${baseType}/${FINALLY}`.toUpperCase();

  let triggerCallCount :number = 0;
  let requestCallCount :number = 0;
  let successCallCount :number = 0;
  let failureCallCount :number = 0;
  let finallyCallCount :number = 0;

  const sequenceIds :{[key :number] :string} = {
    [triggerCallCount]: randomId()
  };

  const triggerActionCreator :SequenceActionCreator = (data :any) :SequenceAction => {
    const action :SequenceAction = getActionCreator(sequenceIds[triggerCallCount], baseType)(data);
    triggerCallCount += 1;
    sequenceIds[triggerCallCount] = randomId();
    return action;
  };

  const requestActionCreator :SequenceActionCreator = (data :any) :SequenceAction => {
    const action :SequenceAction = getActionCreator(sequenceIds[requestCallCount], requestSequenceActionType)(data);
    requestCallCount += 1;
    return action;
  };

  const successActionCreator :SequenceActionCreator = (data :any) :SequenceAction => {
    const action :SequenceAction = getActionCreator(sequenceIds[successCallCount], successSequenceActionType)(data);
    successCallCount += 1;
    return action;
  };

  const failureActionCreator :SequenceActionCreator = (data :any) :SequenceAction => {
    const action :SequenceAction = getActionCreator(sequenceIds[failureCallCount], failureSequenceActionType)(data);
    failureCallCount += 1;
    return action;
  };

  const finallyActionCreator :SequenceActionCreator = (data :any) :SequenceAction => {
    const action :SequenceAction = getActionCreator(sequenceIds[finallyCallCount], finallySequenceActionType)(data);
    finallyCallCount += 1;
    return action;
  };

  triggerActionCreator.REQUEST = requestSequenceActionType;
  triggerActionCreator.SUCCESS = successSequenceActionType;
  triggerActionCreator.FAILURE = failureSequenceActionType;
  triggerActionCreator.FINALLY = finallySequenceActionType;

  triggerActionCreator.request = requestActionCreator;
  triggerActionCreator.success = successActionCreator;
  triggerActionCreator.failure = failureActionCreator;
  triggerActionCreator.finally = finallyActionCreator;

  triggerActionCreator.case = getSwitchCaseMatcher(baseType, triggerActionCreator);
  triggerActionCreator.reducer = getReducer(baseType);

  // as of v0.57, FLow doesn't support this use case: https://github.com/facebook/flow/issues/5224
  // workaround: typecast to less the specific "any" type
  return (triggerActionCreator :any);
}

export {
  REQUEST,
  SUCCESS,
  FAILURE,
  FINALLY,
  newRequestSequence
};

export type {
  RequestSequence,
  SequenceAction,
  SequenceActionType
};
