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
import { STATE } from '../../../utils/constants/StateConstants';
import { CRISIS_NATURE, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import { NATURE_OF_CRISIS, ASSISTANCES, HOUSING_SITUATIONS } from './Constants';
import {
  FormWrapper,
  FormSection,
  Header,
  RequiredField
} from '../../../components/crisis/FormComponents';

import * as ActionFactory from './ActionFactory';

type Props = {
  values :Map<*, *>,
  actions :{
    setInputValue :(value :{ field :string, value :Object }) => void
  }
}

const NatureOfCrisis = ({ values, actions } :Props) => {

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

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Nature of Crisis</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>
        {renderCheckboxList(CRISIS_NATURE.NATURE_OF_CRISIS, NATURE_OF_CRISIS)}
      </FormSection>
      <FormSection>
        <Header>
          <h1>Assistance on Scene for Subject</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>
        {renderCheckboxList(CRISIS_NATURE.ASSISTANCE, ASSISTANCES, CRISIS_NATURE.OTHER_ASSISTANCE)}
      </FormSection>
      <FormSection>
        <Header>
          <h1>Current Housing Situation</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>
        {renderCheckboxList(CRISIS_NATURE.HOUSING, HOUSING_SITUATIONS)}
      </FormSection>
    </FormWrapper>
  );
};

function mapStateToProps(state) {

  return {
    values: state.get(STATE.NATURE_OF_CRISIS)
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NatureOfCrisis));
