import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';
import ReactRouterPropTypes from 'react-router-prop-types';

import FormNav from './FormNav';
import {
  SectionWrapper,
  ContentWrapper,
  PaddedRow,
  TitleLabel,
  OtherWrapper,
  InlineCheckbox,
  InlineRadio,
  SectionHeader
} from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import {
  setDidClickNav,
  setRequiredErrors,
  renderErrors,
  validateSectionNavigation
} from '../shared/Helpers';
import { bootstrapValidation } from '../shared/Validation';


class DispositionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredFields: [],
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      sectionValid: false,
      didClickNav: this.props.location.state
        ? this.props.location.state.didClickNav
        : false,
      currentPage: parseInt(location.hash.substr(2), 10)
    };
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    input: PropTypes.shape({
      disposition: PropTypes.array.isRequired,
      hospitalTransport: PropTypes.bool.isRequired,
      hospital: PropTypes.string.isRequired,
      deescalationTechniques: PropTypes.array.isRequired,
      deescalationTechniquesOther: PropTypes.string.isRequired,
      specializedResourcesCalled: PropTypes.array.isRequired,
      incidentNarrative: PropTypes.string.isRequired
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
      handleSingleSelection,
      input,
      isInReview
    } = this.props;

    const {
      didClickNav,
      sectionFormatErrors,
      sectionRequiredErrors
    } = this.state;

    const isReviewPage = isInReview();

    return (
      <SectionWrapper>
        { !isReviewPage ? <SectionHeader>Disposition</SectionHeader> : null}
        <ContentWrapper>
          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>29. Disposition</TitleLabel>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="arrest"
                  checked={input.disposition.indexOf('arrest') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>Arrest</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="ep"
                  checked={input.disposition.indexOf('ep') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>EP</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="voluntaryER"
                  checked={input.disposition.indexOf('voluntaryER') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>Voluntary ER Intake</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="bcri"
                  checked={input.disposition.indexOf('bcri') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>BCRI</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="infoAndReferral"
                  checked={input.disposition.indexOf('infoAndReferral') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>Information and Referral</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="lead"
                  checked={input.disposition.indexOf('lead') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>LEAD</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="contactedTreatementProvider"
                  checked={input.disposition.indexOf('contactedTreatementProvider') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>Contacted or Referred to Current Treatment Provider</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="criminalCitation"
                  checked={input.disposition.indexOf('criminalCitation') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>Criminal Citation</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="civilCitation"
                  checked={input.disposition.indexOf('civilCitation') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isReviewPage}>Civil Citation</InlineCheckbox>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Transported to Hospital</TitleLabel>
              <InlineRadio
                  inline
                  data-section={section}
                  name="hospitalTransport"
                  value
                  checked={input.hospitalTransport}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>Yes</InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="hospitalTransport"
                  value={false}
                  checked={!input.hospitalTransport}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>No</InlineRadio>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={6}>
              <TitleLabel>Hospital Name</TitleLabel>
              <FormControl
                  data-section={section}
                  name="hospital"
                  value={input.hospital}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>30. De-escalation Techniques/Equipment Used</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="verbalization"
                    checked={input.deescalationTechniques.indexOf('verbalization') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>Verbalization</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="handcuffs"
                    checked={input.deescalationTechniques.indexOf('handcuffs') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>Handcuffs</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="legRestraints"
                    checked={input.deescalationTechniques.indexOf('legRestraints') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>Leg Restraints</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="taser"
                    checked={input.deescalationTechniques.indexOf('taser') !== -1}
                    onChange={handleCheckboxChange}>Taser</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="arrestControl"
                    checked={input.deescalationTechniques.indexOf('arrestControl') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>Arrest Control (Hands / Feet)</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="n/a"
                    checked={input.deescalationTechniques.indexOf('n/a') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>N/A</InlineCheckbox>
                <OtherWrapper>
                  <InlineCheckbox
                      data-section={section}
                      inline
                      name="deescalationTechniques"
                      value="other"
                      checked={input.deescalationTechniques.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>Other:</InlineCheckbox>
                  <FormControl
                      data-section={section}
                      name="deescalationTechniquesOther"
                      value={input.deescalationTechniquesOther}
                      onChange={(e) => {
                        handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                      }}
                      disabled={isReviewPage} />
                </OtherWrapper>
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>31. Called for Specialized Resources</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="bcri"
                    checked={input.specializedResourcesCalled.indexOf('bcri') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>BCRI / Mobile Crisis Response Team</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="citOfficer"
                    checked={input.specializedResourcesCalled.indexOf('citOfficer') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>CIT Officer</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="crtUnit"
                    checked={input.specializedResourcesCalled.indexOf('crtUnit') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>CRT Unit</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="esu"
                    checked={input.specializedResourcesCalled.indexOf('esu') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>ESU</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="swat"
                    checked={input.specializedResourcesCalled.indexOf('swat') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>SWAT</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="negotiationTeam"
                    checked={input.specializedResourcesCalled.indexOf('negotiationTeam') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>Negotiation Team</InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="specializedResourcesCalled"
                    value="homelessOutreach"
                    checked={input.specializedResourcesCalled.indexOf('homelessOutreach') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>Homeless Outreach</InlineCheckbox>
              </FormGroup>
            </Col>
          </PaddedRow>

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>
                {
                  `32. Narrative of Incident, to include: Results of investigation, basis for
                  actions taken, emotional states, additional witnesses. Property listing.`
                }
              </TitleLabel>
              <FormControl
                  data-section={section}
                  name="incidentNarrative"
                  componentClass="textarea"
                  value={input.incidentNarrative}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          </PaddedRow>
        </ContentWrapper>

        {
          !isReviewPage
            ? (
              <FormNav
                  prevPath={FORM_PATHS.COMPLAINANT}
                  nextPath={FORM_PATHS.OFFICER}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
        { renderErrors(sectionFormatErrors, sectionRequiredErrors, didClickNav) }
      </SectionWrapper>
    );
  }
}

export default withRouter(DispositionView);
