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
import { isPortlandOrg } from '../utils/Whitelist';

class DispositionView extends React.Component {

  static propTypes = {
    handleCheckboxChange: PropTypes.func.isRequired,
    handleMultiUpdate: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handleScaleSelection: PropTypes.func.isRequired,
    handleSingleSelection: PropTypes.func.isRequired,
    handleTextInput: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    isInReview: PropTypes.func.isRequired,
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
    }).isRequired,
    selectedOrganizationId: PropTypes.string.isRequired
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

  renderDeescalationScalePortland = () => {

    const {
      handleScaleSelection,
      input,
      isInReview,
      section
    } = this.props;

    const isReviewPage = isInReview();

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      scaleRadios.push(
        <InlineRadio
            key={`deescalationscale-${i}`}
            inline
            data-section={section}
            name="deescalationscale"
            value={i}
            checked={input.deescalationscale === i}
            onChange={handleScaleSelection}
            disabled={isReviewPage}>
          { i }
        </InlineRadio>
      );
    }

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Incident De-escalation Scale (1-10)</TitleLabel>
          <h5>1 = Calm , 10 = Still escalated</h5>
          { scaleRadios }
        </Col>
      </PaddedRow>
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

  renderStabilizedOnScene = () => {

    const {
      handleMultiUpdate,
      handleTextInput,
      input,
      isInReview,
      section
    } = this.props;

    const { sectionFormatErrors } = this.state;

    const isReviewPage = isInReview();

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Stabilized on scene with Follow-Up Referral</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name="stabilizedindicator"
              checked={input.stabilizedindicator}
              onChange={() => {
                handleMultiUpdate(section, {
                  // set to true
                  stabilizedindicator: true,
                  // set default values
                  referraldestination: '',
                  referralprovidedindicator: true
                });
              }}
              disabled={isReviewPage}>
            Yes
          </InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name="stabilizedindicator"
              checked={!input.stabilizedindicator}
              onChange={() => {
                handleMultiUpdate(section, {
                  // set to false
                  stabilizedindicator: false,
                  // clear values
                  referraldestination: '',
                  referralprovidedindicator: false
                });
              }}
              disabled={isReviewPage}>
            No
          </InlineRadio>
        </Col>
        {
          input.stabilizedindicator && (
            <Col lg={12}>
              <TitleLabel>Referral information</TitleLabel>
              <FormControl
                  data-section={section}
                  name="referraldestination"
                  value={input.referraldestination}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          )
        }
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

  renderTransportedToHospitalPortland = () => {

    const {
      handleMultiUpdate,
      handleSingleSelection,
      handleTextInput,
      input,
      isInReview,
      section
    } = this.props;
    const { sectionFormatErrors } = this.state;

    const isReviewPage = isInReview();

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Transported to Hospital</TitleLabel>
          <InlineRadio
              inline
              data-section={section}
              name="hospitaltransportindicator"
              checked={input.hospitaltransportindicator}
              onChange={() => {
                handleMultiUpdate(section, {
                  // set to true
                  hospitaltransportindicator: true,
                  // set default values
                  hospitalname: '',
                  transportingagency: 'police',
                  voluntaryactionindicator: true
                });
              }}
              disabled={isReviewPage}>
            Yes
          </InlineRadio>
          <InlineRadio
              inline
              data-section={section}
              name="hospitaltransportindicator"
              checked={!input.hospitaltransportindicator}
              onChange={() => {
                handleMultiUpdate(section, {
                  // set to true
                  hospitaltransportindicator: false,
                  // clear values
                  hospitalname: '',
                  transportingagency: '',
                  voluntaryactionindicator: null
                });
              }}
              disabled={isReviewPage}>
            No
          </InlineRadio>
        </Col>
        {
          input.hospitaltransportindicator && (
            <Col lg={12}>
              <InlineRadio
                  inline
                  data-section={section}
                  name="voluntaryactionindicator"
                  value
                  checked={input.voluntaryactionindicator}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Voluntary
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="voluntaryactionindicator"
                  value={false}
                  checked={!input.voluntaryactionindicator}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Involuntary
              </InlineRadio>
            </Col>
          )
        }
        {
          input.hospitaltransportindicator && (
            <Col lg={12}>
              <InlineRadio
                  inline
                  data-section={section}
                  name="transportingagency"
                  value="police"
                  checked={input.transportingagency === 'police'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Police
              </InlineRadio>
              <InlineRadio
                  inline
                  data-section={section}
                  name="transportingagency"
                  value="medcu"
                  checked={input.transportingagency === 'medcu'}
                  onChange={handleSingleSelection}
                  disabled={isReviewPage}>
                Medcu
              </InlineRadio>
            </Col>
          )
        }
        {
          input.hospitaltransportindicator && (
            <Col lg={12}>
              <TitleLabel>Hospital name</TitleLabel>
              <FormControl
                  data-section={section}
                  name="hospitalname"
                  value={input.hospitalname}
                  onChange={(e) => {
                    handleTextInput(e, 'string', sectionFormatErrors, this.setInputErrors);
                  }}
                  disabled={isReviewPage} />
            </Col>
          )
        }
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
          <TitleLabel>Hospital name</TitleLabel>
          { this.renderHospitalsSelect() }
        </Col>
      </PaddedRow>
    );
  }

  renderDeescalationTechniques = () => {

    const {
      section,
      handleTextInput,
      handleCheckboxChange,
      input,
      isInReview,
      selectedOrganizationId
    } = this.props;
    const { sectionFormatErrors } = this.state;
    const isReviewPage = isInReview();

    const titleValue = isPortlandOrg(selectedOrganizationId)
      ? 'Use of Force / Equipment Used'
      : 'De-escalation Techniques / Equipment Used';

    return (
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>{ titleValue }</TitleLabel>
          <FormGroup>
            <InlineCheckbox
                data-section={section}
                inline={false}
                name="deescalationTechniques"
                value="verbalization"
                checked={input.deescalationTechniques.indexOf('verbalization') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Verbalization
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline={false}
                name="deescalationTechniques"
                value="handcuffs"
                checked={input.deescalationTechniques.indexOf('handcuffs') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Handcuffs
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline={false}
                name="deescalationTechniques"
                value="legRestraints"
                checked={input.deescalationTechniques.indexOf('legRestraints') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Leg Restraints
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline={false}
                name="deescalationTechniques"
                value="taser"
                checked={input.deescalationTechniques.indexOf('taser') !== -1}
                onChange={handleCheckboxChange}>
              Taser
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline={false}
                name="deescalationTechniques"
                value="arrestControl"
                checked={input.deescalationTechniques.indexOf('arrestControl') !== -1}
                onChange={handleCheckboxChange}
                disabled={isReviewPage}>
              Arrest Control (Hands / Feet)
            </InlineCheckbox>
            <InlineCheckbox
                data-section={section}
                inline={false}
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
                  inline={false}
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
    );
  }

  render() {

    const {
      section,
      handleTextInput,
      input,
      isInReview,
      selectedOrganizationId
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
            isPortlandOrg(selectedOrganizationId)
              ? this.renderDispositionPortland()
              : this.renderDisposition()
          }

          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderStabilizedOnScene()
              : null
          }

          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderTransportedToHospitalPortland()
              : this.renderTransportedToHospital()
          }

          {
            isPortlandOrg(selectedOrganizationId)
              ? null
              : this.renderHospitalName()
          }

          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderDeescalationScalePortland()
              : null
          }

          {
            this.renderDeescalationTechniques()
          }

          {
            isPortlandOrg(selectedOrganizationId)
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
