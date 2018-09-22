import React from 'react';

import moment from 'moment';
import { withRouter } from 'react-router';

import FormNav from './FormNav';
import FieldHeader from './text/styled/FieldHeader';
import TextAreaField from './text/TextAreaField';
import TextField from './text/TextField';
import SelfieWebCam, { DATA_URL_PREFIX } from './SelfieWebCam';

import { FORM_PATHS } from '../shared/Consts';
import { isPortlandOrg } from '../utils/Whitelist';
import {
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';

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

  handlePageChange = (path) => {

    // TODO: validation
    const { handlePageChange } = this.props;
    handlePageChange(path);
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

    const { handleScaleSelection, input, isInReview } = this.props;
    const { section } = this.state;

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      const inputKey = `input-scale1to10-${i}`;
      const labelKey = `label-scale1to10-${i}`;
      scaleRadios.push(
        <label key={labelKey} htmlFor={inputKey}>
          <input
              checked={input.scale1to10 === i}
              data-section={section}
              disabled={isInReview}
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

    const { input, isInReview, updateStateValue } = this.props;
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
              this.renderTempCheckbox('Police', 'directedagainst', 'police',
                input.directedagainst.indexOf('police') !== -1)
            }
            {
              this.renderTempCheckbox('Family', 'directedagainst', 'family',
                input.directedagainst.indexOf('family') !== -1)
            }
            {
              this.renderTempCheckbox('Significant other', 'directedagainst', 'significantOther',
                input.directedagainst.indexOf('significantOther') !== -1)
            }
            {
              this.renderTempCheckbox('Other', 'directedagainst', 'other',
                input.directedagainst.indexOf('other') !== -1)
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isInReview}
              header="If other, specify others"
              onChange={value => updateStateValue(section, 'directedagainstother', value)}
              value={input.directedagainstother} />
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
              disabled={isInReview}
              header="If other, specify others"
              onChange={value => updateStateValue(section, 'historicaldirectedagainstother', value)}
              value={input.historicaldirectedagainstother} />
        </HalfWidthItem>
        <FullWidthItem>
          <TextAreaField
              disabled={isInReview}
              header="Description of historical incidents involving violent behavior"
              onChange={value => updateStateValue(section, 'historyofviolencetext', value)}
              value={input.historyofviolencetext} />
        </FullWidthItem>
      </>
    );
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked) => {

    const { handleSingleSelection, isInReview } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview}
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

    const { handleCheckboxChange, isInReview } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview}
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
      handleSingleSelection,
      input,
      isInReview,
      selectedOrganizationId,
      updateStateValue,
      updateStateValues,
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            {
              isInReview
                ? null
                : (
                  <h1>Consumer</h1>
                )
            }
          </FullWidthItem>
          <TextField
              disabled={consumerIsSelected || isInReview}
              header="Last Name"
              onChange={value => updateStateValue(section, 'lastName', value)}
              value={input.lastName} />
          <TextField
              disabled={consumerIsSelected || isInReview}
              header="First Name"
              onChange={value => updateStateValue(section, 'firstName', value)}
              value={input.firstName} />
          <TextField
              disabled={consumerIsSelected || isInReview}
              header="Middle Name"
              onChange={value => updateStateValue(section, 'middleName', value)}
              value={input.middleName} />
          <TextField
              disabled
              header="Consumer Identification*"
              value={input.identification} />
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Residence / Address (Street, Apt Number, City, County, State, Zip)"
                onChange={value => updateStateValue(section, 'address', value)}
                value={input.address} />
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Consumer Phone Number"
              onChange={value => updateStateValue(section, 'phone', value)}
              value={input.phone} />
          {
            isInReview || consumerIsSelected
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
                disabled={consumerIsSelected || isInReview}
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
                disabled={consumerIsSelected || isInReview}
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
                  disabled={consumerIsSelected || isInReview}
                  id="date-of-birth"
                  onChange={(e) => {
                    const dob = moment(e.target.value).format('YYYY-MM-DD');
                    const age = moment().diff(dob, 'years').toString();
                    updateStateValues(section, { age, dob });
                  }}
                  type="date"
                  value={input.dob} />
            </label>
          </HalfWidthItem>
          <TextField
              disabled={isInReview}
              header="Age"
              onChange={value => updateStateValue(section, 'age', value)}
              value={input.age} />
          <HalfWidthItem>
            <FieldHeader>Homeless</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'homeless', true, input.homeless === true) }
              { this.renderTempRadio('No', 'homeless', false, input.homeless === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <TextField
                disabled={isInReview}
                header="If Yes, where do they usually sleep / frequent?"
                onChange={value => updateStateValue(section, 'homelessLocation', value)}
                value={input.homelessLocation} />
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
                disabled={isInReview}
                header="Drug type"
                onChange={value => updateStateValue(section, 'drugType', value)}
                value={input.drugType} />
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
                disabled={isInReview}
                header="If other, specify other diagnoses"
                onChange={value => updateStateValue(section, 'selfDiagnosisOther', value)}
                value={input.selfDiagnosisOther} />
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
                disabled={isInReview}
                header="If Yes, specify weapon type"
                onChange={value => updateStateValue(section, 'armedWeaponType', value)}
                value={input.armedWeaponType} />
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
                disabled={isInReview}
                header="If Yes, specify weapon type"
                onChange={value => updateStateValue(section, 'accessibleWeaponType', value)}
                value={input.accessibleWeaponType} />
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
                disabled={isInReview}
                header="If other, specify other observed behaviors"
                onChange={value => updateStateValue(section, 'observedBehaviorsOther', value)}
                value={input.observedBehaviorsOther} />
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
                disabled={isInReview}
                header="If other, specify other states"
                onChange={value => updateStateValue(section, 'emotionalStateOther', value)}
                value={input.emotionalStateOther} />
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
                disabled={isInReview}
                header="If other, specify other injuries"
                onChange={value => updateStateValue(section, 'injuriesOther', value)}
                value={input.injuriesOther} />
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
                disabled={isInReview}
                header="If other, specify other methods"
                onChange={value => updateStateValue(section, 'suicideAttemptMethodOther', value)}
                value={input.suicideAttemptMethodOther} />
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
          !isInReview
            ? (
              <FormNav
                  prevPath={FORM_PATHS.CONSUMER_SEARCH}
                  nextPath={FORM_PATHS.REPORT}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
      </>
    );
  }
}

export default withRouter(ConsumerInfoView);
