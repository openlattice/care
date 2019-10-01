// @flow

import React, { useEffect, useMemo, useState } from 'react';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import {
  Card,
  CardSegment,
  CardHeader,
  Spinner,
} from 'lattice-ui-kit';
import { Constants } from 'lattice';
import { List, Map, setIn } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { useFormData } from '../../../../components/hooks';
import { getResponsibleUser, getAboutPlan, updateAboutPlan } from './AboutActions';
import { getResponsibleUserOptions } from '../../../staff/StaffActions';
import { schema, uiSchema } from './AboutSchemas';
import { reduceRequestStates } from '../../../../utils/StateUtils';
import { getOptionsFromEntityList } from './AboutUtils';
import { PERSON_ID_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';

const { STAFF_FQN } = APP_TYPES_FQNS;
const { OPENLATTICE_ID_FQN } = Constants;
const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

type Props = {
  actions :{
    getAboutPlan :RequestSequence;
    getResponsibleUser :RequestSequence;
    getResponsibleUserOptions :RequestSequence;
    updateAboutPlan :RequestSequence;
  };
  aboutFormData :Map;
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  match :Match;
  propertyTypeIds :Map;
  responsibleUsers :List;
};

const AboutForm = (props :Props) => {
  const {
    aboutFormData,
    actions,
    entityIndexToIdMap,
    entitySetIds,
    fetchState,
    match,
    propertyTypeIds,
    responsibleUsers,
  } = props;

  const [formData, setFormData] = useFormData(aboutFormData);
  const [aboutSchema, setSchema] = useState(schema);
  const [prepopulated, setPrepopulated] = useState(false);

  const personEKID = match.params[PROFILE_ID_PARAM];
  useEffect(() => {
    actions.getAboutPlan(personEKID);
    actions.getResponsibleUserOptions();
  }, [actions, personEKID]);

  useEffect(() => {
    // when responsibleUsers changes, update schema to include enums
    const [values, labels] = getOptionsFromEntityList(responsibleUsers, PERSON_ID_FQN.toString());
    let newSchema = setIn(
      schema,
      [
        'properties',
        getPageSectionKey(1, 1),
        'properties',
        getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN),
        'enum'
      ],
      values
    );
    newSchema = setIn(
      newSchema,
      [
        'properties',
        getPageSectionKey(1, 1),
        'properties',
        getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN),
        'enumNames'
      ],
      labels
    );

    setSchema(newSchema);
  }, [responsibleUsers, setSchema]);

  useEffect(() => {
    if (entityIndexToIdMap.isEmpty()) {
      setPrepopulated(true);
    }
  }, [entityIndexToIdMap, setPrepopulated]);

  const formContext = useMemo(() => ({
    editAction: actions.updateAboutPlan,
    entityIndexToIdMap,
    entitySetIds,
    mappers: {},
    propertyTypeIds,
  }), [
    entitySetIds,
    actions,
    entityIndexToIdMap,
    propertyTypeIds,
  ]);

  const handleSubmit = (payload) => {
    console.log(payload.formData);
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
      <CardHeader mode="primary" padding="sm">
        About Plan
      </CardHeader>
      <Form
          disabled={prepopulated}
          formContext={formContext}
          formData={formData}
          // isSubmitting
          onChange={setFormData}
          onSubmit={handleSubmit}
          schema={aboutSchema}
          uiSchema={uiSchema} />
    </Card>
  );
};

const mapStateToProps = (state :Map) => {

  const fetchState = reduceRequestStates([
    state.getIn(['profile', 'about', 'fetchState'], RequestStates.STANDBY),
    state.getIn(['staff', 'responsibleUsers', 'fetchState'], RequestStates.STANDBY)
  ]);

  return {
    aboutFormData: state.getIn(['profile', 'about', 'formData'], Map()),
    entityIndexToIdMap: state.getIn(['profile', 'about', 'entityIndexToIdMap'], Map()),
    entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
    fetchState,
    propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
    responsibleUsers: state.getIn(['staff', 'responsibleUsers', 'data'], List()),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAboutPlan,
    getResponsibleUser,
    getResponsibleUserOptions,
    updateAboutPlan,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AboutForm);
