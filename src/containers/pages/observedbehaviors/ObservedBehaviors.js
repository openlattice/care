/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { List, Map } from 'immutable';

import StyledCheckbox from '../../../components/controls/StyledCheckbox';
import StyledInput from '../../../components/controls/StyledInput';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { OBSERVED_BEHAVIORS, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import { BEHAVIORS, DEMEANORS } from './Constants';
import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
  Header,
  RequiredField
} from '../../../components/crisis/FormComponents';

import { getInvalidFields } from './Reducer';
import * as ActionFactory from './ActionFactory';

type Props = {
  values :Map<*, *>,
  actions :{
    setInputValue :(value :{ field :string, value :Object }) => void
  }
}

const ObservedBehaviors = ({ values, actions } :Props) => {

  const onCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    let valueList = values.get(name, List());

    if (!checked && valueList.includes(value)) {
      valueList = valueList.delete(valueList.indexOf(value));
    }
    else if (!valueList.includes(value)) {
      valueList = valueList.push(value);
    }

    actions.setInputValue({
      field: name,
      value: valueList
    });
  };

  const renderCheckboxList = (field, valueList, otherField) => {
    const currentValues = values.get(field, List());

    const onChange = (event) => {
      onCheckboxChange(event);

      const { value, checked } = event.target;
      if (!!otherField && value === OTHER && !checked) {
        actions.setInputValue({ field: otherField, value: '' });
      }
    };

    const checkboxes = valueList.map(value => (
      <StyledCheckbox
          name={field}
          value={value}
          label={value}
          key={`${field}-${value}`}
          checked={currentValues.includes(value)}
          onChange={onChange} />
    ));

    return (
      <>
        {checkboxes}
        { !!otherField && currentValues.includes(OTHER) ? (
          <StyledInput
              key={`${field}-other-value`}
              value={values.get(otherField, '')}
              onChange={({ target }) => actions.setInputValue({ field: otherField, value: target.value })} />
        ) : null}
      </>
    );
  };

  const renderSingleCheckbox = (field, label) => {
    return (
      <StyledCheckbox
          name={field}
          checked={values.get(field)}
          label={label}
          onChange={({ target }) => actions.setInputValue({ field, value: target.checked })} />
    );
  };

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Additional Subject Information</h1>
          <span>Check all that apply.</span>
        </Header>
        {renderSingleCheckbox(OBSERVED_BEHAVIORS.VETERAN, 'Served in the military?')}
      </FormSection>
      <FormSectionWithValidation invalid={invalidFields.includes(OBSERVED_BEHAVIORS.BEHAVIORS)}>
        <Header>
          <h1>Behaviors</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>
        {renderCheckboxList(OBSERVED_BEHAVIORS.BEHAVIORS, BEHAVIORS, OBSERVED_BEHAVIORS.OTHER_BEHAVIOR)}
      </FormSectionWithValidation>
      <FormSectionWithValidation invalid={invalidFields.includes(OBSERVED_BEHAVIORS.DEMEANORS)}>
        <Header>
          <h1>Demeanors Observed Around Law Enforcement</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>
        {renderCheckboxList(OBSERVED_BEHAVIORS.DEMEANORS, DEMEANORS, OBSERVED_BEHAVIORS.OTHER_DEMEANOR)}
      </FormSectionWithValidation>
    </FormWrapper>
  );
};

function mapStateToProps(state) {

  return {
    values: state.get(STATE.OBSERVED_BEHAVIORS)
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {};

  Object.keys(ActionFactory).forEach((action) => {
    actions[action] = ActionFactory[action];
  });

  return {
    actions: {
      ...bindActionCreators(actions, dispatch)
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ObservedBehaviors));
