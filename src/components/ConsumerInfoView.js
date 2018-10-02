import React from 'react';

import moment from 'moment';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FieldHeader from './text/styled/FieldHeader';
import TextAreaField from './text/TextAreaField';
import TextField from './text/TextField';
import SelfieWebCam, { DATA_URL_PREFIX } from './SelfieWebCam';

import { FORM_PATHS } from '../shared/Consts';
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
              onChange={event => updateStateValue(section, SCALE_1_TO_10_FQN, parseInt(event.target.value))}
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
            {
              this.renderTempCheckbox(
                'Police',
                DIRECTED_AGAINST_FQN,
                'police',
                input[DIRECTED_AGAINST_FQN].indexOf('police') !== -1,
                event => updateStateValue(section, DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Family',
                DIRECTED_AGAINST_FQN,
                'family',
                input[DIRECTED_AGAINST_FQN].indexOf('family') !== -1,
                event => updateStateValue(section, DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Significant other',
                DIRECTED_AGAINST_FQN,
                'significantOther',
                input[DIRECTED_AGAINST_FQN].indexOf('significantOther') !== -1,
                event => updateStateValue(section, DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Other',
                DIRECTED_AGAINST_FQN,
                'other',
                input[DIRECTED_AGAINST_FQN].indexOf('other') !== -1,
                event => updateStateValue(section, DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isReadOnly}
              header="If other, specify others"
              onChange={value => updateStateValue(section, DIRECTED_AGAINST_OTHER_FQN, value)}
              value={input[DIRECTED_AGAINST_OTHER_FQN]} />
        </HalfWidthItem>
        <FullWidthItem>
          <FieldHeader>History of Violent Behavior</FieldHeader>
          <FlexyWrapper inline>
            {
              this.renderTempRadio(
                'Yes',
                HISTORY_OF_VIOLENCE_FQN,
                true,
                input[HISTORY_OF_VIOLENCE_FQN] === true,
                () => updateStateValue(section, HISTORY_OF_VIOLENCE_FQN, true)
              )
            }
            {
              this.renderTempRadio(
                'No',
                HISTORY_OF_VIOLENCE_FQN,
                false,
                input[HISTORY_OF_VIOLENCE_FQN] === false,
                () => updateStateValue(section, HISTORY_OF_VIOLENCE_FQN, false)
              )
            }
          </FlexyWrapper>
        </FullWidthItem>
        <HalfWidthItem>
          <FieldHeader>Violent behavior was directed towards</FieldHeader>
          <FlexyWrapper>
            {
              this.renderTempCheckbox(
                'Police',
                HIST_DIRECTED_AGAINST_FQN,
                'police',
                input[HIST_DIRECTED_AGAINST_FQN].indexOf('police') !== -1,
                event => updateStateValue(section, HIST_DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[HIST_DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Family',
                HIST_DIRECTED_AGAINST_FQN,
                'family',
                input[HIST_DIRECTED_AGAINST_FQN].indexOf('family') !== -1,
                event => updateStateValue(section, HIST_DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[HIST_DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Significant other',
                HIST_DIRECTED_AGAINST_FQN,
                'significantOther',
                input[HIST_DIRECTED_AGAINST_FQN].indexOf('significantOther') !== -1,
                event => updateStateValue(section, HIST_DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[HIST_DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Other',
                HIST_DIRECTED_AGAINST_FQN,
                'other',
                input[HIST_DIRECTED_AGAINST_FQN].indexOf('other') !== -1,
                event => updateStateValue(section, HIST_DIRECTED_AGAINST_FQN,
                  checkboxesHelper(input[HIST_DIRECTED_AGAINST_FQN], event.target.value))
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isReadOnly}
              header="If other, specify others"
              onChange={value => updateStateValue(section, HIST_DIRECTED_AGAINST_OTHER_FQN, value)}
              value={input[HIST_DIRECTED_AGAINST_OTHER_FQN]} />
        </HalfWidthItem>
        <FullWidthItem>
          <TextAreaField
              disabled={isReadOnly}
              header="Description of historical incidents involving violent behavior"
              onChange={value => updateStateValue(section, HISTORY_OF_VIOLENCE_TEXT_FQN, value)}
              value={input[HISTORY_OF_VIOLENCE_TEXT_FQN]} />
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
      <label htmlFor={id}>
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

  // TODO: replace this with real components from lattice-ui-kit
  renderTempCheckbox = (label, name, value, isChecked, onChange) => {

    const { isReadOnly } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
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
          <TextField
              disabled={consumerIsSelected || isReadOnly}
              header="Last Name"
              onChange={value => updateStateValue(section, PERSON_LAST_NAME_FQN, value)}
              value={input[PERSON_LAST_NAME_FQN]} />
          <TextField
              disabled={consumerIsSelected || isReadOnly}
              header="First Name"
              onChange={value => updateStateValue(section, PERSON_FIRST_NAME_FQN, value)}
              value={input[PERSON_FIRST_NAME_FQN]} />
          <TextField
              disabled={consumerIsSelected || isReadOnly}
              header="Middle Name"
              onChange={value => updateStateValue(section, PERSON_MIDDLE_NAME_FQN, value)}
              value={input[PERSON_MIDDLE_NAME_FQN]} />
          <TextField
              disabled
              header="Consumer Identification*"
              value={input[PERSON_ID_FQN]} />
          <FullWidthItem>
            <TextField
                disabled={isReadOnly}
                header="Residence / Address (Street, Apt Number, City, County, State, Zip)"
                onChange={value => updateStateValue(section, ADDRESS_FQN, value)}
                value={input[ADDRESS_FQN]} />
          </FullWidthItem>
          <TextField
              disabled={isReadOnly}
              header="Consumer Phone Number"
              onChange={value => updateStateValue(section, PHONE_FQN, value)}
              value={input[PHONE_FQN]} />
          {
            isReadOnly || consumerIsSelected
              ? this.renderConsumerPicture(input)
              : this.renderSelfieWebCam()
          }
          <FullWidthItem>
            <FieldHeader>Military Status</FieldHeader>
            {
              this.renderTempRadio(
                'Active',
                MILITARY_STATUS_FQN,
                'active',
                input[MILITARY_STATUS_FQN] === 'active',
                () => updateStateValue(section, MILITARY_STATUS_FQN, 'active')
              )
            }
            {
              this.renderTempRadio(
                'Veteran',
                MILITARY_STATUS_FQN,
                'veteran',
                input[MILITARY_STATUS_FQN] === 'veteran',
                () => updateStateValue(section, MILITARY_STATUS_FQN, 'veteran')
              )
            }
            {
              this.renderTempRadio(
                'N/A',
                MILITARY_STATUS_FQN,
                'n/a',
                input[MILITARY_STATUS_FQN] === 'n/a',
                () => updateStateValue(section, MILITARY_STATUS_FQN, 'n/a')
              )
            }
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
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
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
              <option value="">Select</option>
              <option value="americanIndian">American Indian or Alaska Native</option>
              <option value="asian">Asian</option>
              <option value="black">Black or African American</option>
              <option value="hispanic">Hispanic or Latino</option>
              <option value="nativeHawaiian">Native Hawaiian or Other Pacific Islander</option>
              <option value="white">White</option>
              <option value="other">Other</option>
            </select>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-of-birth">
              <FieldHeader>Date of Birth</FieldHeader>
              <input
                  disabled={consumerIsSelected || isReadOnly}
                  id="date-of-birth"
                  onChange={(event) => {
                    const dob = moment(event.target.value).format('YYYY-MM-DD');
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
          <TextField
              disabled={isReadOnly}
              header="Age"
              onChange={value => updateStateValue(section, AGE_FQN, value)}
              value={input[AGE_FQN]} />
          <HalfWidthItem>
            <FieldHeader>Homeless</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  HOMELESS_FQN,
                  true,
                  input[HOMELESS_FQN] === true,
                  () => updateStateValue(section, HOMELESS_FQN, true)
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  HOMELESS_FQN,
                  false,
                  input[HOMELESS_FQN] === false,
                  () => updateStateValue(section, HOMELESS_FQN, false)
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If Yes, where do they usually sleep / frequent?"
                onChange={value => updateStateValue(section, HOMELESS_LOCATION_FQN, value)}
                value={input[HOMELESS_LOCATION_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Consumer Using Drugs, Alcohol</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Drugs',
                  DRUGS_ALCOHOL_FQN,
                  'drugs',
                  input[DRUGS_ALCOHOL_FQN] === 'drugs',
                  () => updateStateValue(section, DRUGS_ALCOHOL_FQN, 'drugs')
                )
              }
              {
                this.renderTempRadio(
                  'Alcohol',
                  DRUGS_ALCOHOL_FQN,
                  'alcohol',
                  input[DRUGS_ALCOHOL_FQN] === 'alcohol',
                  () => updateStateValue(section, DRUGS_ALCOHOL_FQN, 'alcohol')
                )
              }
              {
                this.renderTempRadio(
                  'Both',
                  DRUGS_ALCOHOL_FQN,
                  'both',
                  input[DRUGS_ALCOHOL_FQN] === 'both',
                  () => updateStateValue(section, DRUGS_ALCOHOL_FQN, 'both')
                )
              }
              {
                this.renderTempRadio(
                  'N/A',
                  DRUGS_ALCOHOL_FQN,
                  'n/a',
                  input[DRUGS_ALCOHOL_FQN] === 'n/a',
                  () => updateStateValue(section, DRUGS_ALCOHOL_FQN, 'n/a')
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="Drug type"
                onChange={value => updateStateValue(section, DRUG_TYPE_FQN, value)}
                value={input[DRUG_TYPE_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Prescribed Medication</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  PRESCRIBED_MEDICATION_FQN,
                  'yes',
                  input[PRESCRIBED_MEDICATION_FQN] === 'yes',
                  () => updateStateValue(section, PRESCRIBED_MEDICATION_FQN, 'yes')
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  PRESCRIBED_MEDICATION_FQN,
                  'no',
                  input[PRESCRIBED_MEDICATION_FQN] === 'no',
                  () => updateStateValue(section, PRESCRIBED_MEDICATION_FQN, 'no')
                )
              }
              {
                this.renderTempRadio(
                  'Unknown',
                  PRESCRIBED_MEDICATION_FQN,
                  'unknown',
                  input[PRESCRIBED_MEDICATION_FQN] === 'unknown',
                  () => updateStateValue(section, PRESCRIBED_MEDICATION_FQN, 'unknown')
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>If yes, is consumer taking medication?</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  TAKING_MEDICATION_FQN,
                  'yes',
                  input[TAKING_MEDICATION_FQN] === 'yes',
                  () => updateStateValue(section, TAKING_MEDICATION_FQN, 'yes')
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  TAKING_MEDICATION_FQN,
                  'no',
                  input[TAKING_MEDICATION_FQN] === 'no',
                  () => updateStateValue(section, TAKING_MEDICATION_FQN, 'no')
                )
              }
              {
                this.renderTempRadio(
                  'Unknown',
                  TAKING_MEDICATION_FQN,
                  'unknown',
                  input[TAKING_MEDICATION_FQN] === 'unknown',
                  () => updateStateValue(section, TAKING_MEDICATION_FQN, 'unknown')
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <FullWidthItem>
            <FieldHeader>Does Consumer Have Previous Psychiatric Hospital Admission?</FieldHeader>
            {
              this.renderTempRadio(
                'Yes',
                PREV_PSYCH_ADMISSION_FQN,
                'yes',
                input[PREV_PSYCH_ADMISSION_FQN] === 'yes',
                () => updateStateValue(section, PREV_PSYCH_ADMISSION_FQN, 'yes')
              )
            }
            {
              this.renderTempRadio(
                'No',
                PREV_PSYCH_ADMISSION_FQN,
                'no',
                input[PREV_PSYCH_ADMISSION_FQN] === 'no',
                () => updateStateValue(section, PREV_PSYCH_ADMISSION_FQN, 'no')
              )
            }
            {
              this.renderTempRadio(
                'Unknown',
                PREV_PSYCH_ADMISSION_FQN,
                'unknown',
                input[PREV_PSYCH_ADMISSION_FQN] === 'unknown',
                () => updateStateValue(section, PREV_PSYCH_ADMISSION_FQN, 'unknown')
              )
            }
          </FullWidthItem>
          <HalfWidthItem>
            <FieldHeader>Self Diagnosis (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Bipolar',
                  SELF_DIAGNOSIS_FQN,
                  'bipolar',
                  input[SELF_DIAGNOSIS_FQN].indexOf('bipolar') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Depression',
                  SELF_DIAGNOSIS_FQN,
                  'depression',
                  input[SELF_DIAGNOSIS_FQN].indexOf('depression') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'PTSD',
                  SELF_DIAGNOSIS_FQN,
                  'ptsd',
                  input[SELF_DIAGNOSIS_FQN].indexOf('ptsd') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Schizophrenia',
                  SELF_DIAGNOSIS_FQN,
                  'schizophrenia',
                  input[SELF_DIAGNOSIS_FQN].indexOf('schizophrenia') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Dementia',
                  SELF_DIAGNOSIS_FQN,
                  'dementia',
                  input[SELF_DIAGNOSIS_FQN].indexOf('dementia') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
              {
                isPortlandOrg(selectedOrganizationId) && this.renderTempCheckbox(
                  'Developmental Disabilities / Autism',
                  SELF_DIAGNOSIS_FQN,
                  'DevelopmentalDisabilities/Autism',
                  input[SELF_DIAGNOSIS_FQN].indexOf('DevelopmentalDisabilities/Autism') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Other',
                  SELF_DIAGNOSIS_FQN,
                  'other',
                  input[SELF_DIAGNOSIS_FQN].indexOf('other') !== -1,
                  event => updateStateValue(section, SELF_DIAGNOSIS_FQN,
                    checkboxesHelper(input[SELF_DIAGNOSIS_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If other, specify other diagnoses"
                onChange={value => updateStateValue(section, SELF_DIAGNOSIS_OTHER_FQN, value)}
                value={input[SELF_DIAGNOSIS_OTHER_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Armed with Weapon?</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  ARMED_WITH_WEAPON_FQN,
                  true,
                  input[ARMED_WITH_WEAPON_FQN] === true,
                  () => updateStateValue(section, ARMED_WITH_WEAPON_FQN, true)
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  ARMED_WITH_WEAPON_FQN,
                  false,
                  input[ARMED_WITH_WEAPON_FQN] === false,
                  () => updateStateValue(section, ARMED_WITH_WEAPON_FQN, false)
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If Yes, specify weapon type"
                onChange={value => updateStateValue(section, ARMED_WEAPON_TYPE_FQN, value)}
                value={input[ARMED_WEAPON_TYPE_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Have Access to Weapons?</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  ACCESS_TO_WEAPONS_FQN,
                  true,
                  input[ACCESS_TO_WEAPONS_FQN] === true,
                  () => updateStateValue(section, ACCESS_TO_WEAPONS_FQN, true)
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  ACCESS_TO_WEAPONS_FQN,
                  false,
                  input[ACCESS_TO_WEAPONS_FQN] === false,
                  () => updateStateValue(section, ACCESS_TO_WEAPONS_FQN, false)
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If Yes, specify weapon type"
                onChange={value => updateStateValue(section, ACCESSIBLE_WEAPON_TYPE_FQN, value)}
                value={input[ACCESSIBLE_WEAPON_TYPE_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Observed Behaviors (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Disorientation / Confusion',
                  OBSERVED_BEHAVIORS_FQN,
                  'disorientation',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('disorientation') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Abnormal Behavior / Appearance (neglect self-care)',
                  OBSERVED_BEHAVIORS_FQN,
                  'abnormalBehavior',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('abnormalBehavior') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Hearing Voices / Hallucinating',
                  OBSERVED_BEHAVIORS_FQN,
                  'hearingVoices',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('hearingVoices') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Anxious / Excited / Agitated',
                  OBSERVED_BEHAVIORS_FQN,
                  'anxious',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('anxious') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Depressed Mood',
                  OBSERVED_BEHAVIORS_FQN,
                  'depressed',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('depressed') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Paranoid or Suspicious',
                  OBSERVED_BEHAVIORS_FQN,
                  'paranoid',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('paranoid') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Self-harm',
                  OBSERVED_BEHAVIORS_FQN,
                  'self-harm',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('self-harm') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Threatening / Violent Towards Others',
                  OBSERVED_BEHAVIORS_FQN,
                  'threatening',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('threatening') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Other',
                  OBSERVED_BEHAVIORS_FQN,
                  'other',
                  input[OBSERVED_BEHAVIORS_FQN].indexOf('other') !== -1,
                  event => updateStateValue(section, OBSERVED_BEHAVIORS_FQN,
                    checkboxesHelper(input[OBSERVED_BEHAVIORS_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If other, specify other observed behaviors"
                onChange={value => updateStateValue(section, OBSERVED_BEHAVIORS_OTHER_FQN, value)}
                value={input[OBSERVED_BEHAVIORS_OTHER_FQN]} />
          </HalfWidthItem>
          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderViolencePortland()
              : null
          }
          <HalfWidthItem>
            <FieldHeader>Emotional State (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Angry',
                  EMOTIONAL_STATE_FQN,
                  'angry',
                  input[EMOTIONAL_STATE_FQN].indexOf('angry') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Afraid',
                  EMOTIONAL_STATE_FQN,
                  'afraid',
                  input[EMOTIONAL_STATE_FQN].indexOf('afraid') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Apologetic',
                  EMOTIONAL_STATE_FQN,
                  'apologetic',
                  input[EMOTIONAL_STATE_FQN].indexOf('apologetic') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Calm',
                  EMOTIONAL_STATE_FQN,
                  'calm',
                  input[EMOTIONAL_STATE_FQN].indexOf('calm') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Crying',
                  EMOTIONAL_STATE_FQN,
                  'crying',
                  input[EMOTIONAL_STATE_FQN].indexOf('crying') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Fearful',
                  EMOTIONAL_STATE_FQN,
                  'fearful',
                  input[EMOTIONAL_STATE_FQN].indexOf('fearful') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Nervous',
                  EMOTIONAL_STATE_FQN,
                  'nervous',
                  input[EMOTIONAL_STATE_FQN].indexOf('nervous') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Other',
                  EMOTIONAL_STATE_FQN,
                  'other',
                  input[EMOTIONAL_STATE_FQN].indexOf('other') !== -1,
                  event => updateStateValue(section, EMOTIONAL_STATE_FQN,
                    checkboxesHelper(input[EMOTIONAL_STATE_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If other, specify other states"
                onChange={value => updateStateValue(section, EMOTIONAL_STATE_OTHER_FQN, value)}
                value={input[EMOTIONAL_STATE_OTHER_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Consumer Injuries (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Abrasions',
                  INJURIES_FQN,
                  'abrasions',
                  input[INJURIES_FQN].indexOf('abrasions') !== -1,
                  event => updateStateValue(section, INJURIES_FQN,
                    checkboxesHelper(input[INJURIES_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Bruises',
                  INJURIES_FQN,
                  'bruises',
                  input[INJURIES_FQN].indexOf('bruises') !== -1,
                  event => updateStateValue(section, INJURIES_FQN,
                    checkboxesHelper(input[INJURIES_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Complaints of Pain',
                  INJURIES_FQN,
                  'complaintsOfPain',
                  input[INJURIES_FQN].indexOf('complaintsOfPain') !== -1,
                  event => updateStateValue(section, INJURIES_FQN,
                    checkboxesHelper(input[INJURIES_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Concussion',
                  INJURIES_FQN,
                  'concussion',
                  input[INJURIES_FQN].indexOf('concussion') !== -1,
                  event => updateStateValue(section, INJURIES_FQN,
                    checkboxesHelper(input[INJURIES_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Fractures',
                  INJURIES_FQN,
                  'fractures',
                  input[INJURIES_FQN].indexOf('fractures') !== -1,
                  event => updateStateValue(section, INJURIES_FQN,
                    checkboxesHelper(input[INJURIES_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Other',
                  INJURIES_FQN,
                  'other',
                  input[INJURIES_FQN].indexOf('other') !== -1,
                  event => updateStateValue(section, INJURIES_FQN,
                    checkboxesHelper(input[INJURIES_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If other, specify other injuries"
                onChange={value => updateStateValue(section, INJURIES_OTHER_FQN, value)}
                value={input[INJURIES_OTHER_FQN]} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Suicidal</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  SUICIDAL_FQN,
                  true,
                  input[SUICIDAL_FQN] === true,
                  () => updateStateValue(section, SUICIDAL_FQN, true)
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  SUICIDAL_FQN,
                  false,
                  input[SUICIDAL_FQN] === false,
                  () => updateStateValue(section, SUICIDAL_FQN, false)
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>If Yes, check all that apply</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Thoughts',
                  SUICIDAL_ACTIONS_FQN,
                  'thoughts',
                  input[SUICIDAL_ACTIONS_FQN].indexOf('thoughts') !== -1,
                  event => updateStateValue(section, SUICIDAL_ACTIONS_FQN,
                    checkboxesHelper(input[SUICIDAL_ACTIONS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Threat',
                  SUICIDAL_ACTIONS_FQN,
                  'threat',
                  input[SUICIDAL_ACTIONS_FQN].indexOf('threat') !== -1,
                  event => updateStateValue(section, SUICIDAL_ACTIONS_FQN,
                    checkboxesHelper(input[SUICIDAL_ACTIONS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Attempt',
                  SUICIDAL_ACTIONS_FQN,
                  'attempt',
                  input[SUICIDAL_ACTIONS_FQN].indexOf('attempt') !== -1,
                  event => updateStateValue(section, SUICIDAL_ACTIONS_FQN,
                    checkboxesHelper(input[SUICIDAL_ACTIONS_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Completed',
                  SUICIDAL_ACTIONS_FQN,
                  'completed',
                  input[SUICIDAL_ACTIONS_FQN].indexOf('completed') !== -1,
                  event => updateStateValue(section, SUICIDAL_ACTIONS_FQN,
                    checkboxesHelper(input[SUICIDAL_ACTIONS_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Method Used to Attempt, Threaten, or Complete Suicide</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Alcohol',
                  SUICIDE_ATTEMPT_METHOD_FQN,
                  'alcohol',
                  input[SUICIDE_ATTEMPT_METHOD_FQN].indexOf('alcohol') !== -1,
                  event => updateStateValue(section, SUICIDE_ATTEMPT_METHOD_FQN,
                    checkboxesHelper(input[SUICIDE_ATTEMPT_METHOD_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Knife / Cutting Tool',
                  SUICIDE_ATTEMPT_METHOD_FQN,
                  'knife',
                  input[SUICIDE_ATTEMPT_METHOD_FQN].indexOf('knife') !== -1,
                  event => updateStateValue(section, SUICIDE_ATTEMPT_METHOD_FQN,
                    checkboxesHelper(input[SUICIDE_ATTEMPT_METHOD_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Firearm',
                  SUICIDE_ATTEMPT_METHOD_FQN,
                  'firearm',
                  input[SUICIDE_ATTEMPT_METHOD_FQN].indexOf('firearm') !== -1,
                  event => updateStateValue(section, SUICIDE_ATTEMPT_METHOD_FQN,
                    checkboxesHelper(input[SUICIDE_ATTEMPT_METHOD_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Narcotics (Prescription or Illicit)',
                  SUICIDE_ATTEMPT_METHOD_FQN,
                  'narcotics',
                  input[SUICIDE_ATTEMPT_METHOD_FQN].indexOf('narcotics') !== -1,
                  event => updateStateValue(section, SUICIDE_ATTEMPT_METHOD_FQN,
                    checkboxesHelper(input[SUICIDE_ATTEMPT_METHOD_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Other',
                  SUICIDE_ATTEMPT_METHOD_FQN,
                  'other',
                  input[SUICIDE_ATTEMPT_METHOD_FQN].indexOf('other') !== -1,
                  event => updateStateValue(section, SUICIDE_ATTEMPT_METHOD_FQN,
                    checkboxesHelper(input[SUICIDE_ATTEMPT_METHOD_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReadOnly}
                header="If other, specify other methods"
                onChange={value => updateStateValue(section, SUICIDE_ATTEMPT_METHOD_OTHER_FQN, value)}
                value={input[SUICIDE_ATTEMPT_METHOD_OTHER_FQN]} />
          </HalfWidthItem>
          <FullWidthItem>
            <FieldHeader>Photos Taken Of (check all that apply)</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempCheckbox(
                  'Injuries',
                  PHOTOS_TAKEN_OF_FQN,
                  'injuries',
                  input[PHOTOS_TAKEN_OF_FQN].indexOf('injuries') !== -1,
                  event => updateStateValue(section, PHOTOS_TAKEN_OF_FQN,
                    checkboxesHelper(input[PHOTOS_TAKEN_OF_FQN], event.target.value))
                )
              }
              {
                this.renderTempCheckbox(
                  'Damage / Crime Scene',
                  PHOTOS_TAKEN_OF_FQN,
                  'propertyDamage',
                  input[PHOTOS_TAKEN_OF_FQN].indexOf('propertyDamage') !== -1,
                  event => updateStateValue(section, PHOTOS_TAKEN_OF_FQN,
                    checkboxesHelper(input[PHOTOS_TAKEN_OF_FQN], event.target.value))
                )
              }
            </FlexyWrapper>
          </FullWidthItem>
        </FormGridWrapper>
      </>
    );
  }
}

export default withRouter(ConsumerInfoView);
