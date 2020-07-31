/*
 * @flow
 */

import { put, takeEvery } from '@redux-saga/core/effects';
import { push } from 'connected-react-router';

import {
  GO_TO_PATH,
  GO_TO_ROOT,
  routingFailure,
} from './RoutingActions';
import type { RoutingAction } from './RoutingActions';

import Logger from '../../utils/Logger';
import { ERR_INVALID_ROUTE } from '../../utils/Errors';

const LOG = new Logger('RoutingSagas');

/*
 *
 * sagas
 *
 */

/*
 *
 * RoutingActions.goToPath()
 *
 */

function* goToPathWorker(action :RoutingAction) :Generator<*, *, *> {

  const { path, state } = action;
  if (path === null || path === undefined || !path.startsWith('/', 0)) {
    LOG.error(ERR_INVALID_ROUTE, path);
    yield put(routingFailure(ERR_INVALID_ROUTE, path));
    return;
  }

  // ISSUE: https://github.com/supasate/connected-react-router/issues/394#issuecomment-596713700
  // FIX: https://github.com/supasate/connected-react-router/pull/399
  // TODO: remove JSON.stringify() once the fix ^ is released
  yield put(push({ state: JSON.stringify(state), pathname: path }));
}

function* goToPathWatcher() :Generator<*, *, *> {

  yield takeEvery(GO_TO_PATH, goToPathWorker);
}

/*
 *
 * RoutingActions.goToRoot()
 *
 */

function* goToRootWatcher() :Generator<*, *, *> {

  yield takeEvery(GO_TO_ROOT, goToPathWorker);
}

/*
 *
 * exports
 *
 */

export {
  goToRootWatcher,
  goToPathWatcher,
  goToPathWorker,
};
