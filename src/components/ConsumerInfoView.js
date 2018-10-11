import React from 'react';

import moment from 'moment';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import SelfieWebCam, { DATA_URL_PREFIX } from './SelfieWebCam';

import { FORM_PATHS } from '../shared/Consts';
import {
  BEHAVIORS,
  EMOTIONAL_STATES,
  GENDERS,
  INJURIES,
  MILITARY_STATUS,
  PHOTOS_TAKEN,
  RACES,
  SELF_DIAGNOSIS,
  SUBSTANCES,
  SUICIDAL_ACTIONS,
  SUICIDE_METHODS,
  VIOLENCE_TARGET_PORTLAND
} from '../utils/DataConstants';
import { formatAsDate } from '../utils/DateUtils';
import { isPortlandOrg } from '../utils/Whitelist';
import { checkboxesHelper } from '../containers/reports/HackyUtils';
import {
  EditButton,
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';
import {
  ADDRESS_FQN,
  PHONE_FQN,
  MILITARY_STATUS_FQN,
  GENDER_FQN,
  RACE_FQN,
  AGE_FQN,
  DOB_FQN,
  HOMELESS_FQN,
  HOMELESS_LOCATION_FQN,
  DRUGS_ALCOHOL_FQN,
  DRUG_TYPE_FQN,
  PRESCRIBED_MEDICATION_FQN,
  TAKING_MEDICATION_FQN,
  PREV_PSYCH_ADMISSION_FQN,
  SELF_DIAGNOSIS_FQN,
  SELF_DIAGNOSIS_OTHER_FQN,
  ARMED_WITH_WEAPON_FQN,
  ARMED_WEAPON_TYPE_FQN,
  ACCESS_TO_WEAPONS_FQN,
  ACCESSIBLE_WEAPON_TYPE_FQN,
  OBSERVED_BEHAVIORS_FQN,
  OBSERVED_BEHAVIORS_OTHER_FQN,
  EMOTIONAL_STATE_FQN,
  EMOTIONAL_STATE_OTHER_FQN,
  PHOTOS_TAKEN_OF_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  SUICIDAL_FQN,
  SUICIDAL_ACTIONS_FQN,
  SUICIDE_ATTEMPT_METHOD_FQN,
  SUICIDE_ATTEMPT_METHOD_OTHER_FQN,
  DIRECTED_AGAINST_FQN,
  DIRECTED_AGAINST_OTHER_FQN,
  HIST_DIRECTED_AGAINST_FQN,
  HIST_DIRECTED_AGAINST_OTHER_FQN,
  HISTORY_OF_VIOLENCE_FQN,
  HISTORY_OF_VIOLENCE_TEXT_FQN,
  SCALE_1_TO_10_FQN,
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN,
  PERSON_PICTURE_FQN,
} from '../edm/DataModelFqns';

class ConsumerInfoView extends React.Component {

  static defaultProps = {
    handlePicture: () => {}
  }

  selfieWebCam;

  constructor(props) {
    super(props);
    this.state = {
      section: 'consumerInfo',
      showSelfieWebCam: false,
    };
  }

  handleOnChangeTakePicture = (event) => {

    this.setState({
      showSelfieWebCam: event.target.checked || false
    });

    if (this.selfieWebCam) {
      this.selfieWebCam.closeMediaStream();
    }
  }

  handleOnSelfieCapture = (selfieDataAsBase64) => {

    const { handlePicture, section } = this.props;
    handlePicture(section, PERSON_PICTURE_FQN, (selfieDataAsBase64 || ''));
  }

  renderConsumerPicture = (input) => {

    if (!input[PERSON_PICTURE_FQN]) {
      return null;
    }

    const pictureDataUrl = `${DATA_URL_PREFIX}${input[PERSON_PICTURE_FQN]}`;
    return (
      <FullWidthItem>
        <FieldHeader>
          Consumer Picture
        </FieldHeader>
        <img
            alt="Consumer"
            src={pictureDataUrl} />
      </FullWidthItem>
    );
  }

  renderSelfieWebCam = () => {

    const { showSelfieWebCam } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>
          Consumer Picture
        </FieldHeader>
        <label htmlFor="consumer-picture-checkbox">
          <input id="consumer-picture-checkbox" type="checkbox" onChange={this.handleOnChangeTakePicture} />
          Take a picture with your webcam
        </label>
        {
          !showSelfieWebCam
            ? null
            : (
              <SelfieWebCam
                  onSelfieCapture={this.handleOnSelfieCapture}
                  ref={(element) => {
                    this.selfieWebCam = element;
                  }} />
            )
        }
      </FullWidthItem>
    );
  }

  renderViolenceScale = () => {

    const { input, isReadOnly, updateStateValue } = this.props;
    const { section } = this.state;

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      const inputKey = `input-scale1to10-${i}`;
      const labelKey = `label-scale1to10-${i}`;
      scaleRadios.push(
        <label key={labelKey} htmlFor={inputKey}>
          <input
              checked={input[SCALE_1_TO_10_FQN] === i}
              data-section={section}
              disabled={isReadOnly}
              id={inputKey}
              key={inputKey}
              name={SCALE_1_TO_10_FQN}
              onChange={event => updateStateValue(section, SCALE_1_TO_10_FQN, Number.parseInt(event.target.value, 10))}
              type="radio"
              value={i} />
          { i }
        </label>
      );
    }

    return scaleRadios;
  }

  renderViolencePortland = () => {

    const {
      input,
      isReadOnly,
      updateStateValue
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FullWidthItem>
          <FieldHeader>Violence at this incident</FieldHeader>
          <FieldHeader>1 = Not at all violent , 10 = Extreme violence</FieldHeader>
          <FlexyWrapper inline>
            { this.renderViolenceScale() }
          </FlexyWrapper>
        </FullWidthItem>
        <HalfWidthItem>
          <FieldHeader>Violent behavior during this incident was directed towards</FieldHeader>
          <FlexyWrapper>
            {this.renderCheckboxes(VIOLENCE_TARGET_PORTLAND, DIRECTED_AGAINST_FQN)}
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          {this.renderInput('If other, specify others', DIRECTED_AGAINST_OTHER_FQN)}
        </HalfWidthItem>
        <FullWidthItem>
          <FieldHeader>History of Violent Behavior</FieldHeader>
          {this.renderYesNoRadio(HISTORY_OF_VIOLENCE_FQN)}
        </FullWidthItem>
        <HalfWidthItem>
          <FieldHeader>Violent behavior was directed towards</FieldHeader>
          <FlexyWrapper>
            {this.renderCheckboxes(VIOLENCE_TARGET_PORTLAND, HIST_DIRECTED_AGAINST_FQN)}
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          {this.renderInput('If other, specify others', HIST_DIRECTED_AGAINST_OTHER_FQN)}
        </HalfWidthItem>
        <FullWidthItem>
          {this.renderInput(
            'Description of historical incidents involving violent behavior',
            HISTORY_OF_VIOLENCE_TEXT_FQN
          )}
        </FullWidthItem>
      </>
    );
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked, onChange) => {

    const { isReadOnly } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id} key={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isReadOnly}
            id={id}
            name={name}
            onChange={onChange}
            type="radio"
            value={value} />
        { label }
      </label>
    );
  }

  renderRadio = (label, fqn, valueIfDifferentFromLabel) => {
    const { input, updateStateValue } = this.props;
    const { section } = this.state;

    const value = valueIfDifferentFromLabel || label;

    return this.renderTempRadio(
      label,
      fqn,
      value,
      input[fqn] === value,
      () => updateStateValue(section, fqn, value)
    );
  }

  renderRadioButtons = (labels, fqn) => Object.values(labels).map(label => this.renderRadio(label, fqn))

  renderYesNoRadio = (fqn, withUnknown, inlineFalse) => {
    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    const currVal = `${input[fqn]}`;

    const yesVal = withUnknown ? 'Yes' : true;
    const noVal = withUnknown ? 'No' : false;

    return (
      <FlexyWrapper inline={!inlineFalse}>
        {
          this.renderTempRadio(
            'Yes',
            fqn,
            yesVal,
            currVal === `${yesVal}`,
            () => updateStateValue(section, fqn, yesVal)
          )
        }
        {
          this.renderTempRadio(
            'No',
            fqn,
            noVal,
            currVal === `${noVal}`,
            () => updateStateValue(section, fqn, noVal)
          )
        }
        {
          withUnknown ? this.renderTempRadio(
            'Unknown',
            fqn,
            'unknown',
            currVal === 'unknown',
            () => updateStateValue(section, fqn, 'unknown')
          ) : null
        }
      </FlexyWrapper>
    );
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempCheckbox = (label, name, value, isChecked, onChange) => {

    const { isReadOnly } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id} key={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isReadOnly}
            id={id}
            name={name}
            onChange={onChange}
            type="checkbox"
            value={value} />
        { label }
      </label>
    );
  }

  renderCheckbox = (label, fqn, valueIfDifferentFromLabel) => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    const value = valueIfDifferentFromLabel || label;

    return this.renderTempCheckbox(
      label,
      fqn,
      value,
      input[fqn].indexOf(value) !== -1,
      event => updateStateValue(section, fqn, checkboxesHelper(input[fqn], event.target.value))
    );
  }

  renderCheckboxes = (labels, fqn) => Object.values(labels).map(label => this.renderCheckbox(label, fqn))

  renderInput = (label, fqn, disabledIfConsumerSelected) => {
    const {
      consumerIsSelected,
      input,
      isReadOnly,
      updateStateValue
    } = this.props;
    const { section } = this.state;

    const disabled = disabledIfConsumerSelected ? (consumerIsSelected || isReadOnly) : isReadOnly;

    return (
      <TextField
          disabled={disabled}
          header={label}
          onChange={value => updateStateValue(section, fqn, value)}
          value={input[fqn]} />
    );
  }

  render() {
    const {
      consumerIsSelected,
      input,
      isInReview,
      isReadOnly,
      selectedOrganizationId,
      updateStateValue,
      updateStateValues,
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            <h1>Consumer</h1>
            { isInReview && (
              <Link to={FORM_PATHS.CONSUMER}>
                <EditButton onClick={this.handleOnClickEditReport}>Edit</EditButton>
              </Link>
            )}
          </FullWidthItem>
          {this.renderInput('Last Name', PERSON_LAST_NAME_FQN, true)}
          {this.renderInput('First Name', PERSON_FIRST_NAME_FQN, true)}
          {this.renderInput('Middle Name', PERSON_MIDDLE_NAME_FQN, true)}
          <TextField
              disabled
              header="Consumer Identification*"
              value={input[PERSON_ID_FQN]} />
          <FullWidthItem>
            {this.renderInput('Residence / Address (Street, Apt Number, City, County, State, Zip)', ADDRESS_FQN)}
          </FullWidthItem>
          {this.renderInput('Consumer Phone Number', PHONE_FQN)}
          {
            isReadOnly || consumerIsSelected
              ? this.renderConsumerPicture(input)
              : this.renderSelfieWebCam()
          }
          <FullWidthItem>
            <FieldHeader>Military Status</FieldHeader>
            {this.renderRadioButtons(MILITARY_STATUS, MILITARY_STATUS_FQN)}
          </FullWidthItem>
          <HalfWidthItem>
            <FieldHeader>Gender</FieldHeader>
            <select
                data-section={section}
                disabled={consumerIsSelected || isReadOnly}
                name={PERSON_SEX_FQN}
                onChange={(event) => {
                  updateStateValues(section, {
                    [PERSON_SEX_FQN]: event.target.value,
                    [GENDER_FQN]: event.target.value,
                  });
                }}
                value={input[PERSON_SEX_FQN]}>
              <option value="">Select</option>
              {Object.values(GENDERS).map(gender => <option key={gender} value={gender}>{gender}</option>)}
            </select>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Race</FieldHeader>
            <select
                data-section={section}
                disabled={consumerIsSelected || isReadOnly}
                name={PERSON_RACE_FQN}
                onChange={(event) => {
                  updateStateValues(section, {
                    [PERSON_RACE_FQN]: event.target.value,
                    [RACE_FQN]: event.target.value,
                  });
                }}
                value={input[PERSON_RACE_FQN]}>
              {Object.values(RACES).map(race => <option key={race} value={race}>{race}</option>)}
            </select>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-of-birth">
              <FieldHeader>Date of Birth</FieldHeader>
              <input
                  disabled={consumerIsSelected || isReadOnly}
                  id="date-of-birth"
                  onChange={(event) => {
                    const dob = formatAsDate(event.target.value);
                    const age = moment().diff(dob, 'years').toString();
                    updateStateValues(section, {
                      [AGE_FQN]: age,
                      [DOB_FQN]: dob,
                      [PERSON_DOB_FQN]: dob,
                    });
                  }}
                  type="date"
                  value={input[PERSON_DOB_FQN]} />
            </label>
          </HalfWidthItem>
          {this.renderInput('Age', AGE_FQN)}
          <HalfWidthItem>
            <FieldHeader>Homeless</FieldHeader>
            {this.renderYesNoRadio(HOMELESS_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If Yes, where do they usually sleep / frequent?', HOMELESS_LOCATION_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Consumer Using Drugs, Alcohol</FieldHeader>
            <FlexyWrapper inline>
              {this.renderRadioButtons(SUBSTANCES, DRUGS_ALCOHOL_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('Drug type', DRUG_TYPE_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Prescribed Medication</FieldHeader>
            {this.renderYesNoRadio(PRESCRIBED_MEDICATION_FQN, true)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>If yes, is consumer taking medication?</FieldHeader>
            {this.renderYesNoRadio(TAKING_MEDICATION_FQN, true)}
          </HalfWidthItem>
          <FullWidthItem>
            <FieldHeader>Does Consumer Have Previous Psychiatric Hospital Admission?</FieldHeader>
            {this.renderYesNoRadio(PREV_PSYCH_ADMISSION_FQN, true, true)}
          </FullWidthItem>
          <HalfWidthItem>
            <FieldHeader>Self Diagnosis (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {this.renderCheckboxes(SELF_DIAGNOSIS, SELF_DIAGNOSIS_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If other, specify other diagnoses', SELF_DIAGNOSIS_OTHER_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Armed with Weapon?</FieldHeader>
            {this.renderYesNoRadio(ARMED_WITH_WEAPON_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If Yes, specify weapon type', ARMED_WEAPON_TYPE_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Have Access to Weapons?</FieldHeader>
            {this.renderYesNoRadio(ACCESS_TO_WEAPONS_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If Yes, specify weapon type', ACCESSIBLE_WEAPON_TYPE_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Observed Behaviors (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {this.renderCheckboxes(BEHAVIORS, OBSERVED_BEHAVIORS_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If other, specify other observed behaviors', OBSERVED_BEHAVIORS_OTHER_FQN)}
          </HalfWidthItem>
          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderViolencePortland()
              : null
          }
          <HalfWidthItem>
            <FieldHeader>Emotional State (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {this.renderCheckboxes(EMOTIONAL_STATES, EMOTIONAL_STATE_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If other, specify other states', EMOTIONAL_STATE_OTHER_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Consumer Injuries (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {this.renderCheckboxes(INJURIES, INJURIES_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If other, specify other injuries', INJURIES_OTHER_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Suicidal</FieldHeader>
            {this.renderYesNoRadio(SUICIDAL_FQN)}
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>If Yes, check all that apply</FieldHeader>
            <FlexyWrapper>
              {this.renderCheckboxes(SUICIDAL_ACTIONS, SUICIDAL_ACTIONS_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Method Used to Attempt, Threaten, or Complete Suicide</FieldHeader>
            <FlexyWrapper>
              {this.renderCheckboxes(SUICIDE_METHODS, SUICIDE_ATTEMPT_METHOD_FQN)}
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            {this.renderInput('If other, specify other methods', SUICIDE_ATTEMPT_METHOD_OTHER_FQN)}
          </HalfWidthItem>
          <FullWidthItem>
            <FieldHeader>Photos Taken Of (check all that apply)</FieldHeader>
            <FlexyWrapper inline>
              {this.renderCheckboxes(PHOTOS_TAKEN, PHOTOS_TAKEN_OF_FQN)}
            </FlexyWrapper>
          </FullWidthItem>
        </FormGridWrapper>
      </>
    );
  }
}

export default withRouter(ConsumerInfoView);
