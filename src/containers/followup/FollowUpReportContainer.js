/*
 * @flow
 */

import React from 'react';

import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';
import isString from 'lodash/isString';
import styled from 'styled-components';
import validator from 'validator';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import Spinner from '../../components/spinner/Spinner';
import StyledButton from '../../components/buttons/StyledButton';
import StyledCard from '../../components/cards/StyledCard';
import * as Routes from '../../core/router/Routes';
import { fixDatePickerIsoDateTime, formatTimePickerSeconds } from '../../utils/Utils';
import {
  ContainerInnerWrapper,
  ContainerOuterWrapper,
  PaddedRow,
  TitleLabel
} from '../../shared/Layout';

import PersonDetailsSearchResult from '../search/PersonDetailsSearchResult';
import { SUBMISSION_STATES } from './FollowUpReportReducer';
import {
  PAGE_1,
  CLINICIAN_NAME_VAL,
  DATE_VAL,
  OFFICER_NAME_VAL,
  OFFICER_SEQ_ID_VAL,
  REASON_VAL,
  SUMMARY_VAL,
  TIME_VAL
} from './FollowUpReportConstants';

/*
 * constants
 */

const DATE_FORMAT :string = 'YYYY-MM-DD';

/*
 * styled components
 */

const FormHeader = styled.div`
  font-size: 25px;
  margin-bottom: 30px;
  text-align: center;
`;

const SectionHeader = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 10px;
  }
`;

const SectionWrapper = styled.div`
  margin-bottom: 30px;
`;

// color: #5bcc75;
const Success = styled.div`
  text-align: center;
  p {
    font-size: 20px;
    margin-bottom: 20px;
  }
  a {
    text-decoration: none;
  }
`;

const Failure = styled.div`
  text-align: center;
  a {
    text-decoration: none;
  }
`;

/*
 * types
 */

type Props = {
  consumer :Map<*, *>;
  consumerNeighbor :Map<*, *>;
  peopleEntitySetId :string;
  submissionState :number;
  onCancel :Function;
  onSubmit :Function;
};

type State = {
  clinicianNameValue :?string;
  dateValue :?string;
  officerNameValue :?string;
  officerSeqIdValue :?string;
  reasonValue :?string;
  summaryValue :?string;
  timeValue :?string;
};

class FollowUpReportContainer extends React.Component<Props, State> {

  constructor(props :Props) {

    super(props);

    this.state = {
      [CLINICIAN_NAME_VAL]: null,
      [DATE_VAL]: null,
      [OFFICER_NAME_VAL]: null,
      [OFFICER_SEQ_ID_VAL]: null,
      [REASON_VAL]: null,
      [SUMMARY_VAL]: null,
      [TIME_VAL]: formatTimePickerSeconds(0) // 12:00 am
    };
  }

  isReadyToSubmit = () :boolean => {

    return !!this.state[DATE_VAL]
      && !!this.state[CLINICIAN_NAME_VAL]
      && !!this.state[OFFICER_NAME_VAL]
      && !!this.state[OFFICER_SEQ_ID_VAL]
      && !!this.state[REASON_VAL]
      && !!this.state[SUMMARY_VAL]
      && !!this.state[TIME_VAL];
  }

  handleOnChangeInputString = (event) => {

    this.setState({
      [event.target.name]: event.target.value || ''
    });
  }

  handleOnChangeDate = (value :?string) => {

    this.setState({
      dateValue: fixDatePickerIsoDateTime(value)
    });
  }

  handleOnChangeTime = (seconds :?number) => {

    this.setState({
      timeValue: formatTimePickerSeconds(seconds)
    });
  }

  handleOnSubmit = () => {

    this.props.onSubmit({
      [CLINICIAN_NAME_VAL]: this.state.clinicianNameValue,
      [DATE_VAL]: this.state.dateValue,
      [OFFICER_NAME_VAL]: this.state.officerNameValue,
      [OFFICER_SEQ_ID_VAL]: this.state.officerSeqIdValue,
      [REASON_VAL]: this.state.reasonValue,
      [SUMMARY_VAL]: this.state.summaryValue,
      [TIME_VAL]: this.state.timeValue
    });
  }

  checkValidationState = (type, value) => {

    let validationState :?string = 'error';

    if (value === null || value === undefined) {
      return null;
    }

    switch (type) {
      case 'int64': {
        const isValid = validator.isInt(value.toString(), {
          max: Number.MAX_SAFE_INTEGER,
          min: Number.MIN_SAFE_INTEGER
        });
        if (isValid) {
          validationState = null;
        }
        break;
      }
      default:
        if (isString(value) && value.length > 0) {
          validationState = null;
        }
        break;
    }

    return validationState;
  }

  renderConsumerDetailsSection = () => {

    return (
      <SectionWrapper>
        <SectionHeader>Consumer Details</SectionHeader>
        <PersonDetailsSearchResult personDetails={this.props.consumer} />
      </SectionWrapper>
    );
  }

  renderReportDetailsSection = () => {

    return (
      <SectionWrapper>
        <SectionHeader>Report Details</SectionHeader>
        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={this.checkValidationState('date', this.state[DATE_VAL])}>
              <TitleLabel>Date*</TitleLabel>
              <DatePicker
                  dateFormat={DATE_FORMAT}
                  showTodayButton
                  value={this.state[DATE_VAL]}
                  onChange={this.handleOnChangeDate} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup validationState={this.checkValidationState('date', this.state[TIME_VAL])}>
              <TitleLabel>Time*</TitleLabel>
              <TimePicker value={this.state[TIME_VAL]} onChange={this.handleOnChangeTime} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={this.checkValidationState('string', this.state[CLINICIAN_NAME_VAL])}>
              <TitleLabel>Clinician Name*</TitleLabel>
              <FormControl
                  name={CLINICIAN_NAME_VAL}
                  value={this.state[CLINICIAN_NAME_VAL] === null ? '' : this.state[CLINICIAN_NAME_VAL]}
                  onChange={this.handleOnChangeInputString} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={this.checkValidationState('string', this.state[OFFICER_NAME_VAL])}>
              <TitleLabel>Officer Name*</TitleLabel>
              <FormControl
                  name={OFFICER_NAME_VAL}
                  value={this.state[OFFICER_NAME_VAL] === null ? '' : this.state[OFFICER_NAME_VAL]}
                  onChange={this.handleOnChangeInputString} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <FormGroup validationState={this.checkValidationState('string', this.state[OFFICER_SEQ_ID_VAL])}>
              <TitleLabel>Officer Seq ID*</TitleLabel>
              <FormControl
                  name={OFFICER_SEQ_ID_VAL}
                  value={this.state[OFFICER_SEQ_ID_VAL] === null ? '' : this.state[OFFICER_SEQ_ID_VAL]}
                  onChange={this.handleOnChangeInputString} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={12}>
            <FormGroup validationState={this.checkValidationState('string', this.state[REASON_VAL])}>
              <TitleLabel>Reason for Follow-Up*</TitleLabel>
              <FormControl
                  componentClass="textarea"
                  name={REASON_VAL}
                  value={this.state[REASON_VAL] === null ? '' : this.state[REASON_VAL]}
                  onChange={this.handleOnChangeInputString} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={12}>
            <FormGroup validationState={this.checkValidationState('string', this.state[SUMMARY_VAL])}>
              <TitleLabel>Summary / Notes*</TitleLabel>
              <FormControl
                  componentClass="textarea"
                  name={SUMMARY_VAL}
                  value={this.state[SUMMARY_VAL] === null ? '' : this.state[SUMMARY_VAL]}
                  onChange={this.handleOnChangeInputString} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <ActionButtons>
            {
              (this.isReadyToSubmit() && this.props.submissionState === SUBMISSION_STATES.PRE_SUBMIT)
                ? <StyledButton onClick={this.handleOnSubmit}>Submit</StyledButton>
                : <StyledButton disabled>Submit</StyledButton>
            }
            <StyledButton onClick={this.props.onCancel}>Cancel</StyledButton>
          </ActionButtons>
        </PaddedRow>
      </SectionWrapper>
    );
  }

  renderContent = () => {

    if (this.props.submissionState === SUBMISSION_STATES.SUBMIT_SUCCESS) {
      return (
        <Success>
          <p>Success!</p>
          <NavLink to={Routes.ROOT}>Home</NavLink>
        </Success>
      );
    }
    else if (this.props.submissionState === SUBMISSION_STATES.SUBMIT_FAILURE) {
      return (
        <Failure>
          <NavLink to={PAGE_1}>Failed to submit. Please try again.</NavLink>
        </Failure>
      );
    }

    return (
      <div>
        <FormHeader>Follow-Up Report</FormHeader>
        { this.renderConsumerDetailsSection() }
        { this.renderReportDetailsSection() }
      </div>
    );
  }

  render() {

    if (this.props.submissionState === SUBMISSION_STATES.IS_SUBMITTING) {
      return <Spinner />;
    }

    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            { this.renderContent() }
          </StyledCard>
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    submissionState: state.getIn(['followUpReport', 'submissionState'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {};

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FollowUpReportContainer)
);
