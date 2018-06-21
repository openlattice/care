import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
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
import { isPortlandUser } from '../utils/Whitelist';

class DispositionView extends React.Component {

  static propTypes = {
    handleTextInput: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    hospitals: PropTypes.instanceOf(Immutable.List).isRequired,
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

  constructor(props) {
    super(props);

    this.state = {
      requiredFields: [],
      sectionFormatErrors: [],
      sectionRequiredErrors: [FORM_ERRORS.IS_REQUIRED],
      didClickNav: this.props.location.state
        ? this.props.location.state.didClickNav
        : false,
      currentPage: parseInt(location.hash.substr(2), 10)
    };
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

  renderHospitalsSelect = () => {

    const {
      section,
      handleSingleSelection,
      handleTextInput,
      hospitals,
      input,
      isInReview
    } = this.props;

    const { sectionFormatErrors } = this.state;
    const isReviewPage = isInReview();

    if (hospitals.isEmpty()) {
      return (
        <FormControl
            data-section={section}
            name="hospital"
            value={input.hospital}
            onChange={(e) => {
              handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
            }}
            disabled={isReviewPage} />
      );
    }

    const hospitalOptions = hospitals.map((hospital) => {
      // TODO: this is ugly, we can do better
      const hospitalId = hospital.getIn(['general.stringid', 0], '');
      const hospitalName = hospital.getIn(['health.hospitalname', 0], '');
      return (
        <option key={`${hospitalId}_${hospitalName}`} value={hospitalName}>{hospitalName}</option>
      );
    });

    return (
      <FormControl
          componentClass="select"
          placeholder="select"
          data-section={section}
          name="hospital"
          value={input.hospital}
          onChange={handleSingleSelection}
          disabled={isReviewPage}>
        <option value="">Select</option>
        { hospitalOptions }
      </FormControl>
    );
  }

  renderDisposition = () => {

    const {
      section,
      handleCheckboxChange,
      input,
      isInReview
    } = this.props;

    const isReviewPage = isInReview();

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Disposition</TitleLabel>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="arrest"
              checked={input.disposition.indexOf('arrest') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Arrest
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="ep"
              checked={input.disposition.indexOf('ep') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            EP
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="voluntaryER"
              checked={input.disposition.indexOf('voluntaryER') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Voluntary ER Intake
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="bcri"
              checked={input.disposition.indexOf('bcri') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            BCRI
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="infoAndReferral"
              checked={input.disposition.indexOf('infoAndReferral') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Information and Referral
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="lead"
              checked={input.disposition.indexOf('lead') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            LEAD
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="contactedTreatementProvider"
              checked={input.disposition.indexOf('contactedTreatementProvider') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Contacted or Referred to Current Treatment Provider
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="criminalCitation"
              checked={input.disposition.indexOf('criminalCitation') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Criminal Citation
          </InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name="disposition"
              value="civilCitation"
              checked={input.disposition.indexOf('civilCitation') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Civil Citation
          </InlineCheckbox>
        </Col>
      </PaddedRow>
    );
  }

  renderDispositionPortland = () => {

    const {
      section,
      handleCheckboxChange,
      input,
      isInReview
    } = this.props;

    const isReviewPage = isInReview();

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Disposition</TitleLabel>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="referredToBHU"
              checked={input.disposition.indexOf('referredToBHU') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Referred to BHU
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="referredToCrisis"
              checked={input.disposition.indexOf('referredToCrisis') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Referred to Crisis
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="arrest"
              checked={input.disposition.indexOf('arrest') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Arrest
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="divertedFromArrest"
              checked={input.disposition.indexOf('divertedFromArrest') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Diverted from Arrest
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="voluntarilyTransportedToHospitalByPolice"
              checked={input.disposition.indexOf('voluntarilyTransportedToHospitalByPolice') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Voluntarily Transported to Hospital by Police
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="involuntarilyTransportedToHospitalByPolice"
              checked={input.disposition.indexOf('involuntarilyTransportedToHospitalByPolice') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Involuntarily Transported to Hospital by Police
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="voluntarilyTransportedToHospitalByMedcu"
              checked={input.disposition.indexOf('voluntarilyTransportedToHospitalByMedcu') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Voluntarily Transported to Hospital by Medcu
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="involuntarilyTransportedToHospitalByMedcu"
              checked={input.disposition.indexOf('involuntarilyTransportedToHospitalByMedcu') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Involuntarily Transported to Hospital by Medcu
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="stabilizedOnSceneWithFollowUpReferral"
              checked={input.disposition.indexOf('stabilizedOnSceneWithFollowUpReferral') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Stabilized on scene with Follow-Up Referral
          </InlineCheckbox>
          <InlineCheckbox
              inline={false}
              data-section={section}
              name="disposition"
              value="resistedOrRefusedSupports"
              checked={input.disposition.indexOf('resistedOrRefusedSupports') !== -1}
              onChange={handleCheckboxChange}
              disabled={isReviewPage}>
            Resisted or Refused Supports
          </InlineCheckbox>
        </Col>
      </PaddedRow>
    );
  }

  renderSpecializedResources = () => {

    const {
      section,
      handleCheckboxChange,
      input,
      isInReview
    } = this.props;

    const isReviewPage = isInReview();

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Called for Specialized Resources</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="bcri"
                checked={input.specializedResourcesCalled.indexOf('bcri') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              BCRI / Mobile Crisis Response Team
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="citOfficer"
                checked={input.specializedResourcesCalled.indexOf('citOfficer') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              CIT Officer
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="crtUnit"
                checked={input.specializedResourcesCalled.indexOf('crtUnit') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              CRT Unit
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="esu"
                checked={input.specializedResourcesCalled.indexOf('esu') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              ESU
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="swat"
                checked={input.specializedResourcesCalled.indexOf('swat') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              SWAT
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="negotiationTeam"
                checked={input.specializedResourcesCalled.indexOf('negotiationTeam') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Negotiation Team
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="homelessOutreach"
                checked={input.specializedResourcesCalled.indexOf('homelessOutreach') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Homeless Outreach
            </InlineCheckbox>
          </FormGroup>
        </Col>
      </PaddedRow>
    );
  }

  renderSpecializedResourcesPortland = () => {

    const {
      section,
      handleCheckboxChange,
      input,
      isInReview
    } = this.props;

    const isReviewPage = isInReview();

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Called for Specialized Resources</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="BehavioralHealthUnit"
                checked={input.specializedResourcesCalled.indexOf('BehavioralHealthUnit') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Behavioral Health Unit (BHU)
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="CrisisTeam"
                checked={input.specializedResourcesCalled.indexOf('CrisisTeam') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Crisis Team
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="voluntaryTransport"
                checked={input.specializedResourcesCalled.indexOf('voluntaryTransport') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Voluntary Transport
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline
                name="specializedResourcesCalled"
                value="involuntaryTransport"
                checked={input.specializedResourcesCalled.indexOf('involuntaryTransport') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Involuntary Transport
            </InlineCheckbox>
          </FormGroup>
        </Col>
      </PaddedRow>
    );
  }

  renderTransportedToHospital = () => {

    const {
      section,
      handleSingleSelection,
      input,
      isInReview
    } = this.props;

    const isReviewPage = isInReview();

    return (
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
              disabled={isReviewPage}>
            Yes
          </InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name="hospitalTransport"
              value={false}
              checked={!input.hospitalTransport}
              onChange={handleSingleSelection}
              disabled={isReviewPage}>
            No
          </InlineRadio>
        </Col>
      </PaddedRow>
    );
  }

  renderHospitalName = () => {

    return (
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>Hospital Name</TitleLabel>
          { this.renderHospitalsSelect() }
        </Col>
      </PaddedRow>
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
      didClickNav,
      sectionFormatErrors,
      sectionRequiredErrors
    } = this.state;

    const isReviewPage = isInReview();

    return (
      <SectionWrapper>
        { !isReviewPage ? <SectionHeader>Disposition</SectionHeader> : null}
        <ContentWrapper>

          {
            isPortlandUser()
              ? this.renderDispositionPortland()
              : this.renderDisposition()
          }

          {
            isPortlandUser()
              ? null
              : this.renderTransportedToHospital()
          }

          {
            isPortlandUser()
              ? null
              : this.renderHospitalName()
          }

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>De-escalation Techniques/Equipment Used</TitleLabel>
              <FormGroup>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="verbalization"
                    checked={input.deescalationTechniques.indexOf('verbalization') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Verbalization
                </InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="handcuffs"
                    checked={input.deescalationTechniques.indexOf('handcuffs') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Handcuffs
                </InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="legRestraints"
                    checked={input.deescalationTechniques.indexOf('legRestraints') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Leg Restraints
                </InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="taser"
                    checked={input.deescalationTechniques.indexOf('taser') !== -1}
                    onChange={handleCheckboxChange}>
                  Taser
                </InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="arrestControl"
                    checked={input.deescalationTechniques.indexOf('arrestControl') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  Arrest Control (Hands / Feet)
                </InlineCheckbox>
                <InlineCheckbox
                    data-section={section}
                    inline
                    name="deescalationTechniques"
                    value="n/a"
                    checked={input.deescalationTechniques.indexOf('n/a') !== -1}
                    onChange={handleCheckboxChange}
                    disabled={isReviewPage}>
                  N/A
                </InlineCheckbox>
                <OtherWrapper>
                  <InlineCheckbox
                      data-section={section}
                      inline
                      name="deescalationTechniques"
                      value="other"
                      checked={input.deescalationTechniques.indexOf('other') !== -1}
                      onChange={handleCheckboxChange}
                      disabled={isReviewPage}>
                    Other:
                  </InlineCheckbox>
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

          {
            isPortlandUser()
              ? this.renderSpecializedResourcesPortland()
              : this.renderSpecializedResources()
          }

          <PaddedRow>
            <Col lg={12}>
              <TitleLabel>
                {
                  `Narrative of Incident, to include: Results of investigation, basis for
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

function mapStateToProps(state) {

  return {
    hospitals: state.get('hospitals')
  };
}

export default withRouter(
  connect(mapStateToProps)(DispositionView)
);
