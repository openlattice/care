/*
 * @flow
 */

import React from 'react';

import moment from 'moment';
import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import TextAreaField from '../../components/text/TextAreaField';
import TextField from '../../components/text/TextField';
import Spinner from '../../components/spinner/Spinner';
import StyledCard from '../../components/cards/StyledCard';
import * as Routes from '../../core/router/Routes';
import {
  ContainerInnerWrapper,
  ContainerOuterWrapper,
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
} from './FollowUpReportConstants';

const FormHeader = styled.h1`
  font-size: 25px;
  font-weight: normal;
  text-align: center;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-gap: 30px;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: auto auto;
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

type Props = {
  consumer :Map<*, *>;
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
    };
  }

  isReadyToSubmit = () :boolean => {

    const {
      [DATE_VAL]: dateValue,
      [CLINICIAN_NAME_VAL]: clinicianNameValue,
      [OFFICER_NAME_VAL]: officerNameValue,
      [OFFICER_SEQ_ID_VAL]: officerSeqIdValue,
      [REASON_VAL]: reasonValue,
      [SUMMARY_VAL]: summaryValue,
    } = this.state;

    return !!clinicianNameValue
      && !!dateValue
      && !!officerNameValue
      && !!officerSeqIdValue
      && !!reasonValue
      && !!summaryValue;
  }

  handleOnChangeInputString = (event) => {

    this.setState({
      [event.target.name]: event.target.value || '',
    });
  }

  handleOnChangeDate = (event) => {

    const date :moment = moment(event.target.value);
    this.setState({
      [DATE_VAL]: date.toISOString(true), // TODO: why is "bhr.dateReported" a DateTimeOffset datatype?
    });
  }

  handleOnSubmit = () => {

    const { onSubmit } = this.props;
    const {
      [DATE_VAL]: dateValue,
      [CLINICIAN_NAME_VAL]: clinicianNameValue,
      [OFFICER_NAME_VAL]: officerNameValue,
      [OFFICER_SEQ_ID_VAL]: officerSeqIdValue,
      [REASON_VAL]: reasonValue,
      [SUMMARY_VAL]: summaryValue,
    } = this.state;

    onSubmit({
      [DATE_VAL]: dateValue,
      [CLINICIAN_NAME_VAL]: clinicianNameValue,
      [OFFICER_NAME_VAL]: officerNameValue,
      [OFFICER_SEQ_ID_VAL]: officerSeqIdValue,
      [REASON_VAL]: reasonValue,
      [SUMMARY_VAL]: summaryValue,
    });
  }

  renderForm = () => {

    const { consumer, onCancel, submissionState } = this.props;

    // TODO: replace the date section with the component from lattice-ui-kit
    return (
      <FormWrapper>
        <FormHeader>Follow-Up Report</FormHeader>
        <PersonDetailsSearchResult personDetails={consumer} />
        <div>
          <label htmlFor="follow-up-date">
            <p>Date*</p>
            <input id="follow-up-date" type="date" onChange={this.handleOnChangeDate} />
          </label>
        </div>
        <TextField
            header="Clinician Name*"
            name={CLINICIAN_NAME_VAL}
            onChange={this.handleOnChangeInputString} />
        <TextField
            header="Officer Name*"
            name={OFFICER_NAME_VAL}
            onChange={this.handleOnChangeInputString} />
        <TextField
            header="Officer Seq Id*"
            name={OFFICER_SEQ_ID_VAL}
            onChange={this.handleOnChangeInputString} />
        <TextAreaField
            header="Reason for Follow-Up*"
            name={REASON_VAL}
            onChange={this.handleOnChangeInputString} />
        <TextAreaField
            header="Summary / Notes*"
            name={SUMMARY_VAL}
            onChange={this.handleOnChangeInputString} />
        <ActionButtons>
          <Button onClick={onCancel}>Cancel</Button>
          {
            (this.isReadyToSubmit() && submissionState === SUBMISSION_STATES.PRE_SUBMIT)
              ? <Button mode="primary" onClick={this.handleOnSubmit}>Submit</Button>
              : <Button mode="primary" disabled>Submit</Button>
          }
        </ActionButtons>
      </FormWrapper>
    );
  }

  render() {

    const { submissionState } = this.props;
    if (submissionState === SUBMISSION_STATES.IS_SUBMITTING) {
      return <Spinner />;
    }

    if (submissionState === SUBMISSION_STATES.SUBMIT_SUCCESS) {
      return (
        <Success>
          <p>Success!</p>
          <NavLink to={Routes.ROOT}>Home</NavLink>
        </Success>
      );
    }

    if (submissionState === SUBMISSION_STATES.SUBMIT_FAILURE) {
      return (
        <Failure>
          <NavLink to={PAGE_1}>Failed to submit. Please try again.</NavLink>
        </Failure>
      );
    }

    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            { this.renderForm() }
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

export default withRouter(
  connect(mapStateToProps)(FollowUpReportContainer)
);
