// @flow
import React, { Component } from 'react';
import { Constants } from 'lattice';
import { DateTime } from 'luxon';
import {
  Map,
  get,
} from 'immutable';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Match } from 'react-router';

import { schema, uiSchema } from './schemas/ResponsePlanSchemas';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';
import { COMPLETED_DT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import {
  deleteInteractionStrategies,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';

const { OPENLATTICE_ID_FQN } = Constants;

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
    deleteInteractionStrategies :RequestSequence;
    getResponsePlan :RequestSequence;
    submitResponsePlan :RequestSequence;
    updateResponsePlan :RequestSequence;
  },
  deleteState :RequestState;
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  formData :Map;
  match :Match;
  propertyTypeIds :Map;
  updateState :RequestState;
  responsePlanEKID :UUID;
};

type State = {
  formData :Object;
  prepopulated :boolean;
}

class ResponsePlanForm extends Component<Props, State> {

  state = {
    formData: {},
    prepopulated: false
  };

  componentDidMount() {
    const { actions, formData, match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    if (formData.isEmpty()) {
      actions.getResponsePlan(personEKID);
    }
    else {
      this.initializeFormData();
    }
  }

  componentDidUpdate(prevProps :Props) {
    const {
      actions,
      formData,
      match,
      updateState
    } = this.props;
    const {
      formData: prevFormData,
      match: prevMatch,
      updateState: prevUpdateState
    } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      actions.getResponsePlan(personEKID);
    }

    if (updateState === RequestStates.SUCCESS
      && prevUpdateState === RequestStates.PENDING) {
      actions.getResponsePlan(personEKID);
    }

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    this.setState({
      formData: formData.toJS(),
      prepopulated: !!formData.size
    });
  }

  getAssociations = (formData :Object) => {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const nowAsIsoString :string = DateTime.local().toString();
    return [
      [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, RESPONSE_PLAN_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }],
      ...this.getInteractionStrategyAssociations(
        formData,
        getPageSectionKey(1, 2),
        nowAsIsoString
      )
    ];
  }

  getInteractionStrategyAssociations = (
    formData :Object,
    pageSection :string,
    nowAsIsoString :string,
    idOrIndex :UUID | number = 0,
  ) => {
    const strategyAssociations :any[][] = [];
    const strategySize :number = get(formData, pageSection, []).length;
    for (let i = 0; i < strategySize; i += 1) {
      strategyAssociations.push(
        [INCLUDES_FQN, idOrIndex, RESPONSE_PLAN_FQN, i, INTERACTION_STRATEGY_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }
    return strategyAssociations;
  }

  handleChange = ({ formData: newFormData } :Object) => {
    this.setState({
      formData: newFormData
    });
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

  handleAddInteractionStrategy = ({ formData } :Object) => {
    const {
      actions,
      entitySetIds,
      propertyTypeIds,
      responsePlanEKID,
    } = this.props;

    if (responsePlanEKID) {
      const associations = this.getInteractionStrategyAssociations(
        formData,
        getPageSectionKey(1, 1),
        DateTime.local().toISO(),
        responsePlanEKID,
      );
      const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
      const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);

      actions.submitResponsePlan({ entityData, associationEntityData });
    }

  }

  render() {
    const { formData, prepopulated } = this.state;
    const {
      actions,
      deleteState,
      entityIndexToIdMap,
      entitySetIds,
      propertyTypeIds,
      updateState,
    } = this.props;

    const formContext = {
      addActions: {
        addInteractionStrategy: this.handleAddInteractionStrategy,
      },
      deleteState,
      deleteAction: actions.deleteInteractionStrategies,
      editAction: actions.updateResponsePlan,
      entityIndexToIdMap,
      entitySetIds,
      mappers: {},
      propertyTypeIds,
      updateState: updateState === RequestStates.PENDING,
    };

    return (
      <Form
          disabled={prepopulated}
          formContext={formContext}
          formData={formData}
          onChange={this.handleChange}
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.handleSubmit} />
    );
  }
}

const mapStateToProps = state => ({
  deleteState: state.getIn(['profile', 'responsePlan', 'deleteState']),
  entityIndexToIdMap: state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']),
  responsePlanEKID: state.getIn(['profile', 'responsePlan', 'responsePlan', OPENLATTICE_ID_FQN, 0]),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  formData: state.getIn(['profile', 'responsePlan', 'formData']),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  updateState: state.getIn(['profile', 'responsePlan', 'updateState']),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    deleteInteractionStrategies,
    getResponsePlan,
    submitResponsePlan,
    updateResponsePlan,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ResponsePlanForm);
