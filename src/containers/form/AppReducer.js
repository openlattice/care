/*
 * @flow
 */

import Immutable from 'immutable';

import { APP_NAMES } from '../../shared/Consts';
import {
  SELECT_ORGANIZATION,
  loadApp,
  loadConfigurations
} from './AppActionFactory';

const APP_CONFIG :Map<*, *> = Immutable.fromJS({
  propertyTypes: Immutable.Map(),
  primaryKeys: Immutable.List(),
  entitySetsByOrganization: Immutable.Map()
});

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isLoadingApp: false,
  isLoadingConfigurations: false,
  app: Immutable.Map(),
  appTypes: Immutable.Map(),
  organizations: Immutable.Map(),
  [APP_NAMES.FORM]: APP_CONFIG,
  [APP_NAMES.PEOPLE]: APP_CONFIG,
  [APP_NAMES.APPEARS_IN]: APP_CONFIG,
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
            .setIn([APP_NAMES.FORM, 'propertyTypes'], Immutable.Map())
            .setIn([APP_NAMES.FORM, 'primaryKeys'], Immutable.List())
            .setIn([APP_NAMES.PEOPLE, 'propertyTypes'], Immutable.Map())
            .setIn([APP_NAMES.PEOPLE, 'primaryKeys'], Immutable.List())
            .setIn([APP_NAMES.APPEARS_IN, 'propertyTypes'], Immutable.Map())
            .setIn([APP_NAMES.APPEARS_IN, 'primaryKeys'], Immutable.List());
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
                [APP_NAMES.FORM, 'entitySetsByOrganization', id],
                configuration.config[APP_NAMES.FORM].entitySetId
              )
              .setIn(
                [APP_NAMES.PEOPLE, 'entitySetsByOrganization', id],
                configuration.config[APP_NAMES.PEOPLE].entitySetId
              )
              .setIn(
                [APP_NAMES.APPEARS_IN, 'entitySetsByOrganization', id],
                configuration.config[APP_NAMES.APPEARS_IN].entitySetId
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
            .setIn([APP_NAMES.FORM, 'entitySetsByOrganization'], Immutable.Map())
            .setIn([APP_NAMES.PEOPLE, 'entitySetsByOrganization'], Immutable.Map())
            .setIn([APP_NAMES.APPEARS_IN, 'entitySetsByOrganization'], Immutable.Map())
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
