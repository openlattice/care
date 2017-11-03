/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateOnInput, validateRequiredInput } from '../shared/Validation';

const REQUIRED_FIELDS = ['complainantName'];

class ComplainantInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      complainantNameValid: true,
      sectionValid: false,
      didClickNav: false
    };
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
      input,
      isInReview
    } = this.props;

    return (
      <div>
        { !isInReview() ? <SectionHeader>Complainant</SectionHeader> : null}

        <PaddedRow>
          <Col lg={12}>
            <FormGroup validationState={bootstrapValidation(this, 'complainantName', true)}>
              <TitleLabel>28. Complainant Name (Last, First, MI)*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="complainantName"
                  value={input.complainantName}
                  onChange={(e) => {
                    handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Residence / Address (Street, Apt Number, City, County, State, Zip)</TitleLabel>
            <FormControl
                data-section={section}
                name="complainantAddress"
                value={input.complainantAddress}
                onChange={(e) => {
                  handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Relationship to Consumer</TitleLabel>
            <FormControl
                data-section={section}
                name="complainantConsumerRelationship"
                value={input.complainantConsumerRelationship}
                onChange={(e) => {
                  handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Phone Number</TitleLabel>
            <FormControl
                data-section={section}
                name="complainantPhone"
                value={input.complainantPhone}
                onChange={(e) => {
                  handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        {
          !isInReview()
            ? <FormNav
                prevPath={FORM_PATHS.CONSUMER}
                nextPath={FORM_PATHS.DISPOSITION}
                handlePageChange={this.handlePageChange}
                setDidClickNav={this.setDidClickNav} />
            : null
        }
        { this.renderErrors() }
      </div>
    );
  }
}

export default ComplainantInfoView;
