/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';
import Promise from 'bluebird';

import FormNav from './FormNav';
import { TitleLabel, InlineRadio, PaddedRow, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateRequiredInput } from '../shared/Validation';


const REQUIRED_FIELDS = ['complaintNumber'];

class ReportInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      complaintNumberValid: true,
      cadNumberValid: true,
      dateOccurredValid: true,
      sectionValid: false,
      didClickNav: false
    };
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleDateInput: PropTypes.func.isRequired,
    handleTimeInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    input: PropTypes.shape({
      dispatchReason: PropTypes.string.isRequired,
      complaintNumber: PropTypes.string.isRequired,
      companionOffenseReport: PropTypes.bool.isRequired,
      incident: PropTypes.string.isRequired,
      locationOfIncident: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
      postOfOccurrence: PropTypes.string.isRequired,
      cadNumber: PropTypes.string.isRequired,
      onView: PropTypes.bool.isRequired,
      dateOccurred: PropTypes.string.isRequired,
      timeOccurred: PropTypes.string.isRequired,
      dateReported: PropTypes.string.isRequired,
      timeReported: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  handlePageChange = (path) => {
    this.setState({ didClickNav: true });
    validateRequiredInput(this.props.input, REQUIRED_FIELDS, this.state.sectionRequiredErrors, this.setRequiredErrors, path);
  }

  setInputErrors = (name, inputValid, sectionFormatErrors) => {
    this.setState({
      [`${name}Valid`]: inputValid,
      sectionFormatErrors
    })
  }

  setRequiredErrors = (sectionRequiredErrors, sectionValid, path) => {
    this.setState({
      sectionRequiredErrors,
      sectionValid
    }, () => {
     if (this.state.sectionValid) {
       console.log('section is valiiiid');
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
      handleTimeInput,
      handleSingleSelection,
      input,
      isInReview,
      handlePageChange
    } = this.props;

    const {
      complaintNumberValid,
      cadNumberValid,
      didClickNav,
      sectionFormatErrors,
      sectionRequiredErrors
    } = this.state;

    return (
      <div>
        { !isInReview() ? <SectionHeader>Report Info</SectionHeader> : null}
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
            <FormControl
                data-section={section}
                name="dispatchReason"
                value={input.dispatchReason}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <FormGroup
                validationState={bootstrapValidation(
                  input.complaintNumber,
                  complaintNumberValid,
                  true,
                  didClickNav
                  )}>
              <TitleLabel>2. Complaint Number*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="complaintNumber"
                  value={input.complaintNumber}
                  onChange={(e) => {
                    handleTextInput(e, 'number', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>3. Companion Offense Report Prepared</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="companionOffenseReport"
                value
                checked={input.companionOffenseReport}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="companionOffenseReport"
                value={false}
                checked={!input.companionOffenseReport}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
          </Col>
          <Col lg={6}>
            <TitleLabel>4. Crime / Incident</TitleLabel>
            <FormControl
                data-section={section}
                name="incident"
                value={input.incident}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>5. Location of Offense / Incident</TitleLabel>
            <FormControl
                data-section={section}
                name="locationOfIncident"
                value={input.locationOfIncident}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>6. Unit</TitleLabel>
            <FormControl
                data-section={section}
                name="unit"
                value={input.unit}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>7. Post of Occurrence</TitleLabel>
            <FormControl
                data-section={section}
                name="postOfOccurrence"
                value={input.postOfOccurrence}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(input.cadNumber, cadNumberValid, false, didClickNav)}>
              <TitleLabel>8. CAD Number</TitleLabel>
              <FormControl
                  data-section={section}
                  name="cadNumber"
                  value={input.cadNumber}
                  onChange={(e) => {
                    handleTextInput(e, 'number', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>9. On View</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name="onView"
                value
                checked={input.onView}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes
            </InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="onView"
                value={false}
                checked={!input.onView}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No
            </InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={bootstrapValidation(this, 'dateOccurred')}>
              <TitleLabel>10. Date Occurred</TitleLabel>
              <DatePicker
                  value={input.dateOccurred}
                  onChange={(e) => {
                    handleDateInput(e, section, 'dateOccurred');
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>Time Occurred</TitleLabel>
            <TimePicker
                value={input.timeOccurred}
                onChange={(e) => {
                  handleTimeInput(e, section, 'timeOccurred');
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>11. Date Reported</TitleLabel>
            <DatePicker
                value={input.dateReported}
                onChange={(e) => {
                  handleDateInput(e, section, 'dateReported');
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Time Reported</TitleLabel>
            <TimePicker
                value={input.timeReported}
                onChange={(e) => {
                  handleTimeInput(e, section, 'timeReported');
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>
        {
          !isInReview()
            ? <FormNav
                nextPath={FORM_PATHS.CONSUMER_SEARCH}
                handlePageChange={this.handlePageChange}
                sectionValid={this.state.sectionValid}
                setDidClickNav={this.setDidClickNav} />
            : null
        }
        { this.renderErrors() }
      </div>
    );
  }
}

export default ReportInfoView;
