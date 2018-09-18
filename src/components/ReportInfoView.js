import React from 'react';

import moment from 'moment';
import { withRouter } from 'react-router';

import FormNav from './FormNav';
import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import {
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';

class ReportInfoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dateOccurredValid: true,
      dateReportedValid: true,
      section: 'reportInfo',
    };
  }

  handlePageChange = (path) => {

    // TODO: validation
    const { handlePageChange } = this.props;
    handlePageChange(path);
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked, onChange) => {

    const { isInReview } = this.props;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            disabled={isInReview}
            id={id}
            name={name}
            onChange={onChange}
            type="radio"
            value={value} />
        { label }
      </label>
    );
  }

  render() {

    const {
      input,
      isInReview,
      updateStateValue,
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            { !isInReview && (
              <h1>Report</h1>
            )}
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Primary Reason for Dispatch"
              onChange={value => updateStateValue(section, 'dispatchReason', value)}
              value={input.dispatchReason} />
          <TextField
              disabled={isInReview}
              header="Complaint Number*"
              onChange={value => updateStateValue(section, 'complaintNumber', value)}
              value={input.complaintNumber} />
          <HalfWidthItem>
            <FieldHeader>Companion Offense Report Prepared</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  'companionOffenseReport',
                  true,
                  input.companionOffenseReport === true,
                  () => updateStateValue(section, 'companionOffenseReport', true),
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  'companionOffenseReport',
                  false,
                  input.companionOffenseReport === false,
                  () => updateStateValue(section, 'companionOffenseReport', false)
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <TextField
              disabled={isInReview}
              header="Crime / Incident*"
              onChange={value => updateStateValue(section, 'incident', value)}
              value={input.incident} />
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Location of Offense / Incident"
                onChange={value => updateStateValue(section, 'locationOfIncident', value)}
                value={input.locationOfIncident} />
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Unit"
              onChange={value => updateStateValue(section, 'unit', value)}
              value={input.unit} />
          <TextField
              disabled={isInReview}
              header="Post of Occurrence"
              onChange={value => updateStateValue(section, 'postOfOccurrence', value)}
              value={input.postOfOccurrence} />
          <TextField
              disabled={isInReview}
              header="CAD Number"
              onChange={value => updateStateValue(section, 'cadNumber', value)}
              value={input.cadNumber} />
          <HalfWidthItem>
            <FieldHeader>On View</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  'onView',
                  true,
                  input.onView === true,
                  () => updateStateValue(section, 'onView', true),
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  'onView',
                  false,
                  input.onView === false,
                  () => updateStateValue(section, 'onView', false),
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-occurred">
              <FieldHeader>Date Occurred*</FieldHeader>
              <input
                  disabled={isInReview}
                  id="date-occurred"
                  onChange={(event) => {
                    const date = event.target.value;
                    const isValid = moment(date).isSameOrBefore(moment());
                    this.setState({ dateOccurredValid: isValid });
                    updateStateValue(section, 'dateOccurred', date)
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
                  id="time-occurred"
                  onChange={(event) => {
                    updateStateValue(section, 'timeOccurred', event.target.value);
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
                  onChange={(event) => {
                    const date = event.target.value;
                    const isValid = (
                      moment(date).isSameOrBefore(moment()) && moment(date).isSameOrAfter(moment(input.dateOccurred))
                    );
                    this.setState({ dateReportedValid: isValid });
                    updateStateValue(section, 'dateReported', date);
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
                  onChange={(event) => {
                    updateStateValue(section, 'timeReported', event.target.value);
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
