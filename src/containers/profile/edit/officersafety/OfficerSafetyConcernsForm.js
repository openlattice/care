// @flow
import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { Constants } from 'lattice';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import { Card, CardSegment, Spinner } from 'lattice-ui-kit';
import { Map, get, setIn } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  submitOfficerSafetyConcerns,
  updateOfficerSafetyConcerns,
} from './OfficerSafetyActions';
import { schema, uiSchema } from './schemas/OfficerSafetyConcernsSchemas';
import { COMPLETED_DT_FQN, CONTEXT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { isValidUuid } from '../../../../utils/Utils';

const { OPENLATTICE_ID_FQN } = Constants;

const {
  INCLUDES_FQN,
  OFFICER_SAFETY_CONCERNS_FQN,
  PEOPLE_FQN,
  RESPONSE_PLAN_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

const {
  getPageSectionKey,
  getEntityAddressKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;

type Props = {
  actions :{
    deleteOfficerSafetyConcerns :RequestSequence;
    submitOfficerSafetyConcerns :RequestSequence;
    updateOfficerSafetyConcerns :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  personEKID :UUID;
  responsePlanEKID :UUID;
  propertyTypeIds :Map;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class OfficerSafetyConcernsForm extends Component<Props, State> {

  state = {
    formData: {},
    prepopulated: false
  }

  componentDidMount() {
    this.initializeFormData();
  }

  componentDidUpdate(prevProps :Props) {
    const { formData } = this.props;
    const { formData: prevFormData } = prevProps;

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    this.setState({
      formData: formData.toJS(),
      prepopulated: !formData.isEmpty()
    });
  }

  getAssociations = (formData :Object) => {
    const { personEKID, responsePlanEKID } = this.props;
    const nowAsIsoString :string = DateTime.local().toISO();
    const associations = this.getOfficerSafetyAssocations(
      formData,
      getPageSectionKey(1, 1),
      nowAsIsoString,
      responsePlanEKID
    );

    // if response plan doesn't exist, add new association
    if (!isValidUuid(responsePlanEKID) && isValidUuid(personEKID)) {
      associations.push(
        [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, RESPONSE_PLAN_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }

    return associations;
  }

  getOfficerSafetyAssocations = (
    formData :Object,
    pageSection :string,
    nowAsIsoString :string,
    idOrIndex :UUID | number = 0,
  ) => {
    const concernsSize :number = get(formData, pageSection, []).length;
    const associations :any[][] = [];
    for (let i = 0; i < concernsSize; i += 1) {
      associations.push(
        [INCLUDES_FQN, idOrIndex, RESPONSE_PLAN_FQN, i, OFFICER_SAFETY_CONCERNS_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }

    return associations;
  }

  handleSubmit = ({ formData } :Object) => {
    const {
      actions,
      entitySetIds,
      propertyTypeIds,
      responsePlanEKID,
      personEKID,
    } = this.props;

    let finalFormData = formData;
    if (!isValidUuid(responsePlanEKID) && isValidUuid(personEKID)) {
      // modify formData to create a blank responsePlan if one doesn't already exist
      finalFormData = setIn(formData, [
        getPageSectionKey(1, 2),
        getEntityAddressKey(0, RESPONSE_PLAN_FQN, CONTEXT_FQN)
      ], undefined);
    }
    const entityData = processEntityData(finalFormData, entitySetIds, propertyTypeIds);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(finalFormData),
      entitySetIds,
      propertyTypeIds
    );

    actions.submitOfficerSafetyConcerns({
      associationEntityData,
      entityData,
      path: [],
      properties: formData
    });
  }

  handleAddOfficerSafetyConcern = ({
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
      const associations = this.getAssociations(formData);
      const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);

      actions.submitOfficerSafetyConcerns({
        associationEntityData,
        entityData,
        path,
        properties
      });
    }
  }

  render() {
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      propertyTypeIds,
    } = this.props;
    const { formData, prepopulated } = this.state;
    const formContext = {
      addActions: {
        addOfficerSafetyConcerns: this.handleAddOfficerSafetyConcern
      },
      editAction: actions.updateOfficerSafetyConcerns,
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
      <Form
          formData={formData}
          disabled={prepopulated}
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.handleSubmit}
          formContext={formContext} />
    );
  }
}

const mapStateToProps = state => ({
  entityIndexToIdMap: state.getIn(['profile', 'officerSafety', 'officerSafetyConcerns', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'officerSafety', 'officerSafetyConcerns', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'officerSafety', 'officerSafetyConcerns', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  responsePlanEKID: state.getIn(['profile', 'responsePlan', 'data', OPENLATTICE_ID_FQN, 0])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateOfficerSafetyConcerns,
    submitOfficerSafetyConcerns,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(OfficerSafetyConcernsForm);
