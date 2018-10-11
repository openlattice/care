/*
 * @flow
 */

import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';

import Logger from '../../utils/Logger';
import { ERR_INVALID_ROUTE } from '../../utils/Errors';
import {
  GO_TO_ROOT,
  GO_TO_ROUTE,
  routingFailure,
} from './RoutingActions';

import type { RoutingAction } from './RoutingActions';

const LOG = new Logger('RoutingSagas');

/*
 *
 * sagas
 *
 */

/*
 *
 * RoutingActions.goToRoute()
 *
 */

function* goToRouteWorker(action :RoutingAction) :Generator<*, *, *> {

  const { route } = action;
  if (route === null || route === undefined || !route.startsWith('/', 0)) {
    LOG.error(ERR_INVALID_ROUTE, route);
    yield put(routingFailure(ERR_INVALID_ROUTE, route));
    return;
  }

  yield put(push(route));
}

function* goToRouteWatcher() :Generator<*, *, *> {

  yield takeEvery(GO_TO_ROUTE, goToRouteWorker);
}

/*
 *
 * RoutingActions.goToRoot()
 *
 */

function* goToRootWatcher() :Generator<*, *, *> {

  yield takeEvery(GO_TO_ROOT, goToRouteWorker);
}

/*
 *
 * exports
 *
 */

export {
  goToRootWatcher,
  goToRouteWatcher,
  goToRouteWorker,
};
