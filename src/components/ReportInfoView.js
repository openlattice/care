import React from 'react';

import moment from 'moment';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import {
  formatAsDate,
  formatAsTime,
  replaceDateTimeDate,
  replaceDateTimeTime,
} from '../utils/DateUtils';
import {
  EditButton,
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';
import {
  CAD_NUMBER_FQN,
  COMPANION_OFFENSE_REPORT_FQN,
  DATE_TIME_OCCURRED_FQN,
  DATE_TIME_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  INCIDENT_FQN,
  LOCATION_OF_INCIDENT_FQN,
  OL_ID_FQN,
  ON_VIEW_FQN,
  POST_OF_OCCURRENCE_FQN,
  UNIT_FQN,
} from '../edm/DataModelFqns';

class ReportInfoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      datetimeOccurredValid: true,
      datetimeReportedValid: true,
      section: 'reportInfo',
    };
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked, onChange) => {

    const { isReadOnly } = this.props;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            disabled={isReadOnly}
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
      isReadOnly,
      updateStateValue,
    } = this.props;
    const { section } = this.state;

    const dateOccurredFormatted = formatAsDate(input[DATE_TIME_OCCURRED_FQN]);
    const dateReportedFormatted = formatAsDate(input[DATE_TIME_REPORTED_FQN]);
    const timeOccurredFormatted = formatAsTime(input[DATE_TIME_OCCURRED_FQN]);
    const timeReportedFormatted = formatAsTime(input[DATE_TIME_REPORTED_FQN]);

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            <h1>Report</h1>
            { isInReview && (
              <Link to={FORM_PATHS.REPORT}>
                <EditButton onClick={this.handleOnClickEditReport}>Edit</EditButton>
              </Link>
            )}
          </FullWidthItem>
          <TextField
              disabled={isReadOnly}
              header="Primary Reason for Dispatch"
              onChange={value => updateStateValue(section, DISPATCH_REASON_FQN, value)}
              value={input[DISPATCH_REASON_FQN]} />
          <TextField
              disabled={isReadOnly}
              header="Complaint Number*"
              onChange={value => updateStateValue(section, OL_ID_FQN, value)}
              value={input[OL_ID_FQN]} />
          <HalfWidthItem>
            <FieldHeader>Companion Offense Report Prepared</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  COMPANION_OFFENSE_REPORT_FQN,
                  true,
                  input[COMPANION_OFFENSE_REPORT_FQN] === true,
                  () => updateStateValue(section, COMPANION_OFFENSE_REPORT_FQN, true),
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  COMPANION_OFFENSE_REPORT_FQN,
                  false,
                  input[COMPANION_OFFENSE_REPORT_FQN] === false,
                  () => updateStateValue(section, COMPANION_OFFENSE_REPORT_FQN, false)
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <TextField
              disabled={isReadOnly}
              header="Crime / Incident*"
              onChange={value => updateStateValue(section, INCIDENT_FQN, value)}
              value={input[INCIDENT_FQN]} />
          <FullWidthItem>
            <TextField
                disabled={isReadOnly}
                header="Location of Offense / Incident"
                onChange={value => updateStateValue(section, LOCATION_OF_INCIDENT_FQN, value)}
                value={input[LOCATION_OF_INCIDENT_FQN]} />
          </FullWidthItem>
          <TextField
              disabled={isReadOnly}
              header="Unit"
              onChange={value => updateStateValue(section, UNIT_FQN, value)}
              value={input[UNIT_FQN]} />
          <TextField
              disabled={isReadOnly}
              header="Post of Occurrence"
              onChange={value => updateStateValue(section, POST_OF_OCCURRENCE_FQN, value)}
              value={input[POST_OF_OCCURRENCE_FQN]} />
          <TextField
              disabled={isReadOnly}
              header="CAD Number"
              onChange={value => updateStateValue(section, CAD_NUMBER_FQN, value)}
              value={input[CAD_NUMBER_FQN]} />
          <HalfWidthItem>
            <FieldHeader>On View</FieldHeader>
            <FlexyWrapper inline>
              {
                this.renderTempRadio(
                  'Yes',
                  ON_VIEW_FQN,
                  true,
                  input[ON_VIEW_FQN] === true,
                  () => updateStateValue(section, ON_VIEW_FQN, true),
                )
              }
              {
                this.renderTempRadio(
                  'No',
                  ON_VIEW_FQN,
                  false,
                  input[ON_VIEW_FQN] === false,
                  () => updateStateValue(section, ON_VIEW_FQN, false),
                )
              }
            </FlexyWrapper>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-occurred">
              <FieldHeader>Date Occurred*</FieldHeader>
              <input
                  disabled={isReadOnly}
                  id="date-occurred"
                  onChange={(event) => {
                    const date = event.target.value;
                    const isValid = moment(date).isSameOrBefore(moment());
                    this.setState({ datetimeOccurredValid: isValid });

                    const datetime = replaceDateTimeDate(input[DATE_TIME_OCCURRED_FQN], date);
                    updateStateValue(section, DATE_TIME_OCCURRED_FQN, datetime);
                  }}
                  type="date"
                  value={dateOccurredFormatted} />
            </label>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="time-occurred">
              <FieldHeader>Time Occurred</FieldHeader>
              <input
                  disabled={isReadOnly}
                  id="time-occurred"
                  onChange={(event) => {
                    const datetime = replaceDateTimeTime(input[DATE_TIME_OCCURRED_FQN], event.target.value);
                    updateStateValue(section, DATE_TIME_OCCURRED_FQN, datetime);
                  }}
                  type="time"
                  value={timeOccurredFormatted} />
            </label>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="date-reported">
              <FieldHeader>Date Reported*</FieldHeader>
              <input
                  disabled={isReadOnly}
                  id="date-reported"
                  onChange={(event) => {
                    const date = event.target.value;
                    const isValid = moment(date).isSameOrBefore(moment())
                        && moment(date).isSameOrAfter(moment(input[DATE_TIME_OCCURRED_FQN]));
                    this.setState({ datetimeReportedValid: isValid });

                    const datetime = replaceDateTimeDate(input[DATE_TIME_REPORTED_FQN], date);
                    updateStateValue(section, DATE_TIME_REPORTED_FQN, datetime);
                  }}
                  type="date"
                  value={dateReportedFormatted} />
            </label>
          </HalfWidthItem>
          <HalfWidthItem>
            <label htmlFor="time-reported">
              <FieldHeader>Time Reported</FieldHeader>
              <input
                  disabled={isReadOnly}
                  id="time-reported"
                  onChange={(event) => {
                    const datetime = replaceDateTimeTime(input[DATE_TIME_REPORTED_FQN], event.target.value);
                    updateStateValue(section, DATE_TIME_REPORTED_FQN, datetime);
                  }}
                  type="time"
                  value={timeReportedFormatted} />
            </label>
          </HalfWidthItem>
        </FormGridWrapper>
      </>
    );
  }
}

export default withRouter(ReportInfoView);
