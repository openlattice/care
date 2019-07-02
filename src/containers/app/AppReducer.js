/*
 * @flow
 */

import has from 'lodash/has';
import { List, Map, fromJS } from 'immutable';
import { Models } from 'lattice';
import { AccountUtils } from 'lattice-auth';
import { RequestStates } from 'redux-reqseq';

import type { SequenceAction } from 'redux-reqseq';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  loadApp,
  initializeApplication,
} from './AppActions';

const { FullyQualifiedName } = Models;
const {
  APP_SETTINGS_FQN,
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  HAS_FQN,
  HOSPITALS_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

const APP_CONFIG_INITIAL_STATE :Map<*, *> = fromJS({
  entitySetsByOrganization: Map(),
  primaryKeys: List(),
  propertyTypes: Map(),
});

const INITIAL_STATE :Map<*, *> = fromJS({
  [APPEARS_IN_FQN]: APP_CONFIG_INITIAL_STATE,
  [BEHAVIORAL_HEALTH_REPORT_FQN]: APP_CONFIG_INITIAL_STATE,
  [HOSPITALS_FQN]: APP_CONFIG_INITIAL_STATE,
  [PEOPLE_FQN]: APP_CONFIG_INITIAL_STATE,
  [REPORTED_FQN]: APP_CONFIG_INITIAL_STATE,
  [STAFF_FQN]: APP_CONFIG_INITIAL_STATE,
  actions: {
    loadApp: Map(),
  },
  app: Map(),
  appTypes: Map(),
  errors: {
    loadApp: Map(),
  },
  isLoadingApp: true,
  organizations: Map(),
  selectedOrganizationId: '',
  selectedOrganizationSettings: Map(),
  initializeState: RequestStates.STANDBY,
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

    case initializeApplication.case(action.type): {
      return initializeApplication.reducer(state, action, {
        REQUEST: () => state.set('initializeState', RequestStates.PENDING),
        SUCCESS: () => state.set('initializeState', RequestStates.SUCCESS),
        FAILURE: () => state.set('initializeState', RequestStates.FAILURE),
      });
    }

    case loadApp.case(action.type): {
      return loadApp.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = (action :any);
          return state
            .set('isLoadingApp', true)
            .set('selectedOrganizationId', '')
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
            appSettingsByOrgId,
            appTypes,
            edm
          } = value;
          const organizations :Object = {};

          appConfigs.forEach((appConfig :Object) => {

            const { organization } :Object = appConfig;
            const orgId :string = organization.id;
            organizations[orgId] = organization;

            const appearsInConfig = appConfig.config[APPEARS_IN_FQN];
            const appSettingsConfig = appConfig.config[APP_SETTINGS_FQN];
            const bhrConfig = appConfig.config[BEHAVIORAL_HEALTH_REPORT_FQN];
            const hasConfig = appConfig.config[HAS_FQN];
            const hospitalsConfig = appConfig.config[HOSPITALS_FQN];
            const peopleConfig = appConfig.config[PEOPLE_FQN];
            const physicalAppearanceConfig = appConfig.config[PHYSICAL_APPEARANCE_FQN];
            const reportedConfig = appConfig.config[REPORTED_FQN];
            const staffConfig = appConfig.config[STAFF_FQN];

            newState = newState
              .setIn([APP_SETTINGS_FQN, 'entitySetsByOrganization', orgId], appSettingsConfig.entitySetId)
              .setIn([APPEARS_IN_FQN, 'entitySetsByOrganization', orgId], appearsInConfig.entitySetId)
              .setIn([BEHAVIORAL_HEALTH_REPORT_FQN, 'entitySetsByOrganization', orgId], bhrConfig.entitySetId)
              .setIn([HAS_FQN, 'entitySetsByOrganization', orgId], hasConfig.entitySetId)
              .setIn([PEOPLE_FQN, 'entitySetsByOrganization', orgId], peopleConfig.entitySetId)
              .setIn([PHYSICAL_APPEARANCE_FQN, 'entitySetsByOrganization', orgId], physicalAppearanceConfig.entitySetId)
              .setIn([REPORTED_FQN, 'entitySetsByOrganization', orgId], reportedConfig.entitySetId)
              .setIn([STAFF_FQN, 'entitySetsByOrganization', orgId], staffConfig.entitySetId);

            // 2018-02-08:
            // since hospitals is a new EntitySet for the app, old app installations will break without this check.
            if (has(hospitalsConfig, 'entitySetId')) {
              newState = newState.setIn([HOSPITALS_FQN, 'entitySetsByOrganization', orgId], hospitalsConfig.entitySetId);
            }
          });

          let selectedOrganizationId :string = '';
          if (appConfigs.length && !selectedOrganizationId.length) {
            selectedOrganizationId = appConfigs[0].organization.id;
          }
          const storedOrganizationId :?string = AccountUtils.retrieveOrganizationId();
          if (storedOrganizationId) {
            selectedOrganizationId = storedOrganizationId;
          }

          appTypes.forEach((appType :Object) => {
            const appTypeFqn :string = FullyQualifiedName.toString(appType.type.namespace, appType.type.name);
            const propertyTypes = getEntityTypePropertyTypes(edm, appType.entityTypeId);
            const primaryKeys = edm.entityTypes[appType.entityTypeId].key;
            newState = newState
              .setIn([appTypeFqn, 'propertyTypes'], fromJS(propertyTypes))
              .setIn([appTypeFqn, 'primaryKeys'], fromJS(primaryKeys));
          });

          const appSettings = appSettingsByOrgId.get(selectedOrganizationId, Map());

          return newState
            .set('app', app)
            .set('organizations', fromJS(organizations))
            .set('selectedOrganizationSettings', appSettings)
            .set('selectedOrganizationId', selectedOrganizationId);
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
