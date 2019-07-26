// @flow
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import type { FullyQualifiedName } from 'lattice';

import { APP_TYPES_FQNS as APP } from '../../../../shared/Consts';
import * as FQN from '../../../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;
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

const constructResponsePlanEAKIDMap = (responsePlan :Map, interactionStrategies :List) => {
  const interactionStrategiesEKIDs = interactionStrategies
    .map(strategy => strategy.getIn([OPENLATTICE_ID_FQN, 0]));

  const responsePlanEKID = responsePlan.getIn([OPENLATTICE_ID_FQN, 0]);

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
  constructResponsePlanEAKIDMap,
  constructResponsePlanFormData
};
