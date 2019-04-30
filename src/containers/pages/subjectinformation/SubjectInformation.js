/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { List, Map } from 'immutable';
import { DatePicker } from '@atlaskit/datetime-picker';

import BackButton from '../../../components/buttons/BackButton';
import StyledInput from '../../../components/controls/StyledInput';
import StyledCheckbox from '../../../components/controls/StyledCheckbox';
import StyledRadio from '../../../components/controls/StyledRadio';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisTemplateConstants';
import { GENDERS, RACES } from './Constants';
import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
  FormText,
  Header,
  RequiredField
} from '../../../components/crisis/FormComponents';

import { searchConsumers } from '../../search/SearchActionFactory';

import { getInvalidFields } from './Reducer';
import * as ActionFactory from './ActionFactory';


type Props = {
  app :Map<*, *>,
  values :Map<*, *>,
  searchResults :List<*>,
  isSearchingPeople :boolean,
  noResults :boolean,
  actions :{
    clear :() => void,
    setInputValue :(value :{ field :string, value :Object }) => void,
    setInputValues :(values :{}) => void,
    searchConsumers :() => void
  },
  disabled :boolean;
}

const HeaderWithClearButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0;
  }
`;

const DatePickerWrapper = styled.div`
  width: 160px;
  margin-bottom: 20px;
`;

class SubjectInformation extends React.Component<Props> {

  searchTimeout = null;

  renderInput = (field, disabledIfSelected, width) => {
    const { values, actions } = this.props;
    const extraProps = width ? { width: `${width}px` } : {};

    const onChange = ({ target }) => {
      const { value } = target;
      if (field !== SUBJECT_INFORMATION.SSN_LAST_4 || value.length <= 4) {
        actions.setInputValue({ field, value });
      }
    };

    const type = (
      field === SUBJECT_INFORMATION.SSN_LAST_4
      && !values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)
    )
      ? 'password'
      : 'text';

    return (
      <StyledInput
          type={type}
          padBottom
          name={field}
          disabled={!values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)}
          value={values.get(field)}
          onChange={onChange}
          {...extraProps} />
    );
  };

  renderRadioButtons = (field, valueList) => {
    const { values, actions } = this.props;
    const currValue = values.get(field);

    const onChange = ({ target }) => {
      actions.setInputValue({
        field,
        value: target.value
      });
    };

    return valueList.map(value => (
      <StyledRadio
          key={`${field}-${value}`}
          disabled={!values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)}
          label={value}
          value={value}
          checked={currValue === value}
          onChange={onChange} />
    ));
  };

  render() {
    const {
      actions,
      disabled,
      values
    } = this.props;

    const isCreatingNewPerson = values.get(SUBJECT_INFORMATION.IS_NEW_PERSON);
    const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

    const toggleDOBUnknown = (event) => {
      const { checked } = event.target;
      if (checked) {
        actions.setInputValues({
          [SUBJECT_INFORMATION.DOB_UNKNOWN]: true,
          [SUBJECT_INFORMATION.DOB]: ''
        });
      }
      else {
        actions.setInputValues({
          [SUBJECT_INFORMATION.DOB_UNKNOWN]: false,
          [SUBJECT_INFORMATION.AGE]: ''
        });
      }
    };

    const PersonFormSection = isCreatingNewPerson ? FormSectionWithValidation : FormSection;
    return (
      <FormWrapper>
        <Header>
          <HeaderWithClearButton>
            <h1>Person Information</h1>
            {
              (!disabled && isCreatingNewPerson)
              && <BackButton onClick={actions.clear} noMargin>Clear Fields</BackButton>
            }
          </HeaderWithClearButton>
        </Header>
        <PersonFormSection>
          <FormText noMargin>Last</FormText>
          {this.renderInput(SUBJECT_INFORMATION.LAST, true)}
        </PersonFormSection>
        <PersonFormSection>
          <FormText noMargin>First</FormText>
          {this.renderInput(SUBJECT_INFORMATION.FIRST, true)}
        </PersonFormSection>
        <FormSection>
          <FormText noMargin>Mid.</FormText>
          {this.renderInput(SUBJECT_INFORMATION.MIDDLE, true, 80)}
        </FormSection>
        <FormSection>
          <FormText noMargin>AKA / Alias</FormText>
          {this.renderInput(SUBJECT_INFORMATION.AKA, true)}
        </FormSection>
        <StyledCheckbox
            name="dobCheckbox"
            checked={values.get(SUBJECT_INFORMATION.DOB_UNKNOWN)}
            label="DOB Unknown"
            disabled={!isCreatingNewPerson}
            onChange={toggleDOBUnknown} />
        <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.DOB)}>
          {
            values.get(SUBJECT_INFORMATION.DOB_UNKNOWN) ? (
              <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.AGE)}>
                <RequiredField><FormText noMargin>Age (approximate)</FormText></RequiredField>
                {this.renderInput(SUBJECT_INFORMATION.AGE, false, 70)}
              </PersonFormSection>
            ) : (
              <DatePickerWrapper>
                <RequiredField><FormText noMargin>DOB</FormText></RequiredField>
                <DatePicker
                    value={values.get(SUBJECT_INFORMATION.DOB)}
                    isDisabled={!isCreatingNewPerson || disabled}
                    dateFormat="MM-DD-YYYY"
                    onChange={value => actions.setInputValue({ field: SUBJECT_INFORMATION.DOB, value })}
                    selectProps={{
                      placeholder: 'MM-DD-YYYY'
                    }} />
              </DatePickerWrapper>
            )
          }
        </PersonFormSection>
        <PersonFormSection>
          <FormText noMargin>SSN (last 4 digits)</FormText>
          {this.renderInput(SUBJECT_INFORMATION.SSN_LAST_4, true, 85)}
        </PersonFormSection>
        <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.GENDER)}>
          <RequiredField><FormText noMargin>Gender</FormText></RequiredField>
          {this.renderRadioButtons(SUBJECT_INFORMATION.GENDER, GENDERS)}
        </PersonFormSection>
        <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.RACE)}>
          <RequiredField><FormText noMargin>Race</FormText></RequiredField>
          {this.renderRadioButtons(SUBJECT_INFORMATION.RACE, RACES)}
        </PersonFormSection>
      </FormWrapper>
    );
  }
}

function mapStateToProps(state) {

  const consumers = state.getIn(['search', 'consumers'], Map());
  const searchResults = consumers.get('searchResults', List());

  return {
    app: state.get('app', Map()),
    values: state.get(STATE.SUBJECT_INFORMATION),
    searchResults,
    isSearchingPeople: consumers.get('isSearching', false),
    noResults: consumers.get('searchComplete', false) && searchResults.size === 0
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    searchConsumers
  };

  Object.keys(ActionFactory).forEach((action) => {
    actions[action] = ActionFactory[action];
  });

  return {
    actions: {
      ...bindActionCreators(actions, dispatch)
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubjectInformation));
