/*
 * @flow
 */

import React from 'react';

import DatePicker from 'react-bootstrap-date-picker';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Immutable from 'immutable';
import TimePicker from 'react-bootstrap-time-picker';
import isString from 'lodash/isString';
import moment from 'moment';
import styled from 'styled-components';
import validator from 'validator';
import { faUserAlt } from '@fortawesome/fontawesome-pro-light';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import StyledButton from '../../components/buttons/StyledButton';
import StyledCard from '../../components/cards/StyledCard';
import { DATA_URL_PREFIX } from '../../components/SelfieWebCam';
import { PERSON } from '../../shared/Consts';
import { PaddedRow, TitleLabel } from '../../shared/Layout';
import { formatTimePickerSeconds } from '../../utils/Utils';
import { clearConsumerSearchResults, searchConsumers } from '../search/SearchActionFactory';

const {
  DOB_FQN,
  FIRST_NAME_FQN,
  ID_FQN,
  LAST_NAME_FQN,
  PICTURE_FQN,
  RACE_FQN,
  SEX_FQN
} = PERSON;

/*
 * constants
 */

const DATE_FORMAT :string = 'YYYY-MM-DD';

const CLINICIAN_NAME_VAL :'clinicianNameValue' = 'clinicianNameValue';
const COMPLAINT_NUMBER_VAL :'complaintNumberValue' = 'complaintNumberValue';
const DATE_VAL :'dateValue' = 'dateValue';
const OFFICER_NAME_VAL :'officerNameValue' = 'officerNameValue';
const OFFICER_SEQ_ID_VAL :'officerSeqIdValue' = 'officerSeqIdValue';
const REASON_VAL :'reasonValue' = 'reasonValue';
const SUMMARY_VAL :'summaryValue' = 'summaryValue';
const TIME_VAL :'timeValue' = 'timeValue';

/*
 * styled components
 */

const ContainerOuterWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const ContainerInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 900px;
`;

const FormHeader = styled.div`
  font-size: 25px;
  margin-bottom: 30px;
  text-align: center;
`;

const SectionHeader = styled.div`
  font-size: 21px;
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

const SearchResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 50px; /* height of loading spinner */
  position: relative;
`;

const SearchResult = styled.div``;
const NoSearchResults = styled.div`
  font-weight: bold;
  text-align: center;
`;

const SectionWrapper = styled.div`
  margin-bottom: 30px;
`;

const PersonDetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  margin: 10px 0;
  &:hover {
    cursor: ${props => (props.viewOnly ? 'default' : 'pointer')};
  }
`;

const PersonPictureWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 200px;
`;

const PersonPicture = styled.img`
  max-height: 150px;
`;

const PersonInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 10px;
`;

const PersonInfoHeaders = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  strong {
    font-weight: 600;
  }
`;

const PersonInfoValues = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0;
  margin-left: 10px;
  span {
    margin: 0;
  }
`;

/*
 * types
 */

type Props = {
  actions :{
    clearConsumerSearchResults :Function,
    searchConsumers :RequestSequence
  };
  isSearching :boolean;
  peopleEntitySetId :string;
  searchResults :List;
};

type State = {
  clinicianNameValue :?string;
  complaintNumberValue :?string;
  consumerSearchQuery :string;
  dateValue :?string;
  officerNameValue :?string;
  officerSeqIdValue :?string;
  reasonValue :?string;
  searchAttempt :boolean;
  selectedConsumer :Map;
  summaryValue :?string;
  timeValue :?string;
};

class FollowUpReportContainer extends React.Component<Props, State> {

  constructor(props :Props) {

    super(props);

    this.state = {
      [CLINICIAN_NAME_VAL]: null,
      [COMPLAINT_NUMBER_VAL]: null,
      [DATE_VAL]: null,
      [OFFICER_NAME_VAL]: null,
      [OFFICER_SEQ_ID_VAL]: null,
      [REASON_VAL]: null,
      [SUMMARY_VAL]: null,
      [TIME_VAL]: formatTimePickerSeconds(0), // 12:00 am
      consumerSearchQuery: '',
      searchAttempt: false,
      selectedConsumer: Immutable.Map()
    };
  }

  componentWillUnmount() {
    this.props.actions.clearConsumerSearchResults();
  }

  isReadyToSubmit = () :boolean => {

    return !!this.state[DATE_VAL]
      && !!this.state[CLINICIAN_NAME_VAL]
      && !!this.state[COMPLAINT_NUMBER_VAL]
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

  handleOnChangeDate = (value :?string, formattedValue :?string) => {

    const dateValue :string = formattedValue || '';
    this.setState({
      dateValue
    });
  }

  handleOnChangeTime = (seconds :?number) => {

    this.setState({
      timeValue: formatTimePickerSeconds(seconds)
    });
  }

  handleOnChangeConsumerSearchQuery = (event :SyntheticInputEvent<*>) => {

    this.setState({
      consumerSearchQuery: event.target.value
    });
  }

  handleOnConsumerSearchSubmit = () => {

    this.setState({
      searchAttempt: true
    });

    this.props.actions.searchConsumers({
      entitySetId: this.props.peopleEntitySetId,
      query: this.state.consumerSearchQuery
    });
  }

  handleOnCancel = () => {

    this.setState({
      [CLINICIAN_NAME_VAL]: null,
      [COMPLAINT_NUMBER_VAL]: null,
      [DATE_VAL]: null,
      [OFFICER_NAME_VAL]: null,
      [OFFICER_SEQ_ID_VAL]: null,
      [REASON_VAL]: null,
      [SUMMARY_VAL]: null,
      [TIME_VAL]: formatTimePickerSeconds(0), // 12:00 am
      consumerSearchQuery: '',
      searchAttempt: false,
      selectedConsumer: Immutable.Map()
    });
  }

  handleOnSubmit = () => {

  }

  handleOnSelectSearchResult = (selectedConsumer) => {

    this.setState({
      selectedConsumer
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

  renderSearch = () => {

    return (
      <div>
        <SearchBar
            handleInput={this.handleOnChangeConsumerSearchQuery}
            query={this.state.consumerSearchQuery}
            title="Search for consumer"
            onSearchSubmit={this.handleOnConsumerSearchSubmit} />
        { this.renderSearchResults() }
      </div>
    );
  }

  renderSearchResults = () => {

    if (!this.state.searchAttempt) {
      return null;
    }

    const searchResults = [];
    if (this.props.searchResults.size > 0) {
      this.props.searchResults.forEach((result :Map<*, *>) => {
        searchResults.push(
          <SearchResult
              key={result.getIn(['id', 0])}
              onClick={() => {
                this.handleOnSelectSearchResult(result);
              }}>
            { this.renderConsumerDetails(result, false) }
          </SearchResult>
        );
      });
    }

    return (
      <SearchResultsWrapper>
        {
          (this.props.isSearching)
            ? <Loading />
            : null
        }
        {
          (!this.props.isSearching && searchResults.length === 0)
            ? <NoSearchResults>No results</NoSearchResults>
            : searchResults
        }
      </SearchResultsWrapper>
    );
  }

  renderConsumerDetails = (consumer :Map<*, *>, viewOnly :boolean) => {

    if (!consumer || consumer.isEmpty()) {
      return null;
    }

    // TODO: how do we avoid having to hardcode FQNs???
    const pictureStr = consumer.getIn([PICTURE_FQN, 0]);
    const pictureImgSrc = `${DATA_URL_PREFIX}${pictureStr}`;

    const id = consumer.getIn([ID_FQN, 0]);
    const firstName = consumer.getIn([FIRST_NAME_FQN, 0]);
    const lastName = consumer.getIn([LAST_NAME_FQN, 0]);
    const sex = consumer.getIn([SEX_FQN, 0], '');
    const race = consumer.getIn([RACE_FQN, 0], '');
    const dob = consumer.getIn([DOB_FQN, 0], '');

    let dobFormatted = dob;
    if (dob) {
      dobFormatted = moment(dob).format('MMMM Do YYYY');
    }

    return (
      <PersonDetailsRow viewOnly={viewOnly}>
        <PersonPictureWrapper>
          {
            (!pictureStr || pictureStr.length <= 0)
              ? <FontAwesomeIcon icon={faUserAlt} size="6x" />
              : <PersonPicture src={pictureImgSrc} role="presentation" />
          }
        </PersonPictureWrapper>
        <PersonInfoWrapper>
          <PersonInfoHeaders>
            <strong>First Name:</strong>
            <strong>Last Name:</strong>
            <strong>Date of Birth:</strong>
            <strong>Sex:</strong>
            <strong>Race:</strong>
            <strong>Identifier:</strong>
          </PersonInfoHeaders>
          <PersonInfoValues>
            {
              (firstName && firstName.length > 0)
                ? <span>{ firstName }</span>
                : <span>&nbsp;</span>
            }
            {
              (lastName && lastName.length > 0)
                ? <span>{ lastName }</span>
                : <span>&nbsp;</span>
            }
            {
              (dobFormatted && dobFormatted.length > 0)
                ? <span>{ dobFormatted }</span>
                : <span>&nbsp;</span>
            }
            {
              (sex && sex.length > 0)
                ? <span>{ sex }</span>
                : <span>&nbsp;</span>
            }
            {
              (race && race.length > 0)
                ? <span>{ race }</span>
                : <span>&nbsp;</span>
            }
            {
              (id && id.length > 0)
                ? <span>{ id }</span>
                : <span>&nbsp;</span>
            }
          </PersonInfoValues>
        </PersonInfoWrapper>
      </PersonDetailsRow>
    );
  }

  renderConsumerDetailsSection = () => {

    if (this.state.selectedConsumer.isEmpty()) {
      return null;
    }

    return (
      <SectionWrapper>
        <SectionHeader>Consumer Details</SectionHeader>
        { this.renderConsumerDetails(this.state.selectedConsumer, true) }
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
            <FormGroup validationState={this.checkValidationState('int64', this.state[COMPLAINT_NUMBER_VAL])}>
              <TitleLabel>Complaint Number*</TitleLabel>
              <FormControl
                  name={COMPLAINT_NUMBER_VAL}
                  value={this.state[COMPLAINT_NUMBER_VAL] === null ? '' : this.state[COMPLAINT_NUMBER_VAL]}
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
              (this.isReadyToSubmit())
                ? <StyledButton onClick={this.handleOnSubmit}>Submit</StyledButton>
                : <StyledButton disabled>Submit</StyledButton>
            }
            <StyledButton onClick={this.handleOnCancel}>Cancel</StyledButton>
          </ActionButtons>
        </PaddedRow>
      </SectionWrapper>
    );
  }

  renderForm = () => {

    return (
      <div>
        { this.renderConsumerDetailsSection() }
        { this.renderReportDetailsSection() }
      </div>
    );
  }

  render() {

    return (
      <ContainerOuterWrapper>
        <ContainerInnerWrapper>
          <StyledCard>
            <FormHeader>Follow-Up Report</FormHeader>
            {
              (this.state.selectedConsumer.isEmpty())
                ? this.renderSearch()
                : this.renderForm()
            }
          </StyledCard>
        </ContainerInnerWrapper>
      </ContainerOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  const selectedOrganizationId :string = state.getIn(['app', 'selectedOrganization']);
  const peopleEntitySetId :string = state.getIn([
    'app',
    'app.people',
    'entitySetsByOrganization',
    selectedOrganizationId
  ]);

  return {
    peopleEntitySetId,
    isSearching: state.getIn(['search', 'consumers', 'isSearching'], false),
    searchResults: state.getIn(['search', 'consumers', 'searchResults'], Immutable.List())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    clearConsumerSearchResults,
    searchConsumers
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FollowUpReportContainer)
);
