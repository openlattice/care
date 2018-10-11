/*
 * @flow
 */

import * as Routes from './Routes';

declare type RoutingAction = {
  type :string;
  route :string;
};

const GO_TO_ROOT :'GO_TO_ROOT' = 'GO_TO_ROOT';
function goToRoot() :RoutingAction {
  return {
    route: Routes.ROOT,
    type: GO_TO_ROOT,
  };
}

const GO_TO_ROUTE :'GO_TO_ROUTE' = 'GO_TO_ROUTE';
function goToRoute(route :string) :RoutingAction {
  return {
    route,
    type: GO_TO_ROUTE,
  };
}

const ROUTING_FAILURE :'ROUTING_FAILURE' = 'ROUTING_FAILURE';
function routingFailure(errorMessage :string, route :any) :Object {
  return {
    route,
    error: errorMessage,
    type: ROUTING_FAILURE,
  };
}

export {
  GO_TO_ROOT,
  GO_TO_ROUTE,
  ROUTING_FAILURE,
  goToRoot,
  goToRoute,
  routingFailure,
};

export type {
  RoutingAction,
};
