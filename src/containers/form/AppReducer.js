/*
 * @flow
 */

import Immutable from 'immutable';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  SELECT_ORGANIZATION,
  loadApp,
  loadConfigurations
} from './AppActionFactory';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
  FOLLOW_UP_REPORT_FQN,
  PEOPLE_FQN,
  APPEARS_IN_FQN
} = APP_TYPES_FQNS;

const APP_CONFIG_INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  entitySetsByOrganization: Immutable.Map(),
  primaryKeys: Immutable.List(),
  propertyTypes: Immutable.Map()
});

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName()]: APP_CONFIG_INITIAL_STATE,
  [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName()]: APP_CONFIG_INITIAL_STATE,
  [PEOPLE_FQN.getFullyQualifiedName()]: APP_CONFIG_INITIAL_STATE,
  [APPEARS_IN_FQN.getFullyQualifiedName()]: APP_CONFIG_INITIAL_STATE,
  isLoadingApp: false,
  isLoadingConfigurations: false,
  app: Immutable.Map(),
  appTypes: Immutable.Map(),
  organizations: Immutable.Map(),
  selectedOrganization: ''
});

export default function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case loadApp.case(action.type): {
      return loadApp.reducer(state, action, {
        REQUEST: () => {
          return state.set('isLoadingApp', true);
        },
        SUCCESS: () => {
          const { app, edm, appTypes } = action.value;

          let newState = state.set('app', app);

          const getProperties = (entityTypeId) => {
            const properties = {};
            edm.entityTypes[entityTypeId].properties.forEach((propertyTypeId) => {
              properties[propertyTypeId] = edm.propertyTypes[propertyTypeId];
            });
            return properties;
          };

          appTypes.forEach((appType) => {
            const fqn = `${appType.type.namespace}.${appType.type.name}`;
            const properties = getProperties(appType.entityTypeId);
            const primaryKeys = edm.entityTypes[appType.entityTypeId].key;
            newState = newState
              .setIn([fqn, 'propertyTypes'], Immutable.fromJS(properties))
              .setIn([fqn, 'primaryKeys'], Immutable.fromJS(primaryKeys));
          });
          return newState;
        },
        FAILURE: () => {
          return state
            .setIn([BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'propertyTypes'], Immutable.Map())
            .setIn([BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'primaryKeys'], Immutable.List())
            .setIn([FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'propertyTypes'], Immutable.Map())
            .setIn([FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'primaryKeys'], Immutable.List())
            .setIn([PEOPLE_FQN.getFullyQualifiedName(), 'propertyTypes'], Immutable.Map())
            .setIn([PEOPLE_FQN.getFullyQualifiedName(), 'primaryKeys'], Immutable.List())
            .setIn([APPEARS_IN_FQN.getFullyQualifiedName(), 'propertyTypes'], Immutable.Map())
            .setIn([APPEARS_IN_FQN.getFullyQualifiedName(), 'primaryKeys'], Immutable.List());
        },
        FINALLY: () => {
          return state.set('isLoadingApp', false);
        }
      });
    }

    case loadConfigurations.case(action.type): {
      return loadConfigurations.reducer(state, action, {
        REQUEST: () => {
          return state.set('isLoadingConfigurations', true);
        },
        SUCCESS: () => {
          const configurations = action.value;
          let newState = state;
          const organizations = {};

          configurations.forEach((configuration) => {
            const id = configuration.organization.id;
            organizations[id] = configuration.organization;
            newState = newState
              .setIn(
                [BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', id],
                configuration.config[BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName()].entitySetId
              )
              .setIn(
                [FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', id],
                configuration.config[FOLLOW_UP_REPORT_FQN.getFullyQualifiedName()].entitySetId
              )
              .setIn(
                [PEOPLE_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', id],
                configuration.config[PEOPLE_FQN.getFullyQualifiedName()].entitySetId
              )
              .setIn(
                [APPEARS_IN_FQN.getFullyQualifiedName(), 'entitySetsByOrganization', id],
                configuration.config[APPEARS_IN_FQN.getFullyQualifiedName()].entitySetId
              );
          });

          let selectedOrganization = state.get('selectedOrganization');
          if (configurations.length && !selectedOrganization.length) {
            selectedOrganization = configurations[0].organization.id;
          }

          return newState
            .set('organizations', Immutable.fromJS(organizations))
            .set('selectedOrganization', selectedOrganization);
        },
        FAILURE: () => {
          return state
            .setIn([BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName(), 'entitySetsByOrganization'], Immutable.Map())
            .setIn([FOLLOW_UP_REPORT_FQN.getFullyQualifiedName(), 'entitySetsByOrganization'], Immutable.Map())
            .setIn([PEOPLE_FQN.getFullyQualifiedName(), 'entitySetsByOrganization'], Immutable.Map())
            .setIn([APPEARS_IN_FQN.getFullyQualifiedName(), 'entitySetsByOrganization'], Immutable.Map())
            .set('organizations', Immutable.Map())
            .set('selectedOrganization', '');
        },
        FINALLY: () => {
          return state.set('isLoadingConfigurations', false);
        }
      });
    }

    case SELECT_ORGANIZATION:
      return state.set('selectedOrganization', action.orgId);

    default:
      return state;
  }
}
