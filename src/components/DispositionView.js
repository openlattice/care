/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';

import FormNav from './FormNav';
import {
  PaddedRow,
  TitleLabel,
  OtherWrapper,
  InlineCheckbox,
  InlineRadio,
  SectionHeader,
  ErrorMessage
} from '../shared/Layout';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';
import { bootstrapValidation, validateRequiredInput } from '../shared/Validation';

const REQUIRED_FIELDS = ['disposition', 'incidentNarrative'];


class DispositionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      dispositionValid: true,
      incidentNarrativeValid: true,
      sectionValid: false,
      didClickNav: false
    };
  }

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
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

  setDidClickNav = () => {
    this.setState({ didClickNav: true });
  }

  handlePageChange = (path) => {
    this.setState({ didClickNav: true });
    validateRequiredInput(this, REQUIRED_FIELDS, () => {
      if (this.state.sectionValid) {
        this.props.handlePageChange(path);
      }
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

  render() {
    const {
      section,
      handleTextInput,
      handleCheckboxChange,
      handleSingleSelection,
      input,
      isInReview,
      handlePageChange
    } = this.props;

    return (
      <div>
        { !isInReview() ? <SectionHeader>Disposition</SectionHeader> : null}

        <PaddedRow>
          <Col lg={12}>
            <TitleLabel>29. Disposition*</TitleLabel>
            <FormGroup validationState={bootstrapValidation(this, 'disposition', true)}>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="arrest"
                  checked={input.disposition.indexOf('arrest') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Arrest</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="ep"
                  checked={input.disposition.indexOf('ep') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>EP</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="voluntaryER"
                  checked={input.disposition.indexOf('voluntaryER') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Voluntary ER Intake</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="bcri"
                  checked={input.disposition.indexOf('bcri') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>BCRI</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="infoAndReferral"
                  checked={input.disposition.indexOf('infoAndReferral') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Information and Referral</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="lead"
                  checked={input.disposition.indexOf('lead') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>LEAD</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="contactedTreatementProvider"
                  checked={input.disposition.indexOf('contactedTreatementProvider') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Contacted or Referred to Current Treatment Provider</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="criminalCitation"
                  checked={input.disposition.indexOf('criminalCitation') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Criminal Citation</InlineCheckbox>
              <InlineCheckbox
                  inline
                  data-section={section}
                  name="disposition"
                  value="civilCitation"
                  checked={input.disposition.indexOf('civilCitation') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Civil Citation</InlineCheckbox>
            </FormGroup>
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
                disabled={isInReview()}>Yes</InlineRadio>
            <InlineRadio
                inline
                data-section={section}
                name="hospitalTransport"
                value={false}
                checked={!input.hospitalTransport}
                onChange={handleSingleSelection}
                disabled={isInReview()}>No</InlineRadio>
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
                  handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                }}
                disabled={isInReview()} />
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
                  disabled={isInReview()}>Verbalization</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="deescalationTechniques"
                  value="handcuffs"
                  checked={input.deescalationTechniques.indexOf('handcuffs') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Handcuffs</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="deescalationTechniques"
                  value="legRestraints"
                  checked={input.deescalationTechniques.indexOf('legRestraints') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Leg Restraints</InlineCheckbox>
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
                  disabled={isInReview()}>Arrest Control (Hands / Feet)</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="deescalationTechniques"
                  value="n/a"
                  checked={input.deescalationTechniques.indexOf('n/a') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>N/A</InlineCheckbox>
              <OtherWrapper>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="other"
                    checked={input.deescalationTechniques.indexOf('other') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isInReview()}>Other:</InlineCheckbox>
                <FormControl
                    data-section={section}
                    name="deescalationTechniquesOther"
                    value={input.deescalationTechniquesOther}
                    onChange={(e) => {
                      handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                    }}
                    disabled={isInReview()} />
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
                  disabled={isInReview()}>BCRI / Mobile Crisis Response Team</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="specializedResourcesCalled"
                  value="citOfficer"
                  checked={input.specializedResourcesCalled.indexOf('citOfficer') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>CIT Officer</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="specializedResourcesCalled"
                  value="crtUnit"
                  checked={input.specializedResourcesCalled.indexOf('crtUnit') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>CRT Unit</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="specializedResourcesCalled"
                  value="esu"
                  checked={input.specializedResourcesCalled.indexOf('esu') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>ESU</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="specializedResourcesCalled"
                  value="swat"
                  checked={input.specializedResourcesCalled.indexOf('swat') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>SWAT</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="specializedResourcesCalled"
                  value="negotiationTeam"
                  checked={input.specializedResourcesCalled.indexOf('negotiationTeam') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Negotiation Team</InlineCheckbox>
              <InlineCheckbox
                  data-section={section}
                  inline
                  name="specializedResourcesCalled"
                  value="homelessOutreach"
                  checked={input.specializedResourcesCalled.indexOf('homelessOutreach') !== -1}
                  onChange={handleCheckboxChange}
                  disabled={isInReview()}>Homeless Outreach</InlineCheckbox>
            </FormGroup>
          </Col>
        </PaddedRow>

        <PaddedRow>
          <Col lg={12}>
            <FormGroup validationState={bootstrapValidation(this, 'incidentNarrative', true)}>
              <TitleLabel>
                {
                  `32. Narrative of Incident, to include: Results of investigation, basis for 
                  actions taken, emotional states, additional witnesses. Property listing.*`
                }
              </TitleLabel>
              <FormControl
                  data-section={section}
                  name="incidentNarrative"
                  componentClass="textarea"
                  value={input.incidentNarrative}
                  onChange={(e) => {
                    handleTextInput(e, this, 'string', REQUIRED_FIELDS);
                  }}
                  disabled={isInReview()} />
            </FormGroup>
          </Col>
        </PaddedRow>

        {
          !isInReview()
          ? <FormNav
              prevPath={FORM_PATHS.COMPLAINANT}
              nextPath={FORM_PATHS.OFFICER}
              handlePageChange={this.handlePageChange}
              setDidClickNav={this.setDidClickNav} />
          : null
        }
        { this.renderErrors() }
      </div>
    );
  }
}

export default DispositionView;
