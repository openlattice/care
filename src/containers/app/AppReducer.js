/*
 * @flow
 */

import { Models } from 'lattice';
import { List, Map, fromJS } from 'immutable';
import has from 'lodash/has';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  SWITCH_ORGANIZATION,
  loadApp,
} from './AppActions';

const { FullyQualifiedName } = Models;
const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  FOLLOW_UP_REPORT_FQN,
  HOSPITALS_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

const appearsInFqn :string = APPEARS_IN_FQN.toString();
const bhrFqn :string = BEHAVIORAL_HEALTH_REPORT_FQN.toString();
const followUpFqn :string = FOLLOW_UP_REPORT_FQN.toString();
const hospitalsFqn :string = HOSPITALS_FQN.toString();
const peopleFqn :string = PEOPLE_FQN.toString();

const APP_CONFIG_INITIAL_STATE :Map<*, *> = fromJS({
  entitySetsByOrganization: Map(),
  primaryKeys: List(),
  propertyTypes: Map(),
});

const INITIAL_STATE :Map<*, *> = fromJS({
  [appearsInFqn]: APP_CONFIG_INITIAL_STATE,
  [bhrFqn]: APP_CONFIG_INITIAL_STATE,
  [followUpFqn]: APP_CONFIG_INITIAL_STATE,
  [hospitalsFqn]: APP_CONFIG_INITIAL_STATE,
  [peopleFqn]: APP_CONFIG_INITIAL_STATE,
  actions: {
    loadApp: Map(),
  },
  app: Map(),
  appTypes: Map(),
  errors: {
    loadApp: Map(),
  },
  isLoadingApp: false,
  organizations: Map(),
  selectedOrganizationId: '',
});

const getEntityTypePropertyTypes = (edm :Object, entityTypeId :string) :Object => {
  const propertyTypesMap :Object = {};
  edm.entityTypes[entityTypeId].properties.forEach((propertyTypeId :string) => {
    propertyTypesMap[propertyTypeId] = edm.propertyTypes[propertyTypeId];
  });
  return propertyTypesMap;
};

export default function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case SWITCH_ORGANIZATION:
      return state.set('selectedOrganizationId', action.orgId);

    case loadApp.case(action.type): {
      return loadApp.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isLoadingApp', true)
            .setIn(['actions', 'loadApp', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = (action :any);
          if (!state.hasIn(['actions', 'loadApp', seqAction.id])) {
            return state;
          }

          const { value } = seqAction;
          if (value === null || value === undefined) {
            return state;
          }

          let newState :Map<*, *> = state;
          const {
            app,
            appConfigs,
            appTypes,
            edm
          } = value;
          const organizations :Object = {};

          appConfigs.forEach((appConfig :Object) => {

            const organization :Object = appConfig.organization;
            const orgId :string = organization.id;
            organizations[orgId] = organization;

            const appearsInConfig = appConfig.config[appearsInFqn];
            const bhrConfig = appConfig.config[bhrFqn];
            const followUpConfig = appConfig.config[followUpFqn];
            const hospitalsConfig = appConfig.config[hospitalsFqn];
            const peopleConfig = appConfig.config[peopleFqn];

            newState = newState
              .setIn([appearsInFqn, 'entitySetsByOrganization', orgId], appearsInConfig.entitySetId)
              .setIn([bhrFqn, 'entitySetsByOrganization', orgId], bhrConfig.entitySetId)
              .setIn([followUpFqn, 'entitySetsByOrganization', orgId], followUpConfig.entitySetId)
              .setIn([peopleFqn, 'entitySetsByOrganization', orgId], peopleConfig.entitySetId);

            // 2018-02-08:
            // since hospitals is a new EntitySet for the app, old app installations will break without this check.
            if (has(hospitalsConfig, 'entitySetId')) {
              newState = newState.setIn([hospitalsFqn, 'entitySetsByOrganization', orgId], hospitalsConfig.entitySetId);
            }
          });

          let selectedOrganizationId :string = state.get('selectedOrganizationId');
          if (appConfigs.length && !selectedOrganizationId.length) {
            selectedOrganizationId = appConfigs[0].organization.id;
          }

          appTypes.forEach((appType :Object) => {
            const appTypeFqn :string = FullyQualifiedName.toString(appType.type.namespace, appType.type.name);
            const propertyTypes = getEntityTypePropertyTypes(edm, appType.entityTypeId);
            const primaryKeys = edm.entityTypes[appType.entityTypeId].key;
            newState = newState
              .setIn([appTypeFqn, 'propertyTypes'], fromJS(propertyTypes))
              .setIn([appTypeFqn, 'primaryKeys'], fromJS(primaryKeys));
          });

          return newState
            .set('app', app)
            .set('organizations', fromJS(organizations))
            .set('selectedOrganizationId', selectedOrganizationId);
        },
        FAILURE: () => {
          // const seqAction :SequenceAction = (action :any);
          // TODO: actually set error object
          const error = {};
          return state
            .setIn([appearsInFqn, 'entitySetsByOrganization'], Map())
            .setIn([appearsInFqn, 'primaryKeys'], List())
            .setIn([appearsInFqn, 'propertyTypes'], Map())
            .setIn([bhrFqn, 'entitySetsByOrganization'], Map())
            .setIn([bhrFqn, 'primaryKeys'], List())
            .setIn([bhrFqn, 'propertyTypes'], Map())
            .setIn([followUpFqn, 'entitySetsByOrganization'], Map())
            .setIn([followUpFqn, 'primaryKeys'], List())
            .setIn([followUpFqn, 'propertyTypes'], Map())
            .setIn([hospitalsFqn, 'entitySetsByOrganization'], Map())
            .setIn([hospitalsFqn, 'primaryKeys'], List())
            .setIn([hospitalsFqn, 'propertyTypes'], Map())
            .setIn([peopleFqn, 'entitySetsByOrganization'], Map())
            .setIn([peopleFqn, 'primaryKeys'], List())
            .setIn([peopleFqn, 'propertyTypes'], Map())
            .setIn(['errors', 'loadApp'], fromJS(error))
            .set('organizations', Map())
            .set('selectedOrganizationId', '');
        },
        FINALLY: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isLoadingApp', false)
            .deleteIn(['actions', 'loadApp', seqAction.id]);
        }
      });
    }

    default:
      return state;
  }
}
