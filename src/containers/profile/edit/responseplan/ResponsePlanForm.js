// @flow
import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { get, Map } from 'immutable';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';
import type { Match } from 'react-router';

import { schema, uiSchema } from './schemas/ResponsePlanSchemas';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';
import { COMPLETED_DT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { submitResponsePlan } from './ResponsePlanActions';

const {
  INCLUDES_FQN,
  SUBJECT_OF_FQN,
  INTERACTION_STRATEGY_FQN,
  RESPONSE_PLAN_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;


const {
  getPageSectionKey,
  processEntityData,
  processAssociationEntityData
} = DataProcessingUtils;

type Props = {
  actions :{
    submitResponsePlan :RequestSequence
  },
  entitySetIds :Map;
  match :Match;
  propertyTypeIds :Map;
};

class EditResponsePlan extends Component<Props> {

  getAssociations = (formData :Object) => {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const nowAsIsoString :string = DateTime.local().toString();
    return [
      [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, RESPONSE_PLAN_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }],
      ...this.getInteractionStrategyAssociations(formData, nowAsIsoString)
    ];
  }

  getInteractionStrategyAssociations = (formData :Object, nowAsIsoString :string) => {
    const strategyAssociations :any[][] = [];
    const strategySize :number = get(formData, getPageSectionKey(1, 2), []).length;
    for (let i = 0; i < strategySize; i += 1) {
      strategyAssociations.push(
        [INCLUDES_FQN, 0, RESPONSE_PLAN_FQN, i, INTERACTION_STRATEGY_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }
    return strategyAssociations;
  }

  handleSubmit = ({ formData } :Object) => {
    const { actions, entitySetIds, propertyTypeIds } = this.props;
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(formData),
      entitySetIds,
      propertyTypeIds
    );
    actions.submitResponsePlan({ entityData, associationEntityData });
  }

  render() {
    return (
      <Form
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.handleSubmit} />
    );
  }
}

const mapStateToProps = state => ({
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map())
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    submitResponsePlan
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(EditResponsePlan);
