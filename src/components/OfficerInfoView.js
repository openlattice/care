/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col, FormGroup } from 'react-bootstrap';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, InlineCheckbox, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateOnInput, validateRequiredInput } from '../shared/Validation';

const REQUIRED_FIELDS = ['officerLastName', 'officerFirstName'];


class OfficerInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      officerLastNameValid: true,
      officerFirstNameValid: true,
      sectionValid: false,
      didClickNav: false
    }
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired
  }

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  handlePageChange = (path) => {
    this.setState({ didClickNav: true });
    validateRequiredInput(this, REQUIRED_FIELDS);
    if (this.state.sectionValid) {
      this.props.handlePageChange(path);
    }
  }

  renderErrors = () => {
    console.log('section errors:', this.state.sectionRequiredErrors, this.state.sectionFormatErrors);
    const formatErrors = this.state.sectionFormatErrors.map((error) => <ErrorMessage key={error}>{error}</ErrorMessage>);
    let requiredErrors = [];
    if (this.state.didClickNav) {
      requiredErrors = this.state.sectionRequiredErrors.map((error) => <ErrorMessage key={error}>{error}</ErrorMessage>);
    };

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
      handleCheckboxChange,
      input,
      isInReview,
      handlePageChange
    } = this.props;

    return(
      <div>
        { !isInReview() ? <SectionHeader>Officer</SectionHeader> : null }

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'officerLastName', true)}>
              <TitleLabel>33. Last Name*</TitleLabel>
              <FormControl data-section={section} name='officerLastName' value={input.officerLastName} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'officerFirstName', true)}>
              <TitleLabel>First Name*</TitleLabel>
              <FormControl data-section={section} name='officerFirstName' value={input.officerFirstName} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>34. Seq ID</TitleLabel>
            <FormControl data-section={section} name='officerSeqID' value={input.officerSeqID} onChange={(e) => handleTextInput(e, this, 'number', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>35. Officer Injuries</TitleLabel>
            <FormControl data-section={section} name='officerInjuries' value={input.officerInjuries} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>36. Officer Certification</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='officerCertification'
                  value='crtUnit'
                  checked={input.officerCertification.indexOf('crtUnit') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>CRT Unit</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='officerCertification'
                  value='best'
                  checked={input.officerCertification.indexOf('best') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>BEST</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='officerCertification'
                  value='cit'
                  checked={input.officerCertification.indexOf('cit') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>CIT</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name='officerCertification'
                  value='n/a'
                  checked={input.officerCertification.indexOf('n/a') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>N/A</InlineCheckbox>
            </FormGroup>
          </Col>
        </PaddedRow>

        { !isInReview() ? <FormNav prevPath={FORM_PATHS.DISPOSITION} nextPath={FORM_PATHS.REVIEW} handlePageChange={this.handlePageChange} setDidClickNav={this.setDidClickNav} /> : null}
        { this.renderErrors() }
      </div>
    );
  }
}

export default OfficerInfoView;
