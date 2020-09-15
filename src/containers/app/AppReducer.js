/*
 * @flow
 */

import {
  Map,
  fromJS,
} from 'immutable';
import { AccountUtils } from 'lattice-auth';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  initializeApplication,
  loadApp,
} from './AppActions';

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

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

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
          const seqAction :SequenceAction = action;
          return state
            .set('isLoadingApp', true)
            .set('selectedOrganizationId', '')
            .setIn(['actions', 'loadApp', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = action;
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
          } = value;
          const organizations :Object = {};

          let selectedOrganizationId :string = '';
          if (appConfigs.length) {
            selectedOrganizationId = appConfigs[0].organization.id;
          }
          const storedOrganizationId :?string = AccountUtils.retrieveOrganizationId();
          if (storedOrganizationId) {
            selectedOrganizationId = storedOrganizationId;
          }

          const newState = Map().withMutations((mutable) => {
            appConfigs.forEach((appConfig :Object) => {

              const { config, organization } :Object = appConfig;
              const orgId :string = organization.id;
              organizations[orgId] = organization;
              if (orgId === selectedOrganizationId) {
                // TODO: replace selectedOrgEntitySetIds with plain config
                const selectedOrgEntitySetIds = Object.fromEntries(Object.entries(config)
                  .map(([appTypeFQN, appTypeValue]) => [appTypeFQN, appTypeValue.entitySetId]));
                mutable.set('selectedOrgEntitySetIds', fromJS(selectedOrgEntitySetIds));
              }
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
          const seqAction :SequenceAction = action;
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
