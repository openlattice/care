/*
 * @flow
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { List, Map } from 'immutable';

import StyledCheckbox from '../../../components/controls/StyledCheckbox';
import StyledInput from '../../../components/controls/StyledInput';
import StyledRadio from '../../../components/controls/StyledRadio';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { OBSERVED_BEHAVIORS, OTHER } from '../../../utils/constants/CrisisReportConstants';
import {
  BEHAVIORS,
  SUICIDE_BEHAVIORS,
  SUICIDE_ACTION_TYPE,
  SUICIDE_METHODS,
  DEMEANORS
} from './Constants';
import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
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
  },
  disabled :boolean;
}

const ObservedBehaviors = ({ values, actions, disabled } :Props) => {

  const onCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    let valueList = values.get(name, List());

    if (!checked && valueList.includes(value)) {
      valueList = valueList.delete(valueList.indexOf(value));
    }
    else if (!valueList.includes(value)) {
      valueList = valueList.push(value);
    }

    if (value === SUICIDE_BEHAVIORS && !checked) {
      actions.setInputValue({
        field: OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE,
        value: ''
      });
      actions.setInputValue({
        field: OBSERVED_BEHAVIORS.SUICIDE_METHODS,
        value: List()
      });
      actions.setInputValue({
        field: OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD,
        value: ''
      });
    }

    actions.setInputValue({
      field: name,
      value: valueList
    });
  };

  const renderCheckboxList = (field, valueList, otherField, suicideDetailsElements) => {
    const currentValues = values.get(field, List());

    const onChange = (event) => {
      onCheckboxChange(event);

      const { value, checked } = event.target;
      if (!!otherField && value === OTHER && !checked) {
        actions.setInputValue({ field: otherField, value: '' });
      }
    };

    const checkboxes = valueList.map(value => (
      <>
        <StyledCheckbox
            disabled={disabled}
            name={field}
            value={value}
            label={value}
            key={`${field}-${value}`}
            checked={currentValues.includes(value)}
            onChange={onChange} />
        { value === SUICIDE_BEHAVIORS && currentValues.includes(SUICIDE_BEHAVIORS) ? suicideDetailsElements : null }
      </>
    ));

    return (
      <>
        {checkboxes}
        { !!otherField && currentValues.includes(OTHER) ? (
          <StyledInput
              disabled={disabled}
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
          disabled={disabled}
          name={field}
          checked={values.get(field)}
          label={label}
          onChange={({ target }) => actions.setInputValue({ field, value: target.checked })} />
    );
  };

  const renderRadio = (field, value, label, inverseDependentField) => {
    const checked = values.get(field) === value;

    const onChange = () => {
      if (inverseDependentField) {
        actions.setInputValue({
          field: inverseDependentField,
          value: ''
        });
      }
      actions.setInputValue({ field, value });
    };

    return (
      <StyledRadio
          disabled={disabled}
          label={label}
          checked={checked}
          onChange={onChange} />
    );
  };

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  const suicideDetails = () => {
    return (
      <IndentWrapper extraIndent>
        <Header noMargin><span>Suicide threat or attempt?</span></Header>
        {SUICIDE_ACTION_TYPE.map(type => renderRadio(OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE, type, type))}
        <Header><span>Suicide methods</span></Header>
        {renderCheckboxList(
          OBSERVED_BEHAVIORS.SUICIDE_METHODS,
          SUICIDE_METHODS,
          OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD
        )}
      </IndentWrapper>
    );
  };

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
        {renderCheckboxList(
          OBSERVED_BEHAVIORS.BEHAVIORS,
          BEHAVIORS,
          OBSERVED_BEHAVIORS.OTHER_BEHAVIOR,
          suicideDetails()
        )}
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

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ObservedBehaviors)
);
