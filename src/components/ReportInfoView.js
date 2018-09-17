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

  handleOnChangeTextInput = (event) => {

    // TODO: validation
    const { handleMultiUpdate, section } = this.props;
    const { name, value } = event.target;
    handleMultiUpdate(section, { [name]: value });
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked) => {

    const { handleSingleSelection, isInReview, section } = this.props;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview()}
            id={id}
            name={name}
            onChange={handleSingleSelection}
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
    const isReviewPage = isInReview();

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            {
              isReviewPage
                ? null
                : (
                  <h1>Report Info</h1>
                )
            }
          </FullWidthItem>
          <TextField
              disabled={isReviewPage}
              header="Primary Reason for Dispatch"
              name="dispatchReason"
              onChange={this.handleOnChangeTextInput} />
          <TextField
              disabled={isReviewPage}
              header="Complaint Number*"
              name="complaintNumber"
              onChange={this.handleOnChangeTextInput} />
          <HalfWidthItem>
            <FieldHeader>Companion Offense Report Prepared</FieldHeader>
            <FlexyWrapper inline>
              { this.renderTempRadio('Yes', 'companionOffenseReport', true, input.companionOffenseReport === true) }
              { this.renderTempRadio('No', 'companionOffenseReport', false, input.companionOffenseReport === false) }
            </FlexyWrapper>
          </HalfWidthItem>
          <TextField
              disabled={isReviewPage}
              header="Crime / Incident*"
              name="incident"
              onChange={this.handleOnChangeTextInput} />
          <FullWidthItem>
            <TextField
                disabled={isReviewPage}
                header="Location of Offense / Incident"
                name="locationOfIncident"
                onChange={this.handleOnChangeTextInput} />
          </FullWidthItem>
          <TextField
              disabled={isReviewPage}
              header="Unit"
              name="unit"
              onChange={this.handleOnChangeTextInput} />
          <TextField
              disabled={isReviewPage}
              header="Post of Occurrence"
              name="postOfOccurrence"
              onChange={this.handleOnChangeTextInput} />
          <TextField
              disabled={isReviewPage}
              header="CAD Number"
              name="cadNumber"
              onChange={this.handleOnChangeTextInput} />
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
                  disabled={isReviewPage}
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
                  disabled={isReviewPage}
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
                  disabled={isReviewPage}
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
                  disabled={isReviewPage}
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
          !isReviewPage
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
