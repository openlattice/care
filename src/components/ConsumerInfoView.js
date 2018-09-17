import React from 'react';

import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import moment from 'moment';
import { withRouter } from 'react-router';

import FormNav from './FormNav';
import FieldHeader from './text/styled/FieldHeader';
import TextAreaField from './text/TextAreaField';
import TextField from './text/TextField';
import SelfieWebCam, { DATA_URL_PREFIX } from './SelfieWebCam';

import {
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';
import { FORM_PATHS } from '../shared/Consts';
import {
  setDidClickNav,
  setRequiredErrors,
  renderErrors,
  validateSectionNavigation
} from '../shared/Helpers';

import { getCurrentPage } from '../utils/Utils';
import { isPortlandOrg } from '../utils/Whitelist';

class ConsumerInfoView extends React.Component {

  static propTypes = {
    handleMultiUpdate: PropTypes.func.isRequired,
    handlePicture: PropTypes.func,
    handleTextInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    handleScaleSelection: PropTypes.func.isRequired,
    handleDateInput: PropTypes.func.isRequired,
    consumerIsSelected: PropTypes.bool.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    input: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      identification: PropTypes.string.isRequired,
      militaryStatus: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      race: PropTypes.string.isRequired,
      age: PropTypes.string.isRequired,
      dob: PropTypes.string.isRequired,
      homeless: PropTypes.bool.isRequired,
      homelessLocation: PropTypes.string.isRequired,
      drugsAlcohol: PropTypes.string.isRequired,
      drugType: PropTypes.string.isRequired,
      prescribedMedication: PropTypes.string.isRequired,
      takingMedication: PropTypes.string.isRequired,
      prevPsychAdmission: PropTypes.string.isRequired,
      selfDiagnosis: PropTypes.array.isRequired,
      selfDiagnosisOther: PropTypes.string.isRequired,
      armedWithWeapon: PropTypes.bool.isRequired,
      armedWeaponType: PropTypes.string.isRequired,
      accessToWeapons: PropTypes.bool.isRequired,
      accessibleWeaponType: PropTypes.string.isRequired,
      observedBehaviors: PropTypes.array.isRequired,
      observedBehaviorsOther: PropTypes.string.isRequired,
      emotionalState: PropTypes.array.isRequired,
      emotionalStateOther: PropTypes.string.isRequired,
      photosTakenOf: PropTypes.array.isRequired,
      injuries: PropTypes.array.isRequired,
      injuriesOther: PropTypes.string.isRequired,
      suicidal: PropTypes.bool.isRequired,
      suicidalActions: PropTypes.array.isRequired,
      suicideAttemptMethod: PropTypes.array.isRequired,
      suicideAttemptMethodOther: PropTypes.string.isRequired
    }).isRequired,
    selectedOrganizationId: PropTypes.string.isRequired
  }

  static defaultProps = {
    handlePicture: () => {}
  }

  selfieWebCam;

  constructor(props) {

    super(props);

    this.state = {
      requiredFields: ['identification'],
      sectionFormatErrors: [],
      sectionRequiredErrors: [],
      identificationValid: true,
      ageValid: true,
      dobValid: true,
      sectionValid: false,
      didClickNav: this.props.location.state
        ? this.props.location.state.didClickNav
        : false,
      currentPage: getCurrentPage(),
      showSelfieWebCam: false
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
    handlePicture(section, 'picture', (selfieDataAsBase64 || ''));
  }

  handlePageChange = (path) => {

    if (this.selfieWebCam) {
      this.selfieWebCam.closeMediaStream();
    }

    const { handlePageChange } = this.props;
    const { sectionFormatErrors, sectionRequiredErrors } = this.state;
    this.setState(setDidClickNav);
    this.setState(setRequiredErrors, () => {
      if (sectionRequiredErrors.length < 1 && sectionFormatErrors.length < 1) {
        handlePageChange(path);
      }
    });
  }

  setInputErrors = (name, inputValid, sectionFormatErrors) => {
    const key = `${name}Valid`;
    this.setState({
      [key]: inputValid,
      sectionFormatErrors
    });
  }

  componentWillUnmount() {
    const { history, input } = this.props;
    const { currentPage, requiredFields } = this.state;
    validateSectionNavigation(input, requiredFields, currentPage, history);
  }

  renderConsumerPicture = (input) => {

    if (!input.picture) {
      return null;
    }

    const pictureDataUrl = `${DATA_URL_PREFIX}${input.picture}`;
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

    const {
      handleScaleSelection,
      input,
      isInReview,
      section
    } = this.props;

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      const inputKey = `input-scale1to10-${i}`;
      const labelKey = `label-scale1to10-${i}`;
      scaleRadios.push(
        <label key={labelKey} htmlFor={inputKey}>
          <input
              checked={input.scale1to10 === i}
              data-section={section}
              disabled={isInReview()}
              id={inputKey}
              key={inputKey}
              name="scale1to10"
              onChange={handleScaleSelection}
              type="radio"
              value={i} />
          { i }
        </label>
      )
    }

    return scaleRadios;
  }

  renderViolencePortland = () => {

    const { input, isInReview, section } = this.props;
    const { sectionFormatErrors } = this.state;
    const isReviewPage = isInReview();

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
              this.renderTempCheckbox('Police', 'directedagainst', 'police',
                input.directedagainst.indexOf('police') !== -1
              )
            }
            {
              this.renderTempCheckbox('Family', 'directedagainst', 'family',
                input.directedagainst.indexOf('family') !== -1
              )
            }
            {
              this.renderTempCheckbox('Significant other', 'directedagainst', 'significantOther',
                input.directedagainst.indexOf('significantOther') !== -1
              )
            }
            {
              this.renderTempCheckbox('Other', 'directedagainst', 'other',
                input.directedagainst.indexOf('other') !== -1
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isReviewPage}
              header="If other, specify others"
              name="directedagainstother"
              onChange={this.handleOnChangeNew} />
        </HalfWidthItem>
        <FullWidthItem>
          <FieldHeader>History of Violent Behavior</FieldHeader>
          <FlexyWrapper inline>
            { this.renderTempRadio('Yes', 'historyofviolence', true, input.historyofviolence === true) }
            { this.renderTempRadio('No', 'historyofviolence', false, input.historyofviolence === false) }
          </FlexyWrapper>
        </FullWidthItem>
        <HalfWidthItem>
          <FieldHeader>Violent behavior was directed towards</FieldHeader>
          <FlexyWrapper>
            {
              this.renderTempCheckbox('Police', 'historicaldirectedagainst', 'police',
                input.historicaldirectedagainst.indexOf('police') !== -1)
            }
            {
              this.renderTempCheckbox('Family', 'historicaldirectedagainst', 'family',
                input.historicaldirectedagainst.indexOf('family') !== -1)
            }
            {
              this.renderTempCheckbox('Significant other', 'historicaldirectedagainst', 'significantOther',
                input.historicaldirectedagainst.indexOf('significantOther') !== -1)
            }
            {
              this.renderTempCheckbox('Other', 'historicaldirectedagainst', 'other',
                input.historicaldirectedagainst.indexOf('other') !== -1)
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isReviewPage}
              header="If other, specify others"
              name="historicaldirectedagainstother"
              onChange={this.handleOnChangeNew} />
        </HalfWidthItem>
        <FullWidthItem>
          <TextAreaField
              disabled={isReviewPage}
              header="Description of historical incidents involving violent behavior"
              name="historyofviolencetext"
              onChange={this.handleOnChangeNew} />
        </FullWidthItem>
      </>
    );
  }

  handleOnChangeNew = () => {
    console.log('TODO: implement onChange handler');
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked) => {

    const { handleSingleSelection, isInReview, section } = this.props;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview()}
            id={id}
            name={name}
            onChange={handleSingleSelection}
            type="radio"
            value={value} />
        { label }
      </label>
    );
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempCheckbox = (label, name, value, isChecked) => {

    const { handleCheckboxChange, isInReview, section } = this.props;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview()}
            id={id}
            name={name}
            onChange={handleCheckboxChange}
            type="checkbox"
            value={value} />
        { label }
      </label>
    );
  }

  render() {
    const {
      consumerIsSelected,
      handleCheckboxChange,
      handleDateInput,
      handleMultiUpdate,
      handleSingleSelection,
      handleTextInput,
      input,
      isInReview,
      section,
      selectedOrganizationId
    } = this.props;

    const {
      didClickNav,
      identificationValid,
      ageValid,
      dobValid,
      sectionFormatErrors,
      sectionRequiredErrors
    } = this.state;

    const isReviewPage = isInReview();

    // TODO: what do I do with "data-section={section}"...?

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            {
              isReviewPage
                ? null
                : (
                  <h1>Consumer</h1>
                )
            }
          </FullWidthItem>
          <TextField
              disabled={consumerIsSelected || isReviewPage}
              header="Last Name"
              name="lastName"
              onChange={this.handleOnChangeNew} />
          <TextField
              disabled={consumerIsSelected || isReviewPage}
              header="First Name"
              name="firstName"
              onChange={this.handleOnChangeNew} />
          <TextField
              disabled={consumerIsSelected || isReviewPage}
              header="Middle Name"
              name="middleName"
              onChange={this.handleOnChangeNew} />
          <TextField
              disabled
              header="Consumer Identification*"
              name="identification"
              onChange={this.handleOnChangeNew} />
          <FullWidthItem>
            <TextField
                disabled={isReviewPage}
                header="Residence / Address (Street, Apt Number, City, County, State, Zip)"
                name="address"
                onChange={this.handleOnChangeNew} />
          </FullWidthItem>
          <TextField
              disabled={isReviewPage}
              header="Consumer Phone Number"
              name="phone"
              onChange={this.handleOnChangeNew} />
          {
            isReviewPage || consumerIsSelected
              ? this.renderConsumerPicture(input)
              : this.renderSelfieWebCam()
          }
          <FullWidthItem>
            <FieldHeader>Military Status</FieldHeader>
            { this.renderTempRadio('Active', 'militaryStatus', 'active', input.militaryStatus === 'active') }
            { this.renderTempRadio('Veteran', 'militaryStatus', 'veteran', input.militaryStatus === 'veteran') }
            { this.renderTempRadio('N/A', 'militaryStatus', 'n/a', input.militaryStatus === 'n/a') }
          </FullWidthItem>
          <HalfWidthItem>
            <FieldHeader>Gender</FieldHeader>
            <select
                data-section={section}
                disabled={consumerIsSelected || isReviewPage}
                name="gender"
                onChange={handleSingleSelection}
                value={input.gender}>
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
                disabled={consumerIsSelected || isReviewPage}
                name="race"
                onChange={handleSingleSelection}
                value={input.race}>
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
                  disabled={consumerIsSelected || isReviewPage}
                  id="date-of-birth"
                  onChange={(e) => {
                    handleDateInput(
                      e.target.value,
                      section,
                      'dob',
                      sectionFormatErrors,
                      this.setInputErrors
                    );
                    const age = moment().diff(moment(e.target.value), 'years').toString();
                    handleMultiUpdate(section, { age });
                  }}
                  type="date"
                  value={input.dob} />
            </label>
          </HalfWidthItem>
          <TextField
              disabled={isReviewPage}
              header="Age"
              name="age"
              onChange={this.handleOnChangeNew} />
          <HalfWidthItem>
            <FieldHeader>Homeless</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'homeless', true, input.homeless === true) }
              { this.renderTempRadio('No', 'homeless', false, input.homeless === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If Yes, where do they usually sleep / frequent?"
                name="homelessLocation"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Consumer Using Drugs, Alcohol</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Drugs', 'drugsAlcohol', 'drugs', input.drugsAlcohol === 'drugs') }
              { this.renderTempRadio('Alcohol', 'drugsAlcohol', 'alcohol', input.drugsAlcohol === 'alcohol') }
              { this.renderTempRadio('Both', 'drugsAlcohol', 'both', input.drugsAlcohol === 'both') }
              { this.renderTempRadio('N/A', 'drugsAlcohol', 'n/a', input.drugsAlcohol === 'n/a') }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="Drug type"
                name="drugType"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Prescribed Medication</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'prescribedMedication', 'yes', input.prescribedMedication === 'yes') }
              { this.renderTempRadio('No', 'prescribedMedication', 'no', input.prescribedMedication === 'no') }
              {
                this.renderTempRadio('Unknown', 'prescribedMedication', 'unknown',
                  input.prescribedMedication === 'unknown')
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>If yes, is consumer taking medication?</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'takingMedication', 'yes', input.takingMedication === 'yes') }
              { this.renderTempRadio('No', 'takingMedication', 'no', input.takingMedication === 'no') }
              { this.renderTempRadio('Unknown', 'takingMedication', 'unknown', input.takingMedication === 'unknown') }
            </FlexyWrapper>
          </HalfWidthItem>
          <FullWidthItem>
            <FieldHeader>Does Consumer Have Previous Psychiatric Hospital Admission?</FieldHeader>
            { this.renderTempRadio('Yes', 'prevPsychAdmission', 'yes', input.prevPsychAdmission === 'yes') }
            { this.renderTempRadio('No', 'prevPsychAdmission', 'no', input.prevPsychAdmission === 'no') }
            { this.renderTempRadio('Unknown', 'prevPsychAdmission', 'unknown', input.prevPsychAdmission === 'unknown') }
          </FullWidthItem>
          <HalfWidthItem>
            <FieldHeader>Self Diagnosis (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox('Bipolar', 'selfDiagnosis', 'bipolar',
                  input.selfDiagnosis.indexOf('bipolar') !== -1)
              }
              {
                this.renderTempCheckbox('Depression', 'selfDiagnosis', 'depression',
                  input.selfDiagnosis.indexOf('depression') !== -1)
              }
              {
                this.renderTempCheckbox('PTSD', 'selfDiagnosis', 'ptsd',
                  input.selfDiagnosis.indexOf('ptsd') !== -1)
              }
              {
                this.renderTempCheckbox('Schizophrenia', 'selfDiagnosis', 'schizophrenia',
                  input.selfDiagnosis.indexOf('schizophrenia') !== -1)
              }
              {
                this.renderTempCheckbox('Dementia', 'selfDiagnosis', 'dementia',
                  input.selfDiagnosis.indexOf('dementia') !== -1)
              }
              {
                isPortlandOrg(selectedOrganizationId) && this.renderTempCheckbox(
                  'Developmental Disabilities / Autism',
                  'selfDiagnosis',
                  'DevelopmentalDisabilities/Autism',
                  input.selfDiagnosis.indexOf('DevelopmentalDisabilities/Autism') !== -1
                )
              }
              {
                this.renderTempCheckbox('Other', 'selfDiagnosis', 'other',
                  input.selfDiagnosis.indexOf('other') !== -1)
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If other, specify other diagnoses"
                name="selfDiagnosisOther"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Armed with Weapon?</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'armedWithWeapon', true, input.armedWithWeapon === true) }
              { this.renderTempRadio('No', 'armedWithWeapon', false, input.armedWithWeapon === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If Yes, specify weapon type"
                name="armedWeaponType"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Have Access to Weapons?</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'accessToWeapons', true, input.accessToWeapons === true) }
              { this.renderTempRadio('No', 'accessToWeapons', false, input.accessToWeapons === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If Yes, specify weapon type"
                name="accessibleWeaponType"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Observed Behaviors (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox(
                  'Disorientation / Confusion',
                  'observedBehaviors',
                  'disorientation',
                  input.observedBehaviors.indexOf('disorientation') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Abnormal Behavior / Appearance (neglect self-care)',
                  'observedBehaviors',
                  'abnormalBehavior',
                  input.observedBehaviors.indexOf('abnormalBehavior') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Hearing Voices / Hallucinating',
                  'observedBehaviors',
                  'hearingVoices',
                  input.observedBehaviors.indexOf('hearingVoices') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Anxious / Excited / Agitated',
                  'observedBehaviors',
                  'anxious',
                  input.observedBehaviors.indexOf('anxious') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Depressed Mood',
                  'observedBehaviors',
                  'depressed',
                  input.observedBehaviors.indexOf('depressed') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Paranoid or Suspicious',
                  'observedBehaviors',
                  'paranoid',
                  input.observedBehaviors.indexOf('paranoid') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Self-harm',
                  'observedBehaviors',
                  'self-harm',
                  input.observedBehaviors.indexOf('self-harm') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Threatening / Violent Towards Others',
                  'observedBehaviors',
                  'threatening',
                  input.observedBehaviors.indexOf('threatening') !== -1
                )
              }
              {
                this.renderTempCheckbox(
                  'Other',
                  'observedBehaviors',
                  'other',
                  input.observedBehaviors.indexOf('other') !== -1
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If other, specify other observed behaviors"
                name="observedBehaviorsOther"
                onChange={this.handleOnChangeNew} />
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
                this.renderTempCheckbox('Angry', 'emotionalState', 'angry',
                  input.emotionalState.indexOf('angry') !== -1)
              }
              {
                this.renderTempCheckbox('Afraid', 'emotionalState', 'afraid',
                  input.emotionalState.indexOf('afraid') !== -1)
              }
              {
                this.renderTempCheckbox('Apologetic', 'emotionalState', 'apologetic',
                  input.emotionalState.indexOf('apologetic') !== -1)
              }
              {
                this.renderTempCheckbox('Calm', 'emotionalState', 'calm',
                  input.emotionalState.indexOf('calm') !== -1)
              }
              {
                this.renderTempCheckbox('Crying', 'emotionalState', 'crying',
                  input.emotionalState.indexOf('crying') !== -1)
              }
              {
                this.renderTempCheckbox('Fearful', 'emotionalState', 'fearful',
                  input.emotionalState.indexOf('fearful') !== -1)
              }
              {
                this.renderTempCheckbox('Nervous', 'emotionalState', 'nervous',
                  input.emotionalState.indexOf('nervous') !== -1)
              }
              {
                this.renderTempCheckbox('Other', 'emotionalState', 'other',
                  input.emotionalState.indexOf('other') !== -1)
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If other, specify other states"
                name="emotionalStateOther"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Consumer Injuries (check all that apply)</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox('Abrasions', 'injuries', 'abrasions',
                  input.injuries.indexOf('abrasions') !== -1)
              }
              {
                this.renderTempCheckbox('Bruises', 'injuries', 'bruises',
                  input.injuries.indexOf('bruises') !== -1)
              }
              {
                this.renderTempCheckbox('Complaints of Pain', 'injuries', 'complaintsOfPain',
                  input.injuries.indexOf('complaintsOfPain') !== -1)
              }
              {
                this.renderTempCheckbox('Concussion', 'injuries', 'concussion',
                  input.injuries.indexOf('concussion') !== -1)
              }
              {
                this.renderTempCheckbox('Fractures', 'injuries', 'fractures',
                  input.injuries.indexOf('fractures') !== -1)
              }
              {
                this.renderTempCheckbox('Other', 'injuries', 'other',
                  input.injuries.indexOf('other') !== -1)
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If other, specify other injuries"
                name="injuriesOther"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Suicidal</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'suicidal', true, input.suicidal === true) }
              { this.renderTempRadio('No', 'suicidal', false, input.suicidal === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>If Yes, check all that apply</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox('Thoughts', 'suicidalActions', 'thoughts',
                  input.suicidalActions.indexOf('thoughts') !== -1)
              }
              {
                this.renderTempCheckbox('Threat', 'suicidalActions', 'threat',
                  input.suicidalActions.indexOf('threat') !== -1)
              }
              {
                this.renderTempCheckbox('Attempt', 'suicidalActions', 'attempt',
                  input.suicidalActions.indexOf('attempt') !== -1)
              }
              {
                this.renderTempCheckbox('Completed', 'suicidalActions', 'completed',
                  input.suicidalActions.indexOf('completed') !== -1)
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Method Used to Attempt, Threaten, or Complete Suicide</FieldHeader>
            <FlexyWrapper>
              {
                this.renderTempCheckbox('Alcohol', 'suicideAttemptMethod', 'alcohol',
                  input.suicideAttemptMethod.indexOf('alcohol') !== -1)
              }
              {
                this.renderTempCheckbox('Knife / Cutting Tool', 'suicideAttemptMethod', 'knife',
                  input.suicideAttemptMethod.indexOf('knife') !== -1)
              }
              {
                this.renderTempCheckbox('Firearm', 'suicideAttemptMethod', 'firearm',
                  input.suicideAttemptMethod.indexOf('firearm') !== -1)
              }
              {
                this.renderTempCheckbox('Narcotics (Prescription or Illicit)', 'suicideAttemptMethod', 'narcotics',
                  input.suicideAttemptMethod.indexOf('narcotics') !== -1)
              }
              {
                this.renderTempCheckbox('Other', 'suicideAttemptMethod', 'other',
                  input.suicideAttemptMethod.indexOf('other') !== -1)
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isReviewPage}
                header="If other, specify other methods"
                name="suicideAttemptMethodOther"
                onChange={this.handleOnChangeNew} />
          </HalfWidthItem>
          <FullWidthItem>
            <FieldHeader>Photos Taken Of (check all that apply)</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempCheckbox('Injuries', 'photosTakenOf', 'injuries',
                  input.photosTakenOf.indexOf('injuries') !== -1)
              }
              {
                this.renderTempCheckbox('Damage / Crime Scene', 'photosTakenOf', 'propertyDamage',
                  input.photosTakenOf.indexOf('propertyDamage') !== -1)
              }
            </FlexyWrapper>
          </FullWidthItem>
        </FormGridWrapper>
        {
          !isReviewPage
            ? (
              <FormNav
                  prevPath={FORM_PATHS.CONSUMER_SEARCH}
                  nextPath={FORM_PATHS.REPORT}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
        { renderErrors(sectionFormatErrors, sectionRequiredErrors, didClickNav) }
      </>
    );
  }
}

export default withRouter(ConsumerInfoView);
