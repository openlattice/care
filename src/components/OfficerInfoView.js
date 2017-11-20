import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col, FormGroup } from 'react-bootstrap';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormNav from './FormNav';
import {
  PaddedRow,
  TitleLabel,
  InlineCheckbox,
  SectionHeader,
  SectionWrapper,
  ContentWrapper
} from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import {
  setDidClickNav,
  setRequiredErrors,
  renderErrors,
  validateSectionNavigation
} from '../shared/Helpers';
import { bootstrapValidation } from '../shared/Validation';


class OfficerInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredFields: ['officerName'],
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
    input: PropTypes.shape({
      officerName: PropTypes.string.isRequired,
      officerSeqID: PropTypes.string.isRequired,
      officerInjuries: PropTypes.string.isRequired,
      officerCertification: PropTypes.array.isRequired
    }).isRequired
  }

  handlePageChange = (path) => {
    this.setState(setDidClickNav);
    this.setState(setRequiredErrors, () => {
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

  componentWillUnmount() {
    validateSectionNavigation(
      this.props.input,
      this.state.requiredFields,
      this.state.currentPage,
      this.props.history
    );
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
      sectionFormatErrors,
      sectionRequiredErrors
    } = this.state;

    return (
      <SectionWrapper>
        { !isInReview() ? <SectionHeader>Officer</SectionHeader> : null }

        <ContentWrapper>
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
                    true,
                    didClickNav
                  )}>
                <TitleLabel>34. Seq ID</TitleLabel>
                <FormControl
                    data-section={section}
                    name="officerSeqID"
                    value={input.officerSeqID}
                    onChange={(e) => {
                      handleTextInput(e, 'alphanumeric', sectionFormatErrors, this.setInputErrors);
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
        </ContentWrapper>

        {
          !isInReview()
            ? (
              <FormNav
                  prevPath={FORM_PATHS.DISPOSITION}
                  nextPath={FORM_PATHS.REVIEW}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
        { renderErrors(sectionFormatErrors, sectionRequiredErrors, didClickNav) }
      </SectionWrapper>
    );
  }
}

export default withRouter(OfficerInfoView);
