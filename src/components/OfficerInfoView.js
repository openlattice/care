/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col, FormGroup } from 'react-bootstrap';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, InlineCheckbox, SectionHeader, ErrorMessage } from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateRequiredInput } from '../shared/Validation';

const REQUIRED_FIELDS = ['officerName'];


class OfficerInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      officerNameValid: true,
      officerSeqIDValid: true,
      sectionValid: false,
      didClickNav: this.props.location.state
        ? this.props.location.state.didClickNav
        : false,
      currentPage: parseInt(location.hash.substr(2), 10)
    };
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    maxPage: PropTypes.number.isRequired,
    input: PropTypes.shape({
      officerName: PropTypes.string.isRequired,
      officerSeqID: PropTypes.string.isRequired,
      officerInjuries: PropTypes.string.isRequired,
      officerCertification: PropTypes.array.isRequired
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
      handleCheckboxChange,
      input,
      isInReview
    } = this.props;

    const {
      officerNameValid,
      officerSeqIDValid,
      didClickNav,
      sectionFormatErrors
    } = this.state;

    return (
      <div>
        { !isInReview() ? <SectionHeader>Officer</SectionHeader> : null }

        <PaddedRow>
          <Col lg={12}>
            <FormGroup
                validationState={bootstrapValidation(
                  input.officerName,
                  officerNameValid,
                  true,
                  didClickNav
                )}>
              <TitleLabel>33. Officer Name*</TitleLabel>
              <FormControl
                  data-section={section}
                  name="officerName"
                  value={input.officerName}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <FormGroup
                validationState={bootstrapValidation(
                  input.officerSeqID,
                  officerSeqIDValid,
                  false,
                  didClickNav)}>
              <TitleLabel>34. Seq ID</TitleLabel>
              <FormControl
                  data-section={section}
                  name="officerSeqID"
                  value={input.officerSeqID}
                  onChange={(e) => {
                    handleTextInput(e, 'number', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
          <Col lg={6}>
            <TitleLabel>35. Officer Injuries</TitleLabel>
            <FormControl
                data-section={section}
                name="officerInjuries"
                value={input.officerInjuries}
                onChange={(e) => {
                  handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                }}
                disabled={isInReview()} />
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={6}>
            <TitleLabel>36. Officer Certification</TitleLabel>
            <FormGroup>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="officerCertification"
                  value="crtUnit"
                  checked={input.officerCertification.indexOf('crtUnit') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>CRT Unit</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="officerCertification"
                  value="best"
                  checked={input.officerCertification.indexOf('best') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>BEST</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="officerCertification"
                  value="cit"
                  checked={input.officerCertification.indexOf('cit') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>CIT</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="officerCertification"
                  value="n/a"
                  checked={input.officerCertification.indexOf('n/a') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>N/A</InlineCheckbox>
            </FormGroup>
          </Col>
        </PaddedRow>

        {
          !isInReview()
            ? <FormNav
                prevPath={FORM_PATHS.DISPOSITION}
                nextPath={FORM_PATHS.REVIEW}
                handlePageChange={this.handlePageChange}
                setDidClickNav={this.setDidClickNav} />
            : null
        }
        { this.renderErrors() }
      </div>
    );
  }
}

export default withRouter(OfficerInfoView);
