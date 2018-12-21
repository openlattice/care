/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { List, Map } from 'immutable';
import { DateTimePicker } from '@atlaskit/datetime-picker';

import StyledCheckbox from '../../../components/controls/StyledCheckbox';
import StyledInput, { StyledTextArea } from '../../../components/controls/StyledInput';
import StyledRadio from '../../../components/controls/StyledRadio';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { DISPOSITION, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import {
  OFFICER_TRAINING,
  DISPOSITIONS,
  PEOPLE_NOTIFIED,
  VERBAL_REFERRALS,
  COURTESY_TRANSPORTS,
  ARRESTABLE_OFFENSES,
  NO_ACTION_VALUES
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

const DateTimePickerWrapper = styled.div`
  min-width: 300px;
  margin-bottom: 10px;
`;

const InputWithMargin = styled(StyledInput)`
  margin: 10px 0;
`;

const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'hh:mm A';

const ObservedBehaviors = ({ values, actions } :Props) => {
  const { setInputValue } = actions;

  const clearDependentFields = (dependentListFields, dependentStringFields, dependentBoolFields) => {
    if (dependentListFields) {
      dependentListFields.forEach((dependentListField) => {
        setInputValue({
          field: dependentListField,
          value: List()
        });
      });
    }
    if (dependentStringFields) {
      dependentStringFields.forEach((dependentStringField) => {
        setInputValue({
          field: dependentStringField,
          value: ''
        });
      });
    }
    if (dependentBoolFields) {
      dependentBoolFields.forEach((dependentBoolField) => {
        setInputValue({
          field: dependentBoolField,
          value: undefined
        });
      });
    }
  };

  const renderInput = (field, isTextArea) => {
    const Input = isTextArea ? StyledTextArea : StyledInput;
    return (
      <Input
          name={field}
          value={values.get(field)}
          onChange={({ target }) => actions.setInputValue({ field, value: target.value })} />
    );
  };

  const onCheckboxChange = (event) => {
    const { name, checked, value } = event.target;
    let valueList = values.get(name, List());

    if (!checked && valueList.includes(value)) {
      valueList = valueList.delete(valueList.indexOf(value));
    }
    else if (!valueList.includes(value)) {
      valueList = valueList.push(value);
    }

    setInputValue({
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
        setInputValue({ field: otherField, value: '' });
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
          <InputWithMargin
              key={`${field}-other-value`}
              value={values.get(otherField, '')}
              onChange={({ target }) => setInputValue({ field: otherField, value: target.value })} />
        ) : null}
      </>
    );
  };

  const renderDispositionCheckbox = (value, dependentStringFields, dependentListFields, dependentBoolField) => {
    const onChange = (event) => {
      onCheckboxChange(event);
      clearDependentFields(dependentStringFields, dependentListFields, dependentBoolField);
    };

    return (
      <StyledCheckbox
          name={DISPOSITION.DISPOSITIONS}
          checked={values.get(DISPOSITION.DISPOSITIONS).includes(value)}
          label={value}
          value={value}
          onChange={onChange}
          bold />
    );
  };

  const renderRadio = (field, value, label, inverseDependentField) => {
    const checked = values.get(field) === value;

    const onChange = () => {
      if (inverseDependentField) {
        setInputValue({
          field: inverseDependentField,
          value: ''
        });
      }
      setInputValue({ field, value });
    };

    return (
      <StyledRadio
          label={label}
          checked={checked}
          onChange={onChange} />
    );
  };

  const onDateChange = (newDate) => {
    const value = newDate.endsWith('T')
      ? moment(newDate.slice(0, newDate.length - 1)).toISOString(true)
      : newDate;
    setInputValue({
      field: DISPOSITION.INCIDENT_DATE_TIME,
      value
    });
  }

  const hasDisposition = value => values.get(DISPOSITION.DISPOSITIONS).includes(value);

  const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

  return (
    <FormWrapper>
      <FormSection>
        <Header>
          <h1>Specialists On Scene</h1>
        </Header>
        {renderCheckboxList(DISPOSITION.SPECIALISTS, OFFICER_TRAINING)}
      </FormSection>
      <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.DISPOSITIONS)}>
        <Header>
          <h1>Disposition</h1>
          <RequiredField>Check all that apply.</RequiredField>
        </Header>

        {renderDispositionCheckbox(
          DISPOSITIONS.NOTIFIED_SOMEONE,
          [DISPOSITION.PEOPLE_NOTIFIED],
          [DISPOSITION.OTHER_PEOPLE_NOTIFIED]
        )}
        {
          hasDisposition(DISPOSITIONS.NOTIFIED_SOMEONE) ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.PEOPLE_NOTIFIED)}>
                {renderCheckboxList(DISPOSITION.PEOPLE_NOTIFIED, PEOPLE_NOTIFIED, DISPOSITION.OTHER_PEOPLE_NOTIFIED)}
              </FormSectionWithValidation>
            </IndentWrapper>
          ) : null
        }

        {renderDispositionCheckbox(
          DISPOSITIONS.VERBAL_REFERRAL,
          [DISPOSITION.VERBAL_REFERRALS],
          [DISPOSITION.OTHER_VERBAL_REFERRAL]
        )}
        {
          hasDisposition(DISPOSITIONS.VERBAL_REFERRAL) ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.VERBAL_REFERRALS)}>
                {renderCheckboxList(DISPOSITION.VERBAL_REFERRALS, VERBAL_REFERRALS, DISPOSITION.OTHER_VERBAL_REFERRAL)}
              </FormSectionWithValidation>
            </IndentWrapper>
          ) : null
        }

        {renderDispositionCheckbox(DISPOSITIONS.COURTESY_TRANPORT, [DISPOSITION.COURTESY_TRANSPORTS], [])}
        {
          hasDisposition(DISPOSITIONS.COURTESY_TRANPORT) ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.COURTESY_TRANSPORTS)}>
                {renderCheckboxList(DISPOSITION.COURTESY_TRANSPORTS, COURTESY_TRANSPORTS)}
              </FormSectionWithValidation>
            </IndentWrapper>
          ) : null
        }

        {renderDispositionCheckbox(
          DISPOSITIONS.HOSPITAL,
          [DISPOSITION.HOSPITALS],
          [],
          [DISPOSITION.WAS_VOLUNTARY_TRANSPORT]
        )}
        {
          hasDisposition(DISPOSITIONS.HOSPITAL) ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.WAS_VOLUNTARY_TRANSPORT)}>
                {renderRadio(DISPOSITION.WAS_VOLUNTARY_TRANSPORT, true, 'Voluntary')}
                {renderRadio(DISPOSITION.WAS_VOLUNTARY_TRANSPORT, false, 'Involuntary')}
              </FormSectionWithValidation>
            </IndentWrapper>
          ) : null
        }

        {renderDispositionCheckbox(DISPOSITIONS.ADMINISTERED_DRUG)}

        {renderDispositionCheckbox(DISPOSITIONS.ARRESTABLE_OFFENSE, [DISPOSITION.ARRESTABLE_OFFENSES], [])}
        {
          hasDisposition(DISPOSITIONS.ARRESTABLE_OFFENSE) ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.ARRESTABLE_OFFENSES)}>
                {renderCheckboxList(DISPOSITION.ARRESTABLE_OFFENSES, ARRESTABLE_OFFENSES)}
              </FormSectionWithValidation>
            </IndentWrapper>
          ) : null
        }

        {renderDispositionCheckbox(DISPOSITIONS.NO_ACTION_POSSIBLE, [DISPOSITION.NO_ACTION_VALUES], [])}
        {
          hasDisposition(DISPOSITIONS.NO_ACTION_POSSIBLE) ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.NO_ACTION_VALUES)}>
                {renderCheckboxList(DISPOSITION.NO_ACTION_VALUES, NO_ACTION_VALUES)}
              </FormSectionWithValidation>
            </IndentWrapper>
          ) : null
        }
      </FormSectionWithValidation>
      <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.HAS_REPORT_NUMBER)}>
        <Header>
          <h1>Additional Details</h1>
        </Header>
        <RequiredField invalid={invalidFields.includes(DISPOSITION.INCIDENT_DATE_TIME)}>
          <FormText noMargin>Incident date/time</FormText>
        </RequiredField>
        <DateTimePickerWrapper>
          <DateTimePicker
              dateFormat={dateFormat}
              timeFormat={timeFormat}
              value={values.get(DISPOSITION.INCIDENT_DATE_TIME)}
              onChange={onDateChange}
              datePickerSelectProps={{
                placeholder: dateFormat,
              }} />
        </DateTimePickerWrapper>
        <RequiredField>
          <FormText noMargin>Report info</FormText>
        </RequiredField>
        {renderRadio(
          DISPOSITION.HAS_REPORT_NUMBER,
          true,
          'Incident has a report or CFS number',
          DISPOSITION.INCIDENT_DESCRIPTION
        )}
        {values.get(DISPOSITION.HAS_REPORT_NUMBER)
          ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.REPORT_NUMBER)}>
                <RequiredField>
                  <FormText gray noMargin>
                    Report / CFS number
                  </FormText>
                </RequiredField>
                {renderInput(DISPOSITION.REPORT_NUMBER)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
          : null}
        {renderRadio(DISPOSITION.HAS_REPORT_NUMBER, false, 'No report or CFS number', DISPOSITION.REPORT_NUMBER)}
        {values.get(DISPOSITION.HAS_REPORT_NUMBER) === false
          ? (
            <IndentWrapper extraIndent>
              <FormSectionWithValidation invalid={invalidFields.includes(DISPOSITION.INCIDENT_DESCRIPTION)}>
                <RequiredField>
                  <FormText gray noMargin>
                    Describe the incident briefly below.
                  </FormText>
                </RequiredField>
                {renderInput(DISPOSITION.INCIDENT_DESCRIPTION, true)}
              </FormSectionWithValidation>
            </IndentWrapper>
          )
          : null}
      </FormSectionWithValidation>
    </FormWrapper>
  );
};

function mapStateToProps(state) {

  return {
    values: state.get(STATE.DISPOSITION)
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
