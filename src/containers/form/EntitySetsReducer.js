/*
 * @flow
 */

import Immutable from 'immutable';

import { ENTITY_SET_NAMES } from '../../shared/Consts';
import { loadDataModel } from './EntitySetsActionFactory';

const ENTITY_SET_DATA_MODEL :Map<*, *> = Immutable.fromJS({
  entitySet: Immutable.Map(),
  entityTypes: Immutable.Map(),
  propertyTypes: Immutable.Map()
});

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  [ENTITY_SET_NAMES.FORM]: ENTITY_SET_DATA_MODEL,
  [ENTITY_SET_NAMES.PEOPLE]: ENTITY_SET_DATA_MODEL,
  [ENTITY_SET_NAMES.APPEARS_IN]: ENTITY_SET_DATA_MODEL,
  isLoadingDataModel: false
});

export default function entitySetDataModelsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case loadDataModel.case(action.type): {
      return loadDataModel.reducer(state, action, {
        REQUEST: () => {
          return state.set('isLoadingDataModel', true);
        },
        SUCCESS: () => {

          let reportEntitySetDataModel :Object = {};
          let peopleEntitySetDataModel :Object = {};
          let appearsEntitySetDataModel :Object = {};

          const dataModels :Object[] = action.data.dataModels;
          dataModels.forEach((dataModel :Object) => {

            // Object.keys(entitySets).length === 1 should always be true
            const entitySetId :string = Object.keys(dataModel.entitySets)[0];
            const entitySet :Object = dataModel.entitySets[entitySetId];
            const entitySetName :string = dataModel.entitySets[entitySetId].name;

            // Object.keys(entityTypes).length === 1 should always be true
            // entitySet.entityTypeId === entityTypeId should always be true
            const entityTypeId :string = Object.keys(dataModel.entityTypes)[0];
            const entityType :Object = dataModel.entityTypes[entityTypeId];

            const tempDataModel :Object = {
              entitySet,
              entityType,
              propertyTypes: dataModel.propertyTypes
            };

            if (entitySetName === ENTITY_SET_NAMES.FORM) {
              reportEntitySetDataModel = tempDataModel;
            }
            else if (entitySetName === ENTITY_SET_NAMES.PEOPLE) {
              peopleEntitySetDataModel = tempDataModel;
            }
            else if (entitySetName === ENTITY_SET_NAMES.APPEARS_IN) {
              appearsEntitySetDataModel = tempDataModel;
            }
            // TODO: an else case should not be possible here, but what do we do if the names do not match?
            // TODO: Object.keys().length === 1 should always be true, but what do we do if it's not?
          });

          return state
            .set(ENTITY_SET_NAMES.FORM, Immutable.fromJS(reportEntitySetDataModel))
            .set(ENTITY_SET_NAMES.PEOPLE, Immutable.fromJS(peopleEntitySetDataModel))
            .set(ENTITY_SET_NAMES.APPEARS_IN, Immutable.fromJS(appearsEntitySetDataModel));
        },
        FAILURE: () => {
          return state
            .set(ENTITY_SET_NAMES.FORM, ENTITY_SET_DATA_MODEL)
            .set(ENTITY_SET_NAMES.PEOPLE, ENTITY_SET_DATA_MODEL)
            .set(ENTITY_SET_NAMES.APPEARS_IN, ENTITY_SET_DATA_MODEL);
        },
        FINALLY: () => {
          return state.set('isLoadingDataModel', false);
        }
      });
    }

    default:
      return state;
  }
}
