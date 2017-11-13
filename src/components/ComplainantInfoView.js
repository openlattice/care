/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateRequiredInput } from '../shared/Validation';

const REQUIRED_FIELDS = ['complainantName'];

class ComplainantInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      complainantNameValid: true,
      sectionValid: false,
      didClickNav: this.props.location.state
          ? this.props.location.state.didClickNav
          : false,
      currentPage: parseInt(location.hash.substr(2), 10)
    };
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    maxPage: PropTypes.number.isRequired,
    input: PropTypes.shape({
      complainantName: PropTypes.string.isRequired,
      complainantAddress: PropTypes.string.isRequired,
      complainantConsumerRelationship: PropTypes.string.isRequired,
      complainantPhone: PropTypes.string.isRequired
    }).isRequired
  }

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  setRequiredErrors = () => {
    const requiredErrors = this.state.sectionRequiredErrors.slice();
    const areRequiredInputsValid = validateRequiredInput(
      this.props.input,
      REQUIRED_FIELDS
    );

    if (areRequiredInputsValid) {
      if (requiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED) !== -1) {
        requiredErrors.splice(requiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED));
      }
    }
    else if (requiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED) === -1) {
      requiredErrors.push(FORM_ERRORS.IS_REQUIRED);
    }

    this.setState({
      sectionRequiredErrors: requiredErrors
    });
  }

  handlePageChange = (path) => {
    this.setDidClickNav();

    Promise.resolve(this.setRequiredErrors())
    .then(() => {
      if (this.state.sectionRequiredErrors.length < 1 && this.state.sectionFormatErrors.length < 1) {
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

  renderErrors = () => {
    const formatErrors = this.state.sectionFormatErrors.map((error) => {
      return <ErrorMessage key={error}>{error}</ErrorMessage>;
    });
    let requiredErrors = [];
    if (this.state.didClickNav) {
      requiredErrors = this.state.sectionRequiredErrors.map((error) => {
        return <ErrorMessage key={error}>{error}</ErrorMessage>;
      });
    }

    return (
      <div>
        {formatErrors}
        {requiredErrors}
      </div>
    );
  }

  componentWillUnmount() {
    const areRequiredInputsValid = validateRequiredInput(
      this.props.input,
      REQUIRED_FIELDS
    );
    if (
      !areRequiredInputsValid
      && this.props.maxPage
      && this.state.currentPage !== this.props.maxPage
    ) {
      this.props.history.push({
        pathname: `/${this.state.currentPage}`,
        state: { didClickNav: true }
      });
    }
  }

  render() {
    const {
      section,
      handleTextInput,
      input,
      isInReview
    } = this.props;

    const {
      complainantNameValid,
      didClickNav,
      sectionFormatErrors
    } = this.state;

    return (
      <div>
        { !isInReview() ? <SectionHeader>Complainant</SectionHeader> : null}

        <PaddedRow>
          <Col lg={12}>
            <FormGroup
                validationState={bootstrapValidation(
                  input.complainantName,
                  complainantNameValid,
                  true,
                  didClickNav
                  )}>
              <TitleLabel>28. Complainant Name (Last, First, MI)*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="complainantName"
                  value={input.complainantName}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>Residence / Address (Street, Apt Number, City, County, State, Zip)</TitleLabel>
            <FormControl
                data-section={section}
                name="complainantAddress"
                value={input.complainantAddress}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>
        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>Relationship to Consumer</TitleLabel>
            <FormControl
                data-section={section}
                name="complainantConsumerRelationship"
                value={input.complainantConsumerRelationship}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
          <Col lg={6}>
            <TitleLabel>Phone Number</TitleLabel>
            <FormControl
                data-section={section}
                name="complainantPhone"
                value={input.complainantPhone}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        {
          !isInReview()
            ? <FormNav
                prevPath={FORM_PATHS.CONSUMER}
                nextPath={FORM_PATHS.DISPOSITION}
                handlePageChange={this.handlePageChange}
                setDidClickNav={this.setDidClickNav} />
            : null
        }
        { this.renderErrors() }
      </div>
    );
  }
}

export default withRouter(ComplainantInfoView);
