/*
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { List, Map } from 'immutable';

import StyledInput from '../../../components/controls/StyledInput';
import StyledCheckbox from '../../../components/controls/StyledCheckbox';
import YesNoToggle from '../../../components/controls/YesNoToggle';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { OFFICER_SAFETY, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import {
  TECHNIQUES,
  WEAPONS,
  RELATIONSHIP_TYPES,
  INJURY_TYPES
} from './Constants';
import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
  FormText,
  Header,
  IndentWrapper,
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

const OfficerSafety = ({ values, actions } :Props) => {

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

  const renderInput = (field) => {
    return (
      <StyledInput
          name={field}
          value={values.get(field)}
          onChange={({ target }) => actions.setInputValue({ field, value: target.value })} />
    );
  };

  const clearDependentFields = (dependentListFields, dependentStringFields) => {
    if (dependentListFields) {
      dependentListFields.forEach((dependentListField) => {
        actions.setInputValue({
          field: dependentListField,
          value: List()
        });
      });
    }
    if (dependentStringFields) {
      dependentStringFields.forEach((dependentStringField) => {
        actions.setInputValue({
          field: dependentStringField,
          value: ''
        });
      });
    }
  };

  const renderYesNoToggle = (field, dependentListFields, dependentStringFields) => {

    const onChange = (value) => {
      actions.setInputValue({ field, value });
      clearDependentFields(dependentListFields, dependentStringFields);
    };

    return <YesNoToggle value={values.get(field)} onChange={onChange} />;
  };

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Techniques</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>
        {renderCheckboxList(OFFICER_SAFETY.TECHNIQUES, TECHNIQUES)}
      </FormSection>
      <FormSection>
        <Header>
          <h1>Threats / Violence / Weapons</h1>
          <RequiredField>Select all that apply.</RequiredField>
        </Header>

        <FormText>Did subject use/brandish a weapon?</FormText>

        {renderYesNoToggle(OFFICER_SAFETY.HAD_WEAPON, [OFFICER_SAFETY.WEAPONS], [OFFICER_SAFETY.OTHER_WEAPON])}
        {values.get(OFFICER_SAFETY.HAD_WEAPON)
          ? (
            <IndentWrapper>
              <FormSectionWithValidation invalid={invalidFields.includes(OFFICER_SAFETY.WEAPONS)}>
                {renderCheckboxList(OFFICER_SAFETY.WEAPONS, WEAPONS, OFFICER_SAFETY.OTHER_WEAPON)}
              </FormSectionWithValidation>
            </IndentWrapper>)
          : null}

        <FormText>Did subject threaten violence toward another person?</FormText>

        {renderYesNoToggle(
          OFFICER_SAFETY.THREATENED_VIOLENCE,
          [OFFICER_SAFETY.THREATENED_PERSON_RELATIONSHIP],
          []
        )}
        {values.get(OFFICER_SAFETY.THREATENED_VIOLENCE)
          ? (
            <IndentWrapper>
              <FormText>Threatened person relationship(s)</FormText>
              {renderCheckboxList(OFFICER_SAFETY.THREATENED_PERSON_RELATIONSHIP, RELATIONSHIP_TYPES)}
            </IndentWrapper>)
          : null}

        <FormText>Were there any injuries during the incident?</FormText>

        {renderYesNoToggle(
          OFFICER_SAFETY.HAD_INJURIES,
          [OFFICER_SAFETY.INJURY_TYPE],
          [OFFICER_SAFETY.INJURY_DESCRIPTION, OFFICER_SAFETY.OTHER_INJURY_TYPE]
        )}
        {values.get(OFFICER_SAFETY.HAD_INJURIES)
          ? (
            <IndentWrapper>
              <FormSectionWithValidation invalid={invalidFields.includes(OFFICER_SAFETY.INJURY_DESCRIPTION)}>
                <FormText>
                  <RequiredField>Injured Parties</RequiredField>
                </FormText>
                {renderInput(OFFICER_SAFETY.INJURY_DESCRIPTION)}
              </FormSectionWithValidation>
              <FormSectionWithValidation invalid={invalidFields.includes(OFFICER_SAFETY.INJURY_TYPE)}>
                <FormText>Injury type(s)</FormText>
                {renderCheckboxList(OFFICER_SAFETY.INJURY_TYPE, INJURY_TYPES, OFFICER_SAFETY.OTHER_INJURY_TYPE)}
              </FormSectionWithValidation>
            </IndentWrapper>)
          : null}

      </FormSection>
    </FormWrapper>
  );
};

function mapStateToProps(state) {

  return {
    values: state.get(STATE.OFFICER_SAFETY)
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OfficerSafety));
