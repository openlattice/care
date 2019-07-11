/*
 * @flow
 */

import {
  fromJS,
  get,
  getIn,
  Map,
} from 'immutable';
import { Models } from 'lattice';
import { AccountUtils } from 'lattice-auth';
import { RequestStates } from 'redux-reqseq';

import type { SequenceAction } from 'redux-reqseq';

import {
  loadApp,
  initializeApplication,
} from './AppActions';

const { FullyQualifiedName } = Models;

const INITIAL_STATE :Map<*, *> = fromJS({
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

          const {
            app,
            appConfigs,
            appSettingsByOrgId,
            appTypes,
            edm
          } = value;
          const organizations :Object = {};

          const newState = Map().withMutations((mutable) => {
            appConfigs.forEach((appConfig :Object) => {

              const { organization } :Object = appConfig;
              const orgId :string = organization.id;
              organizations[orgId] = organization;

              appTypes.forEach((appType) => {
                const type = get(appType, 'type');
                // .toString() is necessary when using setIn as immutable attempts to set the FQN instance as the key
                const appTypeFqn = new FullyQualifiedName(type).toString();
                const appTypeESID = getIn(appConfig, ['config', appTypeFqn, 'entitySetId']);
                mutable.setIn([appTypeFqn, 'entitySetsByOrganization', orgId], appTypeESID);
              });

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
              const type = get(appType, 'type');
              const appTypeFqn = new FullyQualifiedName(type).toString();
              const propertyTypes = getEntityTypePropertyTypes(edm, appType.entityTypeId);
              const primaryKeys = edm.entityTypes[appType.entityTypeId].key;
              mutable
                .setIn([appTypeFqn, 'propertyTypes'], fromJS(propertyTypes))
                .setIn([appTypeFqn, 'primaryKeys'], fromJS(primaryKeys));
            });

            const appSettings = appSettingsByOrgId.get(selectedOrganizationId, Map());

            mutable
              .set('app', app)
              .set('organizations', fromJS(organizations))
              .set('selectedOrganizationSettings', appSettings)
              .set('selectedOrganizationId', selectedOrganizationId);
          });
          return newState;
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
