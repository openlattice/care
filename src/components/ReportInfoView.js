import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormNav from './FormNav';
import { TitleLabel, InlineRadio, PaddedRow, SectionHeader } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import {
  setDidClickNav,
  setRequiredErrors,
  renderErrors,
  validateSectionNavigation
} from '../shared/Helpers';
import { bootstrapValidation } from '../shared/Validation';


class ReportInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredFields: ['complaintNumber'],
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      sectionErrors: [],
      postOfOccurrenceValid: true,
      complaintNumberValid: true,
      cadNumberValid: true,
      dateOccurredValid: true,
      dateReportedValid: true,
      sectionValid: false,
      didClickNav: this.props.location.state
        ? this.props.location.state.didClickNav
        : false,
      currentPage: parseInt(location.hash.substr(2), 10)
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
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
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

  handlePageChange = (path) => {
    this.setState(setDidClickNav);
    this.setState(setRequiredErrors, () => {
      if (this.state.sectionRequiredErrors.length < 1
        && this.state.sectionFormatErrors.length < 1) {
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

  render() {
    const {
      section,
      handleTextInput,
      handleDateInput,
      handleTimeInput,
      handleSingleSelection,
      input,
      isInReview
    } = this.props;

    const {
      postOfOccurrenceValid,
      complaintNumberValid,
      cadNumberValid,
      dateOccurredValid,
      dateReportedValid,
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
                  handleTextInput(
                    e,
                    'string',
                    sectionFormatErrors,
                    this.setInputErrors
                  );
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
                    handleTextInput(
                      e,
                      'Int64',
                      sectionFormatErrors,
                      this.setInputErrors
                    );
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
                  handleTextInput(
                    e,
                    'string',
                    sectionFormatErrors,
                    this.setInputErrors
                  );
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
                  handleTextInput(
                    e,
                    'string',
                    sectionFormatErrors,
                    this.setInputErrors
                  );
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
                  handleTextInput(
                    e,
                    'string',
                    sectionFormatErrors,
                    this.setInputErrors
                  );
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <FormGroup
                validationState={bootstrapValidation(
                  input.postOfOccurrence,
                  postOfOccurrenceValid,
                  true,
                  didClickNav
                )}>
              <TitleLabel>7. Post of Occurrence</TitleLabel>
              <FormControl
                  data-section={section}
                  name="postOfOccurrence"
                  value={input.postOfOccurrence}
                  onChange={(e) => {
                    handleTextInput(
                      e,
                      'Int16',
                      sectionFormatErrors,
                      this.setInputErrors
                    );
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup
                validationState={bootstrapValidation(
                  input.cadNumber,
                  cadNumberValid,
                  false,
                  didClickNav
                )}>
              <TitleLabel>8. CAD Number</TitleLabel>
              <FormControl
                  data-section={section}
                  name="cadNumber"
                  value={input.cadNumber}
                  onChange={(e) => {
                    handleTextInput(
                      e,
                      'Int16',
                      sectionFormatErrors,
                      this.setInputErrors
                    );
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
            <FormGroup
                validationState={bootstrapValidation(
                  input.dateOccurred,
                  dateOccurredValid,
                  false,
                  didClickNav
                )}>
              <TitleLabel>10. Date Occurred</TitleLabel>
              <DatePicker
                  value={input.dateOccurred}
                  onChange={(e) => {
                    handleDateInput(
                      e,
                      section,
                      'dateOccurred',
                      sectionFormatErrors,
                      this.setInputErrors
                    );
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
            <FormGroup
                validationState={bootstrapValidation(
                  input.dateReported,
                  dateReportedValid,
                  false,
                  didClickNav
                )}>
              <TitleLabel>11. Date Reported</TitleLabel>
              <DatePicker
                  value={input.dateReported}
                  onChange={(e) => {
                    handleDateInput(
                      e,
                      section,
                      'dateReported',
                      sectionFormatErrors,
                      this.setInputErrors);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
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
            ? (
              <FormNav
                  prevPath={FORM_PATHS.CONSUMER}
                  nextPath={FORM_PATHS.COMPLAINANT}
                  handlePageChange={this.handlePageChange}
                  sectionValid={this.state.sectionValid} />
            )
            : null
        }
        { renderErrors(sectionFormatErrors, sectionRequiredErrors, didClickNav) }
      </div>
    );
  }
}

export default withRouter(ReportInfoView);
