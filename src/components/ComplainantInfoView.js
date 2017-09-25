/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, STATES, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateOnInput } from '../shared/Validation';

const REQUIRED_FIELDS = ['complainantLastName', 'complainantFirstName'];

class ComplainantInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      complainantFirstNameValid: true,
      complainantLastNameValid: true,
      sectionValid: false,
      didClickNav: false
    }
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
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
    if (!this.state.sectionValid) {
      console.log('section not valid!');
      // show errors
    } else {
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
      input,
      isInReview,
      handlePageChange,
      handleSingleSelection
    } = this.props;

    return(
      <div>
        { !isInReview() ? <SectionHeader>Complainant</SectionHeader> : null}

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'complainantLastName', true)}>
              <TitleLabel>28. Last Name*</TitleLabel>
              <FormControl data-section={section} name='complainantLastName' value={input.complainantLastName} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'complainantFirstName', true)}>
              <TitleLabel>First Name*</TitleLabel>
              <FormControl data-section={section} name='complainantFirstName' value={input.complainantFirstName} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Middle Name</TitleLabel>
            <FormControl data-section={section} name='complainantMiddleName' value={input.complainantMiddleName} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Address</TitleLabel>
            <FormControl data-section={section} name='complainantStreet' value={input.complainantStreet} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>City</TitleLabel>
            <FormControl data-section={section} name='complainantCity' value={input.complainantCity} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>State</TitleLabel>
            <FormControl
                componentClass='select'
                placeholder='select'
                data-section={section}
                name='complainantState'
                value={input.complainantState}
                onChange={handleSingleSelection}
                disabled={isInReview()}>
              <option value=''>Select</option>
              { STATES.map((state) => (<option key={state} value={state}>{state}</option>)) }
            </FormControl>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>County</TitleLabel>
            <FormControl data-section={section} name='complainantCounty' value={input.complainantCounty} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Zip</TitleLabel>
            <FormControl data-section={section} name='complainantZip' value={input.complainantZip} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Relationship to Consumer</TitleLabel>
            <FormControl data-section={section} name='complainantConsumerRelationship' value={input.complainantConsumerRelationship} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Phone Number</TitleLabel>
            <FormControl data-section={section} name='complainantPhone' value={input.complainantPhone} onChange={(e) => handleTextInput(e, this, 'string', REQUIRED_FIELDS)} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        { !isInReview() ? <FormNav prevPath={FORM_PATHS.CONSUMER} nextPath={FORM_PATHS.DISPOSITION} handlePageChange={this.handlePageChange} setDidClickNav={this.setDidClickNav} /> : null}
        { this.renderErrors() }
      </div>
    );
  }
}

export default ComplainantInfoView;
