import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormNav from './FormNav';
import {
  TitleLabel,
  InlineRadio,
  PaddedRow,
  SectionWrapper,
  ContentWrapper,
  SectionHeader
} from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import {
  setDidClickNav,
  setRequiredErrors,
  renderErrors,
  validateSectionNavigation
} from '../shared/Helpers';
import { getCurrentPage } from '../utils/Utils';
import { bootstrapValidation } from '../shared/Validation';


class ReportInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredFields: ['dateOccurred', 'dateReported', 'complaintNumber', 'incident'],
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      sectionErrors: [],
      postOfOccurrenceValid: true,
      complaintNumberValid: true,
      incidentValid: true,
      cadNumberValid: true,
      dateOccurredValid: true,
      dateReportedValid: true,
      unitValid: true,
      sectionValid: false,
      didClickNav: this.props.location.state
        ? this.props.location.state.didClickNav
        : false,
      currentPage: getCurrentPage()
    };
  }

  static propTypes = {
    handleDatePickerDateTimeOffset: PropTypes.func.isRequired,
    handleTextInput: PropTypes.func.isRequired,
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
      handleDatePickerDateTimeOffset,
      handleTextInput,
      handleTimeInput,
      handleSingleSelection,
      input,
      isInReview,
      section
    } = this.props;

    const {
      postOfOccurrenceValid,
      complaintNumberValid,
      incidentValid,
      cadNumberValid,
      dateOccurredValid,
      dateReportedValid,
      unitValid,
      didClickNav,
      sectionFormatErrors,
      sectionRequiredErrors
    } = this.state;

    const isReviewPage = isInReview();

    return (
      <SectionWrapper>
        { !isReviewPage ? <SectionHeader>Report Info</SectionHeader> : null}
        <ContentWrapper>
          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Primary Reason for Dispatch</TitleLabel>
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
                  disabled={isReviewPage} />
            </Col>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.complaintNumber,
                    complaintNumberValid,
                    true,
                    didClickNav
                  )}>
                <TitleLabel>Complaint Number*</TitleLabel>
                <FormControl
                    data-section={section}
                    name="complaintNumber"
                    value={input.complaintNumber}
                    onChange={(e) => {
                      handleTextInput(
                        e,
                        'int64',
                        sectionFormatErrors,
                        this.setInputErrors
                      );
                    }}
                    disabled={isReviewPage} />
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Companion Offense Report Prepared</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="companionOffenseReport"
                  value
                  checked={input.companionOffenseReport}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="companionOffenseReport"
                  value={false}
                  checked={!input.companionOffenseReport}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>No
              </InlineRadio>
            </Col>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.incident,
                    incidentValid,
                    true,
                    didClickNav
                  )}>
                <TitleLabel>Crime / Incident*</TitleLabel>
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
                    disabled={isReviewPage} />
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>Location of Offense / Incident</TitleLabel>
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
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.unit,
                    unitValid,
                    false,
                    didClickNav
                  )}>
                <TitleLabel>Unit</TitleLabel>
                <FormControl
                    data-section={section}
                    name="unit"
                    value={input.unit}
                    onChange={(e) => {
                      handleTextInput(
                        e,
                        'alphanumeric',
                        sectionFormatErrors,
                        this.setInputErrors
                      );
                    }}
                    disabled={isReviewPage} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.postOfOccurrence,
                    postOfOccurrenceValid,
                    false,
                    didClickNav
                  )}>
                <TitleLabel>Post of Occurrence</TitleLabel>
                <FormControl
                    data-section={section}
                    name="postOfOccurrence"
                    value={input.postOfOccurrence}
                    onChange={(e) => {
                      handleTextInput(
                        e,
                        'int16',
                        sectionFormatErrors,
                        this.setInputErrors
                      );
                    }}
                    disabled={isReviewPage} />
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
                <TitleLabel>CAD Number</TitleLabel>
                <FormControl
                    data-section={section}
                    name="cadNumber"
                    value={input.cadNumber}
                    onChange={(e) => {
                      handleTextInput(
                        e,
                        'int16',
                        sectionFormatErrors,
                        this.setInputErrors
                      );
                    }}
                    disabled={isReviewPage} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <TitleLabel>On View</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="onView"
                  value
                  checked={input.onView}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>Yes
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="onView"
                  value={false}
                  checked={!input.onView}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>No
              </InlineRadio>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.dateOccurred,
                    dateOccurredValid,
                    true,
                    didClickNav
                  )}>
                <TitleLabel>Date Occurred*</TitleLabel>
                <DatePicker
                    disabled={isReviewPage}
                    onChange={(value) => {
                      handleDatePickerDateTimeOffset(value, section, 'dateOccurred');
                    }}
                    value={input.dateOccurred} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <TitleLabel>Time Occurred</TitleLabel>
              <TimePicker
                  value={input.timeOccurred}
                  onChange={(e) => {
                    handleTimeInput(e, section, 'timeOccurred');
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <FormGroup
                  validationState={bootstrapValidation(
                    input.dateReported,
                    dateReportedValid,
                    true,
                    didClickNav
                  )}>
                <TitleLabel>Date Reported*</TitleLabel>
                <DatePicker
                    value={input.dateReported}
                    onChange={(value) => {
                      handleDatePickerDateTimeOffset(value, section, 'dateReported');
                    }}
                    disabled={isReviewPage} />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <TitleLabel>Time Reported</TitleLabel>
              <TimePicker
                  disabled={isReviewPage}
                  onChange={(e) => {
                    handleTimeInput(e, section, 'timeReported');
                  }}
                  value={input.timeReported} />
            </Col>
          </PaddedRow>
        </ContentWrapper>
        {
          !isReviewPage
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
      </SectionWrapper>
    );
  }
}

export default withRouter(ReportInfoView);
