/*
 * @flow
 */

import { Map } from 'immutable';
import createSagaMiddleware from 'redux-saga';

import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import sagas from '../sagas/Sagas';
import reduxReducer from './ReduxReducer';

export default function initializeReduxStore(routerHistory :any) :Object {

  const sagaMiddleware = createSagaMiddleware();

  const reduxMiddlewares = [
    sagaMiddleware,
    routerMiddleware(routerHistory)
  ];

  const reduxEnhancers = [
    applyMiddleware(...reduxMiddlewares)
  ];

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      maxAge: 100,
      serialize: true
    })
    : compose;
  /* eslint-enable */

  const reduxStore = createStore(
    reduxReducer(),
    Map(),
    composeEnhancers(...reduxEnhancers)
  );

  sagaMiddleware.run(sagas);

  return reduxStore;
}
