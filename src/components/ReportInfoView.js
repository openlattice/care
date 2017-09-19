/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import TimePicker from 'react-bootstrap-time-picker';

import FormNav from './FormNav';
import { TitleLabel, LabelDescription, InlineRadio, PaddedRow, SectionHeader } from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';
import { getNumberValidation, getDateValidation } from '../shared/Validation';


class ReportInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionErrors: [],
      complaintNumberValid: true,
      sectionValid: true,
      didClickNav: false
    }
  }
  
  static propTypes = {
    input: PropTypes.object.isRequired,
    handleTextInput: PropTypes.func.isRequired,
    handleDateInput: PropTypes.func.isRequired,
    handleTimeInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired
  }

  bootstrapValidation = (name, required) => {
    const inputValid = this.state[`${name}Valid`];
    const input = this.props.input[name];
    // If required, show error for invalid input only if user has tried to navigate to next/prev section
    if (!inputValid && this.state.didClickNav) return 'error';
    // Show error if there is input and it is invalid 
    if (input && input.length && !inputValid) return 'error';
  }

  validateOnInput = (input, name, fieldType, required) => {
    const validStateKey = `${name}Valid`;
    let inputValid = this.state[validStateKey];
    let sectionErrors = this.state.sectionErrors;

    switch(fieldType) {
      case 'number':
        if (input && isNaN(input)) {
          inputValid = false;
          // sectionErrors.push('Input must be a number');
        } else {
          inputValid = true;
        }
        break;
      default:
        return;
    }

    if (required) {
      if (!input) {
        // sectionErrors.push('Input is required');
        inputValid = false;
      }
    }

    this.setState({
      // sectionErrors,
      complaintNumberValid: inputValid
    }, () => {
      // todo: remove hardcoded value
      if (this.state.complaintNumberValid) {
        this.setState({ sectionValid: true });
      } else {
        this.setState({ sectionValid: false });
      }
    });
  }

  handleTextInput = (e) => {
    const {input} = this.props;
    this.props.handleTextInput(e);
    this.validateOnInput(input.complaintNumber, 'complaintNumber', 'number', true);
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

    const requiredFieldStates = {
      complaintNumber: this.state.complaintNoIsValid
    }

    return (
      <div>
        { !isInReview() ? <SectionHeader>Report Info</SectionHeader> : null}
        <PaddedRow>
          <Col lg={6}>
              <TitleLabel>1. Primary Reason for Dispatch</TitleLabel>
              <FormControl data-section={section} name='dispatchReason' value={input.dispatchReason} onChange={this.handleTextInput} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <FormGroup validationState={this.bootstrapValidation('complaintNumber', true)}>
              <TitleLabel>2. Complaint Number*</TitleLabel>
              <FormControl data-section={section} name='complaintNumber' value={input.complaintNumber} onChange={this.handleTextInput} disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

         <PaddedRow>
           <Col lg={6}>
             <TitleLabel>3. Companion Offense Report Prepared</TitleLabel>
             <InlineRadio
                inline
                data-section={section}
                name='companionOffenseReport'
                value={true}
                checked={input.companionOffenseReport === 'true'}
                onChange={handleSingleSelection}
                disabled={isInReview()} >Yes</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name ='companionOffenseReport'
                value={false}
                checked={input.companionOffenseReport === 'false'}
                onChange={handleSingleSelection}
                disabled={isInReview()} >No</InlineRadio>
          </Col>
          <Col lg={6}>
            <TitleLabel>4. Crime / Incident</TitleLabel>
            <FormControl data-section={section} name='incident' value={input.incident} onChange={handleTextInput} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>5. Location of Offense / Incident</TitleLabel>
            <FormControl data-section={section} name='locationOfIncident' value={input.locationOfIncident} onChange={handleTextInput} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>6. Unit</TitleLabel>
            <FormControl data-section={section} name='unit' value={input.unit} onChange={handleTextInput} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>7. Post of Occurrence</TitleLabel>
            <FormControl data-section={section} name='postOfOccurrence' value={input.postOfOccurrence} onChange={handleTextInput} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={getNumberValidation(input.cadNumber)}>
              <TitleLabel>8. CAD Number</TitleLabel>
              <FormControl data-section={section} name='cadNumber' value={input.cadNumber} onChange={handleTextInput} disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>9. On View</TitleLabel>
            <InlineRadio
                inline
                data-section={section}
                name='onView'
                value={true}
                checked={input.onView === 'true'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>Yes</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name ='onView'
                value={false}
                checked={input.onView === 'false'}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No</InlineRadio>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup validationState={getDateValidation(input.dateOccurred)}>
              <TitleLabel>10. Date Occurred</TitleLabel>
              <DatePicker value={input.dateOccurred} onChange={(e) => {handleDateInput(e, section, 'dateOccurred')}} disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>Time Occurred</TitleLabel>
            <TimePicker value={input.timeOccurred} onChange={(e) => {handleTimeInput(e, section, 'timeOccurred')}} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>11. Date Reported</TitleLabel>
            <DatePicker value={input.dateReported} onChange={(e) => {handleDateInput(e, section, 'dateReported')}} disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Time Reported</TitleLabel>
            <TimePicker value={input.timeReported} onChange={(e) => {handleTimeInput(e, section, 'timeReported')}} disabled={isInReview()} />
          </Col>
        </PaddedRow>

        { !isInReview() ? <FormNav nextPath={FORM_PATHS.CONSUMER_SEARCH} handlePageChange={this.handlePageChange} sectionValid={this.state.sectionValid} setDidClickNav={this.setDidClickNav} /> : null}
      </div>
    );
  }
}

export default ReportInfoView;
