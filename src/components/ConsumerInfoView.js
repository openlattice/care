/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';

import FormNav from './FormNav';
import {
  PaddedRow,
  InlineCheckbox,
  InlineRadio,
  TitleLabel,
  OtherWrapper,
  SectionHeader,
  ErrorMessage
} from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateOnInput, validateRequiredInput } from '../shared/Validation';


const REQUIRED_FIELDS = ['firstName', 'lastName', 'identification'];

class ConsumerInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [],
      firstNameValid: true,
      lastNameValid: true,
      identificationValid: true,
      sectionValid: false,
      didClickNav: false
    };
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    handleDateInput: PropTypes.func.isRequired,
    consumerIsSelected: PropTypes.bool.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired
  }

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  handlePageChange = (path) => {
    this.setState({ didClickNav: true });
    validateRequiredInput(this, REQUIRED_FIELDS, () => {
      if (this.state.sectionValid) {
        this.props.handlePageChange(path);
      }
    });
  }

  renderErrors = () => {
    const formatErrors = this.state.sectionFormatErrors.map((error) => {
      return <ErrorMessage key={error}>{error}</ErrorMessage>;
    });
    let requiredErrors = [];
    if (this.state.didClickNav) {
      requiredErrors = this.state.sectionRequiredErrors.map((error) => {
        return <ErrorMessage key={error}>{error}</ErrorMessage>;
      });
    }

    return (
      <div>
        {formatErrors}
        {requiredErrors}
      </div>
    );
  }

  render() {
    const {
      section,
      handleTextInput,
      handleDateInput,
      handleSingleSelection,
      handleCheckboxChange,
      input,
      isInReview,
      handlePageChange,
      consumerIsSelected
    } = this.props;

    return (
      <div>
        { !isInReview() ? <SectionHeader>Consumer</SectionHeader> : null}

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'lastName', true)}>
              <TitleLabel>12. Last Name*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="lastName"
                  value={input.lastName}
                  onChange={(e) => {
                    handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                  }}
                  disabled={consumerIsSelected || isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'firstName', true)}>
              <TitleLabel>First Name*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="firstName"
                  value={input.firstName}
                  onChange={(e) => {
                    return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                  }}
                  disabled={consumerIsSelected || isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Middle Name</TitleLabel>
            <FormControl
                data-section={section}
                name="middleName"
                value={input.middleName}
                onChange={(e) => {
                  return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={consumerIsSelected || isInReview()} />
          </Col>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'identification', true)}>
              <TitleLabel>13. Consumer Identification*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="identification"
                  value={input.identification}
                  onChange={(e) => {
                    return handleTextInput(e, this, 'number', REQUIRED_FIELDS);
                  }}
                  disabled={consumerIsSelected || isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>14. Residence / Address (Street, Apt Number, City, County, State, Zip)</TitleLabel>
            <FormControl
                data-section={section}
                name="address"
                value={input.address}
                onChange={(e) => {
                  return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Consumer Phone Number</TitleLabel>
            <FormControl
                data-section={section}
                name="phone"
                value={input.phone}
                onChange={(e) => {
                  return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>15. Military Status</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="militaryStatus"
                value="active"
                checked={input.militaryStatus === 'active'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Active
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="militaryStatus"
                value="veteran"
                checked={input.militaryStatus === 'veteran'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Veteran
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="militaryStatus"
                value="n/a"
                checked={input.militaryStatus === 'n/a'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>N/A
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Gender</TitleLabel>
            <FormControl
                componentClass="select"
                placeholder="select"
                data-section={section}
                name="gender"
                value={input.gender}
                onChange={handleSingleSelection}
                disabled={consumerIsSelected || isInReview()}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
            </FormControl>
          </Col>

          <Col lg={6}>
            <TitleLabel>Race</TitleLabel>
            <FormControl
                componentClass="select"
                placeholder="select"
                data-section={section}
                name="race"
                value={input.race}
                onChange={handleSingleSelection}
                disabled={consumerIsSelected || isInReview()}>
              <option value="">Select</option>
              <option value="americanIndian">American Indian or Alaska Native</option>
              <option value="asian">Asian</option>
              <option value="black">Black or African American</option>
              <option value="hispanic">Hispanic or Latino</option>
              <option value="nativeHawaiian">Native Hawaiian or Other Pacific Islander</option>
              <option value="white">White</option>
              <option value="other">Other</option>
            </FormControl>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Age</TitleLabel>
            <FormControl
                data-section={section}
                name="age"
                value={input.age}
                onChange={(e) => {
                  return handleTextInput(e, this, 'number', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>DOB</TitleLabel>
            <DatePicker
                value={input.dob}
                onChange={(e) => {
                  handleDateInput(e, section, 'dob');
                }}
                disabled={consumerIsSelected || isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>16. Homeless</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="homeless"
                value
                checked={input.homeless}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="homeless"
                value={false}
                checked={!input.homeless}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>If Yes, Where Do They Usually Sleep / Frequent?</TitleLabel>
            <FormControl
                data-section={section}
                name="homelessLocation"
                value={input.homelessLocation}
                onChange={(e) => {
                  return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>17. Consumer Using Drugs, Alcohol</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="drugsAlcohol"
                value="drugs"
                checked={input.drugsAlcohol === 'drugs'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Drugs
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="drugsAlcohol"
                value="alcohol"
                checked={input.drugsAlcohol === 'alcohol'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Alcohol
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="drugsAlcohol"
                value="both"
                checked={input.drugsAlcohol === 'both'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Both
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="drugsAlcohol"
                value="n/a"
                checked={input.drugsAlcohol === 'n/a'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>N/A
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Drug type</TitleLabel>
            <FormControl
                data-section={section}
                name="drugType"
                value={input.drugType}
                onChange={(e) => {
                  return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>18. Prescribed Medication</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="prescribedMedication"
                value="yes"
                checked={input.prescribedMedication === 'yes'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="prescribedMedication"
                value="no"
                checked={input.prescribedMedication === 'no'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="prescribedMedication"
                value="unknown"
                checked={input.prescribedMedication === 'unknown'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Unknown
            </InlineRadio>
          </Col>
          <Col lg={6}>
            <TitleLabel>If yes, is Consumer Taking Medication?</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="takingMedication"
                value="yes"
                checked={input.takingMedication === 'yes'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="takingMedication"
                value="no"
                checked={input.takingMedication === 'no'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="takingMedication"
                value="unknown"
                checked={input.takingMedication === 'unknown'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Unknown
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>19. Does Consumer Have Previous Psychiatric Hospital Admission?</TitleLabel>
            <InlineRadio
                inline
                type="radio"
                data-section={section}
                name="prevPsychAdmission"
                value="yes"
                checked={input.prevPsychAdmission === 'yes'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                type="radio"
                data-section={section}
                name="prevPsychAdmission"
                value="no"
                checked={input.prevPsychAdmission === 'no'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
            <InlineRadio
                inline
                type="radio"
                data-section={section}
                name="prevPsychAdmission"
                value="unknown"
                checked={input.prevPsychAdmission === 'unknown'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Unknown
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>19. Self Diagnosis</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="selfDiagnosis"
                  value="bipolar"
                  checked={input.selfDiagnosis.indexOf('bipolar') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Bipolar
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="selfDiagnosis"
                  value="depression"
                  checked={input.selfDiagnosis.indexOf('depression') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Depression
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="selfDiagnosis"
                  value="ptsd"
                  checked={input.selfDiagnosis.indexOf('ptsd') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>PTSD
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="selfDiagnosis"
                  value="schizophrenia"
                  checked={input.selfDiagnosis.indexOf('schizophrenia') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Schizophrenia
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="selfDiagnosis"
                  value="dementia"
                  checked={input.selfDiagnosis.indexOf('dementia') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Dementia
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    data-section={section}
                    name="selfDiagnosis"
                    value="other"
                    checked={input.selfDiagnosis.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isInReview()}>Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="selfDiagnosisOther"
                    value={input.selfDiagnosisOther}
                    onChange={(e) => {
                      handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                    }}
                    disabled={isInReview()} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>20. Armed with Weapon?</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="armedWithWeapon"
                value
                checked={input.armedWithWeapon}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="armedWithWeapon"
                value={false}
                checked={!input.armedWithWeapon}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>If Yes, Weapon Type</TitleLabel>
            <FormControl
                data-section={section}
                name="armedWeaponType"
                value={input.armedWeaponType}
                onChange={(e) => {
                  handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>21. Have Access to Weapons?</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="accessToWeapons"
                value
                checked={input.accessToWeapons}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="accessToWeapons"
                value={false}
                checked={!input.accessToWeapons}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>If Yes, Weapon Type</TitleLabel>
            <FormControl
                data-section={section}
                name="accessibleWeaponType"
                value={input.accessibleWeaponType}
                onChange={(e) => {
                  return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>22. Observed Behaviors (Check all that apply)</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="disorientation"
                  checked={input.observedBehaviors.indexOf('disorientation') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Disorientation / Confusion
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="abnormalBehavior"
                  checked={input.observedBehaviors.indexOf('abnormalBehavior') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Abnormal Behavior / Appearance (neglect self-care)
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="hearingVoices"
                  checked={input.observedBehaviors.indexOf('hearingVoices') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Hearing Voices / Hallucinating
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="anxious"
                  checked={input.observedBehaviors.indexOf('anxious') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Anxious / Excited / Agitated
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="depressed"
                  checked={input.observedBehaviors.indexOf('depressed') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Depressed Mood
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="paranoid"
                  checked={input.observedBehaviors.indexOf('paranoid') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Paranoid or Suspicious
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="self-mutilation"
                  checked={input.observedBehaviors.indexOf('self-mutilation') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Self-mutilation
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="observedBehaviors"
                  value="threatening"
                  checked={input.observedBehaviors.indexOf('threatening') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Threatening / Violent Towards Others
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    data-section={section}
                    name="observedBehaviors"
                    value="other"
                    checked={input.observedBehaviors.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isInReview()}>Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="observedBehaviorsOther"
                    value={input.observedBehaviorsOther}
                    onChange={(e) => {
                      return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                    }}
                    disabled={isInReview()} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>23. Emotional State (Check all that apply)</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="angry"
                  checked={input.emotionalState.indexOf('angry') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Angry
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="afraid"
                  checked={input.emotionalState.indexOf('afraid') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Afraid
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="apologetic"
                  checked={input.emotionalState.indexOf('apologetic') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Apologetic
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="calm"
                  checked={input.emotionalState.indexOf('calm') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Calm
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="crying"
                  checked={input.emotionalState.indexOf('crying') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Crying
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="fearful"
                  checked={input.emotionalState.indexOf('fearful') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Fearful
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="emotionalState"
                  value="nervous"
                  checked={input.emotionalState.indexOf('nervous') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Nervous
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="other"
                    checked={input.emotionalState.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isInReview()}>Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="emotionalStateOther"
                    value={input.emotionalStateOther}
                    onChange={(e) => {
                      return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                    }}
                    disabled={isInReview()} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>24. Photos Taken Of:</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="photosTakenOf"
                  value="injuries"
                  checked={input.photosTakenOf.indexOf('injuries') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Injuries
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="photosTakenOf"
                  value="propertyDamage"
                  checked={input.photosTakenOf.indexOf('propertyDamage') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Damage / Crime Scene
              </InlineCheckbox>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>25. Consumer Injuries</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="injuries"
                  value="abrasions"
                  checked={input.injuries.indexOf('abrasions') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Abrasions
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="injuries"
                  value="bruises"
                  checked={input.injuries.indexOf('bruises') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Bruises
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="injuries"
                  value="complaintsOfPain"
                  checked={input.injuries.indexOf('complaintsOfPain') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Complaints of Pain
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="injuries"
                  value="concussion"
                  checked={input.injuries.indexOf('concussion') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Concussion
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="injuries"
                  value="fractures"
                  checked={input.injuries.indexOf('fractures') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Fractures
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    data-section={section}
                    name="injuries"
                    value="other"
                    checked={input.injuries.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isInReview()}>Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="injuriesOther"
                    value={input.injuriesOther}
                    onChange={(e) => {
                      return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                    }}
                    disabled={isInReview()} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>26. Suicidal</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="suicidal"
                value
                checked={input.suicidal}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="suicidal"
                value={false}
                checked={!input.suicidal}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>If Suicidal:</TitleLabel>
            <InlineCheckbox
                inline
                data-section={section}
                name="suicidalActions"
                value="thoughts"
                checked={input.suicidalActions.indexOf('thoughts') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>Thoughts
            </InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name="suicidalActions"
                value="threat"
                checked={input.suicidalActions.indexOf('threat') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>Threat
            </InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name="suicidalActions"
                value="attempt"
                checked={input.suicidalActions.indexOf('attempt') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>Attempt
            </InlineCheckbox>
            <InlineCheckbox
                inline
                data-section={section}
                name="suicidalActions"
                value="completed"
                checked={input.suicidalActions.indexOf('completed') !== -1}
                onChange={handleCheckboxChange}
                disabled={isInReview()}>Completed
            </InlineCheckbox>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>27. Method Used to Attempt, Threaten, or Complete Suicide</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicideAttemptMethod"
                  value="narcotics"
                  checked={input.suicideAttemptMethod.indexOf('narcotics') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Narcotics (Prescription or Illicit)
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicideAttemptMethod"
                  value="alcohol"
                  checked={input.suicideAttemptMethod.indexOf('alcohol') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Alcohol
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicideAttemptMethod"
                  value="knife"
                  checked={input.suicideAttemptMethod.indexOf('knife') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Knife / Cutting Tool
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicideAttemptMethod"
                  value="firearm"
                  checked={input.suicideAttemptMethod.indexOf('firearm') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Firearm
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    data-section={section}
                    name="suicideAttemptMethod"
                    value="other"
                    checked={input.suicideAttemptMethod.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isInReview()}>Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="suicideAttemptMethodOther"
                    value={input.suicideAttemptMethodOther}
                    onChange={(e) => {
                      return handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                    }}
                    disabled={isInReview()} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        {
          !isInReview()
          ? <FormNav
              prevPath={FORM_PATHS.CONSUMER_SEARCH}
              nextPath={FORM_PATHS.COMPLAINANT}
              handlePageChange={this.handlePageChange}
              setDidClickNav={this.setDidClickNav} />
          : null
        }
        { this.renderErrors() }
      </div>
    );
  }
}

export default ConsumerInfoView;
