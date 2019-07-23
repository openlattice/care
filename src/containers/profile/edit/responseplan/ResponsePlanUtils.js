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
  const backgroundSummary = responsePlan.getIn([FQN.CONTEXT_FQN, 0]);
  const strategyProperties = List([
    FQN.TITLE_FQN,
    FQN.DESCRIPTION_FQN,
  ]);

  const data = Map().withMutations((mutable) => {

    mutable.setIn([
      getPageSectionKey(1, 1),
      getEntityAddressKey(0, APP.RESPONSE_PLAN_FQN, FQN.CONTEXT_FQN)
    ],
    backgroundSummary);

    mutable.set(
      getPageSectionKey(1, 2),
      getEntityArrayFormData(
        interactionStrategies,
        APP.INTERACTION_STRATEGY_FQN,
        strategyProperties,
        -1
      )
    );
  });

  return data;
};

const constructResponsePlanEAKIDMap = (interactionStrategies :List) => {
  const interactionStrategiesEKID = interactionStrategies
    .map(strategy => strategy.getIn([OPENLATTICE_ID_FQN, 0]));

  return fromJS({
    [APP.INTERACTION_STRATEGY_FQN]: Map([
      [-1, interactionStrategiesEKID]
    ])
  });
};

export {
  constructResponsePlanEAKIDMap,
  constructResponsePlanFormData
};
