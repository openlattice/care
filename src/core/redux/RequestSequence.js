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

type SequenceAction = { data :Object, id :string, type :string }
type SequenceActionCreator = (...args :any[]) => SequenceAction

function getActionCreator(id :string, type :string) :SequenceActionCreator {
  return (data :any) => {
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

function getMatchingSwitchCase(baseType :string, actionCreator :SequenceActionCreator) :Function {

  return (switchType :string) => {

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

  const sequenceId :string = randomId();
  const actionCreator :SequenceActionCreator = getActionCreator(sequenceId, baseType);

  [REQUEST, SUCCESS, FAILURE, FINALLY].forEach((seqAction :SequenceActionType) => {
    const seqActionType :string = `${baseType}/${seqAction}`;
    actionCreator[seqAction.toUpperCase()] = seqActionType.toUpperCase();
    actionCreator[seqAction.toLowerCase()] = getActionCreator(sequenceId, seqActionType);
  });

  actionCreator.case = getMatchingSwitchCase(baseType, actionCreator);
  actionCreator.reducer = getReducer(baseType);

  // as of v0.57, FLow doesn't support this use case: https://github.com/facebook/flow/issues/5224
  // workaround: typecast to less the specific "any" type
  return (actionCreator :any);
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
