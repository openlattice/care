import React from 'react';

import DatePicker from 'react-bootstrap-date-picker';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import styled from 'styled-components';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';

import FormNav from './FormNav';
import SelfieWebCam, { DATA_URL_PREFIX } from './SelfieWebCam';

import {
  SectionWrapper,
  ContentWrapper,
  PaddedRow,
  InlineCheckbox,
  InlineRadio,
  TitleLabel,
  OtherWrapper,
  SectionHeader
} from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';
import {
  setDidClickNav,
  setRequiredErrors,
  renderErrors,
  validateSectionNavigation
} from '../shared/Helpers';
import { bootstrapValidation } from '../shared/Validation';
import { getCurrentPage } from '../utils/Utils';
import { isPortlandOrg } from '../utils/Whitelist';


class ConsumerInfoView extends React.Component {

  static propTypes = {
    isInReview: PropTypes.func.isRequired,
    input: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      identification: PropTypes.string.isRequired,
      militaryStatus: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      race: PropTypes.string.isRequired,
      age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      dob: PropTypes.string.isRequired,
      homeless: PropTypes.bool.isRequired,
      homelessLocation: PropTypes.string.isRequired,
      drugsAlcohol: PropTypes.string.isRequired,
      drugType: PropTypes.string.isRequired,
      prescribedMedication: PropTypes.string.isRequired,
      takingMedication: PropTypes.string.isRequired,
      prevPsychAdmission: PropTypes.string.isRequired,
      selfDiagnosis: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      selfDiagnosisOther: PropTypes.string.isRequired,
      armedWithWeapon: PropTypes.bool.isRequired,
      armedWeaponType: PropTypes.string.isRequired,
      accessToWeapons: PropTypes.bool.isRequired,
      accessibleWeaponType: PropTypes.string.isRequired,
      observedBehaviors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      observedBehaviorsOther: PropTypes.string.isRequired,
      emotionalState: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      emotionalStateOther: PropTypes.string.isRequired,
      photosTakenOf: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      injuries: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      injuriesOther: PropTypes.string.isRequired,
      suicidal: PropTypes.bool.isRequired,
      suicidalActions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      suicideAttemptMethod: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
      suicideAttemptMethodOther: PropTypes.string.isRequired
    }).isRequired,
  }

  static defaultProps = {
    handlePicture: null,
    handleMultiUpdate: null,
    handleTextInput: null,
    handleSingleSelection: null,
    handleCheckboxChange: null,
    handleScaleSelection: null,
    handleDateInput: null,
    consumerIsSelected: null,
    handlePageChange: null,
    section: null,
    history: null,
    location: null,
    selectedOrganizationId: null,  }

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

  handleOnSelfieCapture = (selfieDataAsBase64 :?string) => {

    this.props.handlePicture(this.props.section, 'picture', (selfieDataAsBase64 || ''));
  }

  handlePageChange = (path) => {

    if (this.selfieWebCam) {
      this.selfieWebCam.closeMediaStream();
    }

    this.setState(setDidClickNav);
    this.setState(setRequiredErrors, () => {
      if (this.state.sectionRequiredErrors.length < 1 && this.state.sectionFormatErrors.length < 1) {
        this.props.handlePageChange(path);
      }
    });
  }

  setInputErrors = (name, inputValid, sectionFormatErrors) => {
    this.setState({
      [`${name}Valid`]: inputValid,
      sectionFormatErrors
    });
  }

  componentWillUnmount() {
    validateSectionNavigation(
      this.props.input,
      this.state.requiredFields,
      this.state.currentPage,
      this.props.history
    );
  }

  renderConsumerPicture = (input) => {

    if (!input.picture) {
      return null;
    }

    const pictureDataUrl = `${DATA_URL_PREFIX}${input.picture}`;

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Consumer Picture</TitleLabel>
          <img
              alt="Consumer Picture"
              src={pictureDataUrl} />
        </Col>
      </PaddedRow>
    );
  }

  renderSelfieWebCam = () => {

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Consumer Picture</TitleLabel>
          <InlineCheckbox
              checked={this.state.showSelfieWebCam}
              onChange={this.handleOnChangeTakePicture}>
            Take a picture with your webcam
          </InlineCheckbox>
          {
            !this.state.showSelfieWebCam
              ? null
              : (
                <SelfieWebCam
                    onSelfieCapture={this.handleOnSelfieCapture}
                    ref={(element) => {
                      this.selfieWebCam = element;
                    }} />
              )
          }
        </Col>
      </PaddedRow>
    );
  }

  renderViolenceScale = () => {

    const {
      handleScaleSelection,
      input,
      isInReview,
      section
    } = this.props;

    const isReviewPage = isInReview();

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      scaleRadios.push(
        <InlineRadio
            key={`scale1to10-${i}`}
            inline
            data-section={section}
            name="scale1to10"
            value={i}
            checked={input.scale1to10 === i}
            onChange={handleScaleSelection}
            disabled={isReviewPage}>
          { i }
        </InlineRadio>
      );
    }

    return scaleRadios;
  }

  renderViolencePortland = () => {

    const {
      handleCheckboxChange,
      handleSingleSelection,
      handleTextInput,
      input,
      isInReview,
      section
    } = this.props;

    const { sectionFormatErrors } = this.state;

    const isReviewPage = isInReview();

    return (
      <div>
        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Violence at this incident</TitleLabel>
            <h5>1 = Not at all violent , 10 = Extreme violence</h5>
            { this.renderViolenceScale() }
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Violent behavior during this incident was directed towards:</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline={false}
                  data-section={section}
                  name="directedagainst"
                  value="police"
                  checked={input.directedagainst && input.directedagainst.indexOf('police') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Police
              </InlineCheckbox>
              <InlineCheckbox
                  inline={false}
                  data-section={section}
                  name="directedagainst"
                  value="family"
                  checked={input.directedagainst && input.directedagainst.indexOf('family') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Family
              </InlineCheckbox>
              <InlineCheckbox
                  inline={false}
                  data-section={section}
                  name="directedagainst"
                  value="significantOther"
                  checked={input.directedagainst && input.directedagainst.indexOf('significantOther') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Significant other
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="directedagainst"
                    value="other"
                    checked={input.directedagainst && input.directedagainst.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="directedagainstother"
                    value={input.directedagainstother}
                    onChange={(e) => {
                      handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                    }}
                    disabled={isReviewPage} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>History of Violent Behavior</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="historyofviolence"
                value
                checked={input.historyofviolence}
                onChange={handleSingleSelection}
                disabled={isReviewPage}>
              Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="historyofviolence"
                value={false}
                checked={!input.historyofviolence}
                onChange={handleSingleSelection}
                disabled={isReviewPage}>
              No
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Violent behavior was directed towards:</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline={false}
                  data-section={section}
                  name="historicaldirectedagainst"
                  value="police"
                  checked={input.historicaldirectedagainst && input.historicaldirectedagainst.indexOf('police') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Police
              </InlineCheckbox>
              <InlineCheckbox
                  inline={false}
                  data-section={section}
                  name="historicaldirectedagainst"
                  value="family"
                  checked={input.historicaldirectedagainst && input.historicaldirectedagainst.indexOf('family') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Family
              </InlineCheckbox>
              <InlineCheckbox
                  inline={false}
                  data-section={section}
                  name="historicaldirectedagainst"
                  value="significantOther"
                  checked={input.historicaldirectedagainst && input.historicaldirectedagainst.indexOf('significantOther') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Significant other
              </InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="historicaldirectedagainst"
                    value="other"
                    checked={input.historicaldirectedagainst && input.historicaldirectedagainst.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Other:
                </InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="historicaldirectedagainstother"
                    value={input.historicaldirectedagainstother}
                    onChange={(e) => {
                      handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                    }}
                    disabled={isReviewPage} />
              </OtherWrapper>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Description of historical incidents involving violent behavior</TitleLabel>
            <FormControl
                data-section={section}
                name="historyofviolencetext"
                componentClass="textarea"
                value={input.historyofviolencetext}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isReviewPage} />
          </Col>
        </PaddedRow>
      </div>
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

    return (
      <SectionWrapper>
        { !isReviewPage ? <SectionHeader>Consumer</SectionHeader> : null}
        <ContentWrapper>
          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Last Name</TitleLabel>
              <FormControl
                  data-section={section}
                  name="lastName"
                  value={input.lastName}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={consumerIsSelected || isReviewPage} />
            </Col>
            <Col lg={6}>
              <TitleLabel>First Name</TitleLabel>
              <FormControl
                  data-section={section}
                  name="firstName"
                  value={input.firstName}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={consumerIsSelected || isReviewPage} />
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
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={consumerIsSelected || isReviewPage} />
            </Col>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.identification,
                    identificationValid,
                    true,
                    didClickNav
                  )}>
                <TitleLabel>Consumer Identification*</TitleLabel>
                <FormControl
                    data-section={section}
                    disabled
                    name="identification"
                    value={input.identification} />
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Residence / Address (Street, Apt Number, City, County, State, Zip)</TitleLabel>
              <FormControl
                  data-section={section}
                  name="address"
                  value={input.address}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
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
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          {
            isReviewPage || consumerIsSelected
              ? this.renderConsumerPicture(input)
              : this.renderSelfieWebCam()
          }

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Military Status</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="militaryStatus"
                  value="active"
                  checked={input.militaryStatus === 'active'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Active
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="militaryStatus"
                  value="veteran"
                  checked={input.militaryStatus === 'veteran'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Veteran
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="militaryStatus"
                  value="n/a"
                  checked={input.militaryStatus === 'n/a'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                N/A
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
                  disabled={consumerIsSelected || isReviewPage}>
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
                  disabled={consumerIsSelected || isReviewPage}>
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
              <FormGroup
                  validationState={bootstrapValidation(
                    input.dob,
                    dobValid,
                    false,
                    didClickNav
                  )}>
                <TitleLabel>DOB</TitleLabel>
                <DatePicker
                    value={input.dob}
                    onChange={(e) => {
                      handleDateInput(
                        e,
                        section,
                        'dob',
                        sectionFormatErrors,
                        this.setInputErrors
                      );
                      handleMultiUpdate(section, {
                        age: `${moment().diff(moment(e), 'years')}`
                      });
                    }}
                    disabled={consumerIsSelected || isReviewPage} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup validationState={bootstrapValidation(input.age, ageValid, false, didClickNav)}>
                <TitleLabel>Age</TitleLabel>
                <FormControl
                    data-section={section}
                    name="age"
                    value={input.age}
                    onChange={(e) => {
                      handleTextInput(e, 'int16', sectionFormatErrors, this.setInputErrors);
                    }}
                    disabled={isReviewPage} />
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Homeless</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="homeless"
                  value={true}
                  checked={input.homeless}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="homeless"
                  value={false}
                  checked={!input.homeless}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>No
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
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Consumer Using Drugs, Alcohol</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="drugsAlcohol"
                  value="drugs"
                  checked={input.drugsAlcohol === 'drugs'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Drugs
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="drugsAlcohol"
                  value="alcohol"
                  checked={input.drugsAlcohol === 'alcohol'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Alcohol
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="drugsAlcohol"
                  value="both"
                  checked={input.drugsAlcohol === 'both'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Both
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="drugsAlcohol"
                  value="n/a"
                  checked={input.drugsAlcohol === 'n/a'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                N/A
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
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Prescribed Medication</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="prescribedMedication"
                  value="yes"
                  checked={input.prescribedMedication === 'yes'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="prescribedMedication"
                  value="no"
                  checked={input.prescribedMedication === 'no'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                No
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="prescribedMedication"
                  value="unknown"
                  checked={input.prescribedMedication === 'unknown'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Unknown
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
                  disabled={isReviewPage}>
                Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="takingMedication"
                  value="no"
                  checked={input.takingMedication === 'no'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                No
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="takingMedication"
                  value="unknown"
                  checked={input.takingMedication === 'unknown'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Unknown
              </InlineRadio>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Does Consumer Have Previous Psychiatric Hospital Admission?</TitleLabel>
              <InlineRadio
                  inline
                  type="radio"
                  data-section={section}
                  name="prevPsychAdmission"
                  value="yes"
                  checked={input.prevPsychAdmission === 'yes'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  type="radio"
                  data-section={section}
                  name="prevPsychAdmission"
                  value="no"
                  checked={input.prevPsychAdmission === 'no'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                No
              </InlineRadio>
              <InlineRadio
                  inline
                  type="radio"
                  data-section={section}
                  name="prevPsychAdmission"
                  value="unknown"
                  checked={input.prevPsychAdmission === 'unknown'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Unknown
              </InlineRadio>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Self Diagnosis</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="selfDiagnosis"
                    value="bipolar"
                    checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('bipolar') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Bipolar
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="selfDiagnosis"
                    value="depression"
                    checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('depression') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Depression
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="selfDiagnosis"
                    value="ptsd"
                    checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('ptsd') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  PTSD
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="selfDiagnosis"
                    value="schizophrenia"
                    checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('schizophrenia') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Schizophrenia
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="selfDiagnosis"
                    value="dementia"
                    checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('dementia') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Dementia
                </InlineCheckbox>
                {
                  isPortlandOrg(selectedOrganizationId) && (
                    <InlineCheckbox
                        inline
                        data-section={section}
                        name="selfDiagnosis"
                        value="DevelopmentalDisabilities/Autism"
                        checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('DevelopmentalDisabilities/Autism') !== -1}
                        onChange={handleCheckboxChange}
                        disabled={isReviewPage}>
                      Developmental Disabilities / Autism
                    </InlineCheckbox>
                  )
                }
                <OtherWrapper>
                  <InlineCheckbox
                      data-section={section}
                      name="selfDiagnosis"
                      value="other"
                      checked={input.selfDiagnosis && input.selfDiagnosis.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>
                    Other:
                  </InlineCheckbox>
                  <FormControl
                      data-section={section}
                      name="selfDiagnosisOther"
                      value={input.selfDiagnosisOther}
                      onChange={(e) => {
                        handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                      }}
                      disabled={isReviewPage} />
                </OtherWrapper>
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Armed with Weapon?</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="armedWithWeapon"
                  value
                  checked={input.armedWithWeapon}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="armedWithWeapon"
                  value={false}
                  checked={!input.armedWithWeapon}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                No
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
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Have Access to Weapons?</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="accessToWeapons"
                  value
                  checked={input.accessToWeapons}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="accessToWeapons"
                  value={false}
                  checked={!input.accessToWeapons}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                No
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
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Observed Behaviors (Check all that apply)</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="disorientation"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('disorientation') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Disorientation / Confusion
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="abnormalBehavior"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('abnormalBehavior') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Abnormal Behavior / Appearance (neglect self-care)
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="hearingVoices"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('hearingVoices') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Hearing Voices / Hallucinating
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="anxious"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('anxious') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Anxious / Excited / Agitated
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="depressed"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('depressed') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Depressed Mood
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="paranoid"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('paranoid') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Paranoid or Suspicious
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="self-harm"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('self-harm') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Self-harm
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="observedBehaviors"
                    value="threatening"
                    checked={input.observedBehaviors && input.observedBehaviors.indexOf('threatening') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Threatening / Violent Towards Others
                </InlineCheckbox>
                <OtherWrapper>
                  <InlineCheckbox
                      data-section={section}
                      name="observedBehaviors"
                      value="other"
                      checked={input.observedBehaviors && input.observedBehaviors.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>
                    Other:
                  </InlineCheckbox>
                  <FormControl
                      data-section={section}
                      name="observedBehaviorsOther"
                      value={input.observedBehaviors && input.observedBehaviorsOther}
                      onChange={(e) => {
                        handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                      }}
                      disabled={isReviewPage} />
                </OtherWrapper>
              </FormGroup>
            </Col>
          </PaddedRow>

          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderViolencePortland()
              : null
          }

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Emotional State (Check all that apply)</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="angry"
                    checked={input.emotionalState && input.emotionalState.indexOf('angry') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Angry
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="afraid"
                    checked={input.emotionalState && input.emotionalState.indexOf('afraid') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Afraid
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="apologetic"
                    checked={input.emotionalState && input.emotionalState.indexOf('apologetic') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Apologetic
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="calm"
                    checked={input.emotionalState && input.emotionalState.indexOf('calm') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Calm
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="crying"
                    checked={input.emotionalState && input.emotionalState.indexOf('crying') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Crying
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="fearful"
                    checked={input.emotionalState && input.emotionalState.indexOf('fearful') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Fearful
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="emotionalState"
                    value="nervous"
                    checked={input.emotionalState && input.emotionalState.indexOf('nervous') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Nervous
                </InlineCheckbox>
                <OtherWrapper>
                  <InlineCheckbox
                      inline
                      data-section={section}
                      name="emotionalState"
                      value="other"
                      checked={input.emotionalState && input.emotionalState.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>
                    Other:
                  </InlineCheckbox>
                  <FormControl
                      data-section={section}
                      name="emotionalStateOther"
                      value={input.emotionalStateOther}
                      onChange={(e) => {
                        handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                      }}
                      disabled={isReviewPage} />
                </OtherWrapper>
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Photos Taken Of:</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="photosTakenOf"
                    value="injuries"
                    checked={input.photosTakenOf && input.photosTakenOf.indexOf('injuries') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Injuries
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="photosTakenOf"
                    value="propertyDamage"
                    checked={input.photosTakenOf && input.photosTakenOf.indexOf('propertyDamage') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Damage / Crime Scene
                </InlineCheckbox>
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Consumer Injuries</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="injuries"
                    value="abrasions"
                    checked={input.injuries && input.injuries.indexOf('abrasions') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Abrasions
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="injuries"
                    value="bruises"
                    checked={input.injuries && input.injuries.indexOf('bruises') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Bruises
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="injuries"
                    value="complaintsOfPain"
                    checked={input.injuries && input.injuries.indexOf('complaintsOfPain') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Complaints of Pain
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="injuries"
                    value="concussion"
                    checked={input.injuries && input.injuries.indexOf('concussion') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Concussion
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="injuries"
                    value="fractures"
                    checked={input.injuries && input.injuries.indexOf('fractures') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Fractures
                </InlineCheckbox>
                <OtherWrapper>
                  <InlineCheckbox
                      data-section={section}
                      name="injuries"
                      value="other"
                      checked={input.injuries && input.injuries.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>
                    Other:
                  </InlineCheckbox>
                  <FormControl
                      data-section={section}
                      name="injuriesOther"
                      value={input.injuriesOther}
                      onChange={(e) => {
                        handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                      }}
                      disabled={isReviewPage} />
                </OtherWrapper>
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Suicidal</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="suicidal"
                  value
                  checked={input.suicidal}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="suicidal"
                  value={false}
                  checked={!input.suicidal}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                No
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
                  checked={input.suicidalActions && input.suicidalActions.indexOf('thoughts') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Thoughts
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicidalActions"
                  value="threat"
                  checked={input.suicidalActions && input.suicidalActions.indexOf('threat') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Threat
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicidalActions"
                  value="attempt"
                  checked={input.suicidalActions && input.suicidalActions.indexOf('attempt') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Attempt
              </InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="suicidalActions"
                  value="completed"
                  checked={input.suicidalActions && input.suicidalActions.indexOf('completed') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>
                Completed
              </InlineCheckbox>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Method Used to Attempt, Threaten, or Complete Suicide</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="suicideAttemptMethod"
                    value="narcotics"
                    checked={input.suicideAttemptMethod && input.suicideAttemptMethod.indexOf('narcotics') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Narcotics (Prescription or Illicit)
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="suicideAttemptMethod"
                    value="alcohol"
                    checked={input.suicideAttemptMethod && input.suicideAttemptMethod.indexOf('alcohol') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Alcohol
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="suicideAttemptMethod"
                    value="knife"
                    checked={input.suicideAttemptMethod && input.suicideAttemptMethod.indexOf('knife') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Knife / Cutting Tool
                </InlineCheckbox>
                <InlineCheckbox
                    inline
                    data-section={section}
                    name="suicideAttemptMethod"
                    value="firearm"
                    checked={input.suicideAttemptMethod && input.suicideAttemptMethod.indexOf('firearm') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Firearm
                </InlineCheckbox>
                <OtherWrapper>
                  <InlineCheckbox
                      data-section={section}
                      name="suicideAttemptMethod"
                      value="other"
                      checked={input.suicideAttemptMethod && input.suicideAttemptMethod.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>
                    Other:
                  </InlineCheckbox>
                  <FormControl
                      data-section={section}
                      name="suicideAttemptMethodOther"
                      value={input.suicideAttemptMethod && input.suicideAttemptMethodOther}
                      onChange={(e) => {
                        handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                      }}
                      disabled={isReviewPage} />
                </OtherWrapper>
              </FormGroup>
            </Col>
          </PaddedRow>
        </ContentWrapper>

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
      </SectionWrapper>
    );
  }
}

export default withRouter(ConsumerInfoView);
