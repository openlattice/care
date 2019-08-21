// @flow
import React, { Component } from 'react';
import { DateTime } from 'luxon';
import {
  Map,
  get,
  isImmutable,
  setIn,
} from 'immutable';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import { Card, CardSegment, Spinner } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Match } from 'react-router';

import { schema, uiSchema } from './schemas/ResponsePlanSchemas';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';
import { COMPLETED_DT_FQN, INDEX_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import {
  deleteInteractionStrategies,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';
import { isValidUuid } from '../../../../utils/Utils';
import { isEmptyString } from '../../../../utils/LangUtils';

const {
  INCLUDES_FQN,
  SUBJECT_OF_FQN,
  INTERACTION_STRATEGY_FQN,
  RESPONSE_PLAN_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

const {
  getPageSectionKey,
  getEntityAddressKey,
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
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  match :Match;
  propertyTypeIds :Map;
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
    const {
      actions,
      match,
      responsePlanEKID
    } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    if (!isValidUuid(responsePlanEKID)) {
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
    } = this.props;
    const {
      formData: prevFormData,
      match: prevMatch,
    } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      actions.getResponsePlan(personEKID);
    }

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    const prepopulated = formData
      .reduce((isPopulated, value) => {
        let isEmpty = isEmptyString(value);
        if (isImmutable(value)) {
          isEmpty = value.isEmpty();
        }
        return isPopulated || !isEmpty;
      }, false);

    this.setState({
      formData: formData.toJS(),
      prepopulated
    });
  }

  getAssociations = (formData :Object) => {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const nowAsIsoString :string = DateTime.local().toISO();
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

  // TODO: make updating indicies more efficient
  updateItemIndicies = ({ formData } :Object) => {
    const pageSection = getPageSectionKey(1, 2);
    const indexKey = getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, INDEX_FQN);
    const interactionItems = get(formData, pageSection);
    let newFormData = formData;

    if (Array.isArray(interactionItems)) {
      interactionItems.forEach((item, index) => {
        newFormData = setIn(newFormData, [pageSection, index, indexKey], index);
      });
    }

    this.setState({ formData: newFormData });
  }

  handleSubmit = ({ formData } :Object) => {
    const { actions, entitySetIds, propertyTypeIds } = this.props;
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(formData),
      entitySetIds,
      propertyTypeIds
    );
    actions.submitResponsePlan({
      associationEntityData,
      entityData,
      path: [],
      properties: formData
    });
  }

  handleAddInteractionStrategy = ({
    entityData,
    formData,
    path,
    properties
  } :Object) => {
    const {
      actions,
      entitySetIds,
      propertyTypeIds,
      responsePlanEKID,
    } = this.props;

    if (responsePlanEKID) {
      const associations = this.getInteractionStrategyAssociations(
        formData,
        getPageSectionKey(1, 2),
        DateTime.local().toISO(),
        responsePlanEKID,
      );
      const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);

      actions.submitResponsePlan({
        associationEntityData,
        entityData,
        path,
        properties
      });
    }
  }

  render() {
    const { formData, prepopulated } = this.state;
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      propertyTypeIds,
    } = this.props;

    const formContext = {
      addActions: {
        addInteractionStrategy: this.handleAddInteractionStrategy,
      },
      deleteAction: actions.deleteInteractionStrategies,
      editAction: actions.updateResponsePlan,
      entityIndexToIdMap,
      entitySetIds,
      mappers: {},
      propertyTypeIds,
    };

    if (fetchState === RequestStates.PENDING) {
      return (
        <Card>
          <CardSegment vertical>
            <Spinner size="2x" />
          </CardSegment>
        </Card>
      );
    }

    return (
      <Card>
        <Form
            disabled={prepopulated}
            formContext={formContext}
            formData={formData}
            onChange={this.updateItemIndicies}
            onSubmit={this.handleSubmit}
            schema={schema}
            uiSchema={uiSchema} />
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  entityIndexToIdMap: state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'responsePlan', 'fetchState']),
  formData: state.getIn(['profile', 'responsePlan', 'formData']),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  responsePlanEKID: state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap', RESPONSE_PLAN_FQN, 0]),
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
