// @flow
import { List, Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import type { FullyQualifiedName } from 'lattice';

import { APP_TYPES_FQNS as APP } from '../../../../shared/Consts';
import * as FQN from '../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const getEntityArrayFormData = (
  data :List<Map>,
  esn :string,
  properties :List<FullyQualifiedName>,
  index :number
) :List<Map> => {
  return List().withMutations((mutator :List) => {
    data.forEach((entity :Map) => {
      const entityFormData = Map().withMutations((entityMutator) => {
        properties.forEach((fqn :FullyQualifiedName) => {
          entityMutator.set(getEntityAddressKey(index, esn, fqn), entity.getIn([fqn, 0]));
        });
      });
      mutator.push(entityFormData);
    });
  });
};

const constructResponsePlanFormData = (responsePlan :Map, interactionStrategies :List) => {
  const backgroundSummary = responsePlan.getIn([FQN.CONTEXT_FQN, 0], '');
  const strategyProperties = List([
    FQN.TITLE_FQN,
    FQN.DESCRIPTION_FQN,
  ]);

  const strategyFormData = getEntityArrayFormData(
    interactionStrategies,
    APP.INTERACTION_STRATEGY_FQN,
    strategyProperties,
    -1
  );

  const data = Map().withMutations((mutable) => {

    if (backgroundSummary) {
      mutable.setIn([
        getPageSectionKey(1, 1),
        getEntityAddressKey(0, APP.RESPONSE_PLAN_FQN, FQN.CONTEXT_FQN)
      ],
      backgroundSummary);
    }

    if (strategyFormData.size) {
      mutable.set(
        getPageSectionKey(1, 2),
        strategyFormData
      );
    }
  });

  return data;
};

const constructEntityIndexToIdMap = (responsePlanEKID :UUID, interactionStrategiesEKIDs :UUID[]) => {

  const addressToIdMap = Map().withMutations((mutable) => {
    if (responsePlanEKID) {
      mutable.setIn([APP.RESPONSE_PLAN_FQN.toString(), 0], responsePlanEKID);
    }

    if (interactionStrategiesEKIDs) {
      mutable.setIn([APP.INTERACTION_STRATEGY_FQN.toString(), -1], interactionStrategiesEKIDs);
    }

  });

  return addressToIdMap;
};

export {
  constructEntityIndexToIdMap,
  constructResponsePlanFormData
};
