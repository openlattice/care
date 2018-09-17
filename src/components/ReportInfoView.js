import React from 'react';

import moment from 'moment';
import { withRouter } from 'react-router';

import FormNav from './FormNav';
import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import {
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';
import { FORM_PATHS } from '../shared/Consts';
import { getCurrentPage } from '../utils/Utils';

class ReportInfoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: getCurrentPage(),
      requiredFields: ['dateOccurred', 'dateReported', 'complaintNumber', 'incident'],
      section: 'reportInfo',
    };
  }

  areRequiredFieldsValid = () => (
    /* eslint-disable react/destructuring-assignment */
    this.state.requiredFields.every(fieldName => this.state[`${fieldName}Valid`])
    /* eslint-enable */
  )

  handlePageChange = (path) => {

    // TODO: validation
    const { handlePageChange } = this.props;
    handlePageChange(path);
  }

  handleOnChange = (event) => {

    // TODO: validation
    const { updateStateValue } = this.props;
    const { section } = this.state;
    const { name, value } = event.target;
    updateStateValue(section, name, value);
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked) => {

    const { isInReview } = this.props;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            disabled={isInReview}
            id={id}
            name={name}
            onChange={this.handleOnChange}
            type="radio"
            value={value} />
        { label }
      </label>
    );
  }

  render() {
    const {
      handleDatePickerDateTimeOffset,
      handleTimeInput,
      input,
      isInReview,
      section,
    } = this.props;
    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            { !isInReview && (
              <h1>Report Info</h1>
            )}
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Primary Reason for Dispatch"
              name="dispatchReason"
              onChange={this.handleOnChange} />
          <TextField
              disabled={isInReview}
              header="Complaint Number*"
              name="complaintNumber"
              onChange={this.handleOnChange} />
          <HalfWidthItem>
            <FieldHeader>Companion Offense Report Prepared</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'companionOffenseReport', true, input.companionOffenseReport === true) }
              { this.renderTempRadio('No', 'companionOffenseReport', false, input.companionOffenseReport === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <TextField
              disabled={isInReview}
              header="Crime / Incident*"
              name="incident"
              onChange={this.handleOnChange} />
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Location of Offense / Incident"
                name="locationOfIncident"
                onChange={this.handleOnChange} />
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Unit"
              name="unit"
              onChange={this.handleOnChange} />
          <TextField
              disabled={isInReview}
              header="Post of Occurrence"
              name="postOfOccurrence"
              onChange={this.handleOnChange} />
          <TextField
              disabled={isInReview}
              header="CAD Number"
              name="cadNumber"
              onChange={this.handleOnChange} />
          <HalfWidthItem>
            <FieldHeader>On View</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'onView', true, input.onView === true) }
              { this.renderTempRadio('No', 'onView', false, input.onView === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-occurred">
              <FieldHeader>Date Occurred*</FieldHeader>
              <input
                  disabled={isInReview}
                  id="date-occurred"
                  onChange={(e) => {
                    const chosenDate = e.target.value;
                    this.setState(
                      {
                        dateOccurredValid: moment(chosenDate).isSameOrBefore(moment())
                      },
                      () => {
                        handleDatePickerDateTimeOffset(chosenDate, section, 'dateOccurred');
                      }
                    );
                  }}
                  type="date"
                  value={input.dateOccurred} />
            </label>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="time-occurred">
              <FieldHeader>Time Occurred</FieldHeader>
              <input
                  disabled={isInReview}
                  id="time-reported"
                  onChange={(e) => {
                    handleTimeInput(e, section, 'timeOccurred');
                  }}
                  type="time"
                  value={input.timeOccurred} />
            </label>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-reported">
              <FieldHeader>Date Reported*</FieldHeader>
              <input
                  disabled={isInReview}
                  id="date-reported"
                  onChange={(e) => {
                    const chosenDate = e.target.value;
                    const isValid = moment(chosenDate).isSameOrBefore(moment())
                      && moment(chosenDate).isSameOrAfter(moment(input.dateOccurred));
                    this.setState(
                      {
                        dateReportedValid: isValid
                      },
                      () => {
                        handleDatePickerDateTimeOffset(chosenDate, section, 'dateReported');
                      }
                    );
                  }}
                  type="date"
                  value={input.dateReported} />
            </label>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="time-reported">
              <FieldHeader>Time Reported</FieldHeader>
              <input
                  disabled={isInReview}
                  id="time-reported"
                  onChange={(e) => {
                    handleTimeInput(e, section, 'timeReported');
                  }}
                  type="time"
                  value={input.timeReported} />
            </label>
          </HalfWidthItem>
        </FormGridWrapper>
        {
          !isInReview
            ? (
              <FormNav
                  prevPath={FORM_PATHS.CONSUMER}
                  nextPath={FORM_PATHS.COMPLAINANT}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
      </>
    );
  }
}

export default withRouter(ReportInfoView);
