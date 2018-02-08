/*
 * @flow
 */

import Immutable from 'immutable';
import has from 'lodash/has';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  SELECT_ORGANIZATION,
  loadApp,
  loadConfigurations
} from './AppActionFactory';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  FOLLOW_UP_REPORT_FQN,
  HOSPITALS_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

const appearsInFqn :string = APPEARS_IN_FQN.getFullyQualifiedName();
const bhrFqn :string = BEHAVIORAL_HEALTH_REPORT_FQN.getFullyQualifiedName();
const followUpFqn :string = FOLLOW_UP_REPORT_FQN.getFullyQualifiedName();
const hospitalsFqn :string = HOSPITALS_FQN.getFullyQualifiedName();
const peopleFqn :string = PEOPLE_FQN.getFullyQualifiedName();

const APP_CONFIG_INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  entitySetsByOrganization: Immutable.Map(),
  primaryKeys: Immutable.List(),
  propertyTypes: Immutable.Map()
});

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  [appearsInFqn]: APP_CONFIG_INITIAL_STATE,
  [bhrFqn]: APP_CONFIG_INITIAL_STATE,
  [followUpFqn]: APP_CONFIG_INITIAL_STATE,
  [hospitalsFqn]: APP_CONFIG_INITIAL_STATE,
  [peopleFqn]: APP_CONFIG_INITIAL_STATE,
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
            .setIn([appearsInFqn, 'propertyTypes'], Immutable.Map())
            .setIn([appearsInFqn, 'primaryKeys'], Immutable.List())
            .setIn([bhrFqn, 'propertyTypes'], Immutable.Map())
            .setIn([bhrFqn, 'primaryKeys'], Immutable.List())
            .setIn([followUpFqn, 'propertyTypes'], Immutable.Map())
            .setIn([followUpFqn, 'primaryKeys'], Immutable.List())
            .setIn([hospitalsFqn, 'propertyTypes'], Immutable.Map())
            .setIn([hospitalsFqn, 'primaryKeys'], Immutable.List())
            .setIn([peopleFqn, 'propertyTypes'], Immutable.Map())
            .setIn([peopleFqn, 'primaryKeys'], Immutable.List());
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

            const appearsInConfig = configuration.config[appearsInFqn];
            const bhrConfig = configuration.config[bhrFqn];
            const followUpConfig = configuration.config[followUpFqn];
            const hospitalsConfig = configuration.config[hospitalsFqn];
            const peopleConfig = configuration.config[peopleFqn];

            newState = newState
              .setIn([appearsInFqn, 'entitySetsByOrganization', id], appearsInConfig.entitySetId)
              .setIn([bhrFqn, 'entitySetsByOrganization', id], bhrConfig.entitySetId)
              .setIn([followUpFqn, 'entitySetsByOrganization', id], followUpConfig.entitySetId)
              .setIn([peopleFqn, 'entitySetsByOrganization', id], peopleConfig.entitySetId);

            // 2018-02-08:
            // since hospitals is a new EntitySet for the app, old app installations will break without this check.
            if (has(hospitalsConfig, 'entitySetId')) {
              newState = newState.setIn([hospitalsFqn, 'entitySetsByOrganization', id], hospitalsConfig.entitySetId);
            }
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
            .setIn([appearsInFqn, 'entitySetsByOrganization'], Immutable.Map())
            .setIn([bhrFqn, 'entitySetsByOrganization'], Immutable.Map())
            .setIn([followUpFqn, 'entitySetsByOrganization'], Immutable.Map())
            .setIn([hospitalsFqn, 'entitySetsByOrganization'], Immutable.Map())
            .setIn([peopleFqn, 'entitySetsByOrganization'], Immutable.Map())
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
