/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { List, Map, OrderedMap } from 'immutable';
import { DatePicker } from '@atlaskit/datetime-picker';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BackButton from '../../../components/buttons/BackButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import StyledInput from '../../../components/controls/StyledInput';
import StyledCheckbox from '../../../components/controls/StyledCheckbox';
import StyledRadio from '../../../components/controls/StyledRadio';
import SearchableSelect from '../../../components/controls/SearchableSelect';
import { showInvalidFields } from '../../../utils/NavigationUtils';
import { STATE } from '../../../utils/constants/StateConstants';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisTemplateConstants';
import { GENDERS, RACES } from './Constants';
import { BLACK } from '../../../shared/Colors';
import { MEDIA_QUERY_MD } from '../../../core/style/Sizes';
import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN
} from '../../../edm/DataModelFqns';
import { getPeopleESId } from '../../../utils/AppUtils';
import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
  FormText,
  Header,
  IndentWrapper,
  RequiredField
} from '../../../components/crisis/FormComponents';

import {
  clearConsumerSearchResults,
  searchConsumers
} from '../../search/SearchActionFactory';

import { getInvalidFields } from './Reducer';
import * as ActionFactory from './ActionFactory';


type Props = {
  app :Map<*, *>,
  values :Map<*, *>,
  searchResults :List<*>,
  actions :{
    clear :() => void,
    setInputValue :(value :{ field :string, value :Object }) => void,
    setInputValues :(values :{}) => void,
    searchConsumers :() => void
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

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

const Or = styled.div`
  margin: 20px 50px;
  font-size: 16px;
  font-weight: bold;
  color: ${BLACK};
`;

const UnknownPersonRow = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
  width: 100%;
  background-color: rgba(228, 216, 255, 0.${props => (props.selected ? 5 : 0)});
  color: ${BLACK};
  padding: 10px 20px;

  span {
    margin-left: 10px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 10px 15px;

    span {
      margin-left: 20px;
    }
  }

  &:hover {
    background-color: rgba(228, 216, 255, 0.${props => (props.selected ? 3 : 0)});
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const CreateNewPersonButton = styled(SecondaryButton)`
  padding: 12px 20px;
  width: fit-content;
  align-self: flex-end;
`;

class ObservedBehaviors extends React.Component<Props> {

  constructor(props) {
    super(props);

    this.searchTimeout = null;
  }

  renderInput = (field, disabledIfSelected, width) => {
    const { values, actions } = this.props;
    const extraProps = width ? { width: `${width}px` } : {};

    return (
      <StyledInput
          padBottom
          name={field}
          disabled={!values.get(SUBJECT_INFORMATION.IS_NEW_PERSON)}
          value={values.get(field)}
          onChange={({ target }) => actions.setInputValue({ field, value: target.value })}
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

  handleFullNameChange = (e :SyntheticEvent) => {
    const { actions, app } = this.props;
    const { value } = e.target;

    actions.setInputValue({
      field: SUBJECT_INFORMATION.FULL_NAME,
      value
    });

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      if (value && value.length) {
        actions.searchConsumers({
          entitySetId: getPeopleESId(app),
          query: value
        });
      }
    }, 500);
  }

  formatPersonName = (person) => {
    const firstName = person.getIn([PERSON_FIRST_NAME_FQN, 0], '');
    const lastName = person.getIn([PERSON_LAST_NAME_FQN, 0], '');
    const middleName = person.getIn([PERSON_MIDDLE_NAME_FQN, 0], '');
    return `${lastName}, ${firstName} ${middleName}`;
  }

  getPersonOptions = () => {
    const { searchResults } = this.props;
    let options = OrderedMap();
    searchResults.forEach((person) => {
      const dobStr = person.getIn([PERSON_DOB_FQN, 0], '');
      const dobMoment = moment(dobStr);

      const dob = dobMoment.isValid() ? dobMoment.format('MM-DD-YYYY') : dobStr;

      options = options.set(List.of(this.formatPersonName(person), dob), person);
    });

    return options;
  }

  selectPerson = (person) => {
    const { actions } = this.props;

    actions.setInputValues({
      [SUBJECT_INFORMATION.PERSON_ID]: person.getIn([PERSON_ID_FQN, 0], ''),
      [SUBJECT_INFORMATION.FULL_NAME]: this.formatPersonName(person),
      [SUBJECT_INFORMATION.FIRST]: person.getIn([PERSON_FIRST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.LAST]: person.getIn([PERSON_LAST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.MIDDLE]: person.getIn([PERSON_MIDDLE_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.DOB]: person.getIn([PERSON_DOB_FQN, 0], ''),
      [SUBJECT_INFORMATION.RACE]: person.getIn([PERSON_RACE_FQN, 0], ''),
      [SUBJECT_INFORMATION.GENDER]: person.getIn([PERSON_SEX_FQN, 0], ''),
      [SUBJECT_INFORMATION.AGE]: moment().diff(moment(person.getIn([PERSON_DOB_FQN, 0], '')), 'years'),
      [SUBJECT_INFORMATION.SSN_LAST_4]: 'XXXX',
      [SUBJECT_INFORMATION.IS_NEW_PERSON]: false
    });
  }

  render() {
    const { actions, values } = this.props;
    const isCreatingNewPerson = values.get(SUBJECT_INFORMATION.IS_NEW_PERSON);
    const invalidFields = showInvalidFields(window.location) ? getInvalidFields(values) : [];

    const toggleNewPerson = (event, value) => {
      event.preventDefault();
      actions.setInputValue({
        field: SUBJECT_INFORMATION.IS_NEW_PERSON,
        value
      });
    };

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
      <Wrapper>
        <FormWrapper>
          <FormSection>
            <CreateNewPersonButton onClick={e => toggleNewPerson(e, true)}>Create New Person</CreateNewPersonButton>
            <Header>
              <h1>Quick Search</h1>
              <span>
                {'Search by last name, first name, or alias. No results? Click "Create New Person" above'}
              </span>
            </Header>
            <SearchableSelect
                value={values.get(SUBJECT_INFORMATION.FULL_NAME)}
                onInputChange={this.handleFullNameChange}
                onSelect={this.selectPerson}
                options={this.getPersonOptions()}
                transparent
                searchIcon
                fullWidth
                dropdownIcon={false}
                split
                noFilter
                withBorders
                short />
          </FormSection>
        </FormWrapper>
        {
          isCreatingNewPerson || values.get(SUBJECT_INFORMATION.PERSON_ID) ? (
            <FormWrapper>
              <IndentWrapper extraIndent>
                <Header>
                  <HeaderWithClearButton>
                    <h1>Subject Information</h1>
                    <BackButton onClick={actions.clear} noMargin>Clear Fields</BackButton>
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
                <StyledCheckbox
                    name="dobCheckbox"
                    checked={values.get(SUBJECT_INFORMATION.DOB_UNKNOWN)}
                    label="DOB Unknown"
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
                            isDisabled={!isCreatingNewPerson}
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
                  {this.renderInput(SUBJECT_INFORMATION.SSN_LAST_4, true, 75)}
                </PersonFormSection>
              </IndentWrapper>
              <IndentWrapper extraIndent>
                <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.GENDER)}>
                  <RequiredField><FormText noMargin>Gender</FormText></RequiredField>
                  {this.renderRadioButtons(SUBJECT_INFORMATION.GENDER, GENDERS)}
                </PersonFormSection>
                <PersonFormSection invalid={invalidFields.includes(SUBJECT_INFORMATION.RACE)}>
                  <RequiredField><FormText noMargin>Race</FormText></RequiredField>
                  {this.renderRadioButtons(SUBJECT_INFORMATION.RACE, RACES)}
                </PersonFormSection>
              </IndentWrapper>
            </FormWrapper>
          ) : null
        }
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {

  return {
    app: state.get('app', Map()),
    values: state.get(STATE.SUBJECT_INFORMATION),
    searchResults: state.getIn(['search', 'consumers', 'searchResults'], List())
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    clearConsumerSearchResults,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ObservedBehaviors));
