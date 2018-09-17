import React from 'react';

import isInteger from 'lodash/isInteger';
import parseInt from 'lodash/parseInt';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import FormNav from './FormNav';
import FieldHeader from './text/styled/FieldHeader';
import TextAreaField from './text/TextAreaField';
import TextField from './text/TextField';
import {
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';
import { FORM_PATHS } from '../shared/Consts';
import { isPortlandOrg } from '../utils/Whitelist';

const incidentNarrativeTitle = `Narrative of Incident, to include: Results of investigation, basis for actions taken,
emotional states, additional witnesses. Property listing.`;

class DispositionView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      section: 'dispositionInfo',
    };
  }

  handlePageChange = (path) => {

    // TODO: validation
    const { handlePageChange } = this.props;
    handlePageChange(path);
  }

  handleOnChange = (event) => {

    // TODO: validation
    const { updateStateValue } = this.props;
    const { section } = this.state;
    const { name, value } = event.target;
    updateStateValue(section, name, value);
  }

  handleOnChangeScaleSelection = (event) => {

    const { updateStateValue } = this.props;
    const { section } = this.state;
    const { name, value } = event.target;

    const valueAsInt = parseInt(value);
    if (isInteger(valueAsInt) && `${valueAsInt}` === value) {
      updateStateValue(section, name, valueAsInt);
    }
    else {
      updateStateValue(section, name, value);
    }
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempCheckbox = (label, name, value, isChecked) => {

    const { handleCheckboxChange, isInReview } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview}
            id={id}
            name={name}
            onChange={handleCheckboxChange}
            type="checkbox"
            value={value} />
        { label }
      </label>
    );
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked, onChange) => {

    const { isInReview } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isInReview}
            id={id}
            name={name}
            onChange={onChange || this.handleOnChange}
            type="radio"
            value={value} />
        { label }
      </label>
    );
  }

  renderHospitalsSelect = () => {

    const { hospitals, input, isInReview } = this.props;
    const { section } = this.state;

    if (hospitals.isEmpty()) {
      return (
        <TextField
            disabled={isInReview}
            name="hospital"
            onChange={this.handleOnChange} />
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
      <select
          data-section={section}
          disabled={isInReview}
          name="hospital"
          onChange={this.handleOnChange}
          value={input.hospital}>
        <option value="">Select</option>
        { hospitalOptions }
      </select>
    );
  }

  renderDeescalationScalePortland = () => {

    const { input, isInReview } = this.props;
    const { section } = this.state;

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      const inputKey = `input-deescalationscale-${i}`;
      const labelKey = `label-deescalationscale-${i}`;
      scaleRadios.push(
        <label key={labelKey} htmlFor={inputKey}>
          <input
              checked={input.deescalationscale === i}
              data-section={section}
              disabled={isInReview}
              id={inputKey}
              key={inputKey}
              name="deescalationscale"
              onChange={this.handleOnChangeScaleSelection}
              type="radio"
              value={i} />
          { i }
        </label>
      );
    }

    return (
      <FullWidthItem>
        <FieldHeader>Incident De-escalation Scale (1-10)</FieldHeader>
        <FieldHeader>1 = Calm , 10 = Still escalated</FieldHeader>
        <FlexyWrapper inline>
          { scaleRadios }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderDisposition = () => {

    const { input } = this.props;
    return (
      <FullWidthItem>
        <FieldHeader>Disposition</FieldHeader>
        <FlexyWrapper>
          { this.renderTempCheckbox('Arrest', 'disposition', 'arrest', input.disposition.indexOf('arrest') !== -1) }
          { this.renderTempCheckbox('EP', 'disposition', 'ep', input.disposition.indexOf('ep') !== -1) }
          { this.renderTempCheckbox('Voluntary ER Intake', 'disposition', 'voluntaryER',
              input.disposition.indexOf('voluntaryER') !== -1)
          }
          { this.renderTempCheckbox('BCRI', 'disposition', 'bcri', input.disposition.indexOf('bcri') !== -1) }
          { this.renderTempCheckbox('Information and Referral', 'disposition', 'infoAndReferral',
              input.disposition.indexOf('infoAndReferral') !== -1)
          }
          { this.renderTempCheckbox('LEAD', 'disposition', 'lead', input.disposition.indexOf('lead') !== -1) }
          {
            this.renderTempCheckbox(
              'Contacted or Referred to Current Treatment Provider',
              'disposition',
              'contactedTreatementProvider',
              input.disposition.indexOf('contactedTreatementProvider') !== -1
            )
          }
          { this.renderTempCheckbox('Criminal Citation', 'disposition', 'criminalCitation',
            input.disposition.indexOf('criminalCitation') !== -1)
          }
          { this.renderTempCheckbox('Civil Citation', 'disposition', 'civilCitation',
            input.disposition.indexOf('civilCitation') !== -1)
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderDispositionPortland = () => {

    const { input } = this.props;
    return (
      <FullWidthItem>
        <FieldHeader>Disposition</FieldHeader>
        <FlexyWrapper>
          { this.renderTempCheckbox('Referred to BHU', 'disposition', 'referredToBHU',
              input.disposition.indexOf('referredToBHU') !== -1)
          }
          { this.renderTempCheckbox('Referred to Crisis', 'disposition', 'referredToCrisis',
              input.disposition.indexOf('referredToCrisis') !== -1)
          }
          { this.renderTempCheckbox('Arrest', 'disposition', 'arrest', input.disposition.indexOf('arrest') !== -1) }
          { this.renderTempCheckbox('Diverted from Arrest', 'disposition', 'divertedFromArrest',
              input.disposition.indexOf('divertedFromArrest') !== -1)
          }
          { this.renderTempCheckbox('Resisted or Refused Supports', 'disposition', 'resistedOrRefusedSupports',
              input.disposition.indexOf('resistedOrRefusedSupports') !== -1)
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderStabilizedOnScene = () => {

    const { input, isInReview, updateStateValues } = this.props;
    const { section } = this.state;
    return (
      <>
        <HalfWidthItem>
          <FieldHeader>Stabilized on scene with Follow-Up Referral</FieldHeader>
          <FlexyWrapper inline>
            {
              this.renderTempRadio(
                'Yes',
                'stabilizedindicator',
                true,
                input.stabilizedindicator === true,
                () => {
                  updateStateValues(section, {
                    // set to true
                    stabilizedindicator: true,
                    // set default values
                    referraldestination: '',
                    referralprovidedindicator: true
                  });
                }
              )
            }
            {
              this.renderTempRadio(
                'No',
                'stabilizedindicator',
                false,
                input.stabilizedindicator === false,
                () => {
                  updateStateValues(section, {
                    // set to false
                    stabilizedindicator: false,
                    // clear values
                    referraldestination: '',
                    referralprovidedindicator: false
                  });
                }
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isInReview}
              header="If Yes, specify referral information"
              name="referraldestination"
              onChange={this.handleOnChange} />
        </HalfWidthItem>
      </>
    );
  }

  renderSpecializedResources = () => {

    const { input } = this.props;
    return (
      <FullWidthItem>
        <FieldHeader>Called for Specialized Resources</FieldHeader>
        <FlexyWrapper>
          { this.renderTempCheckbox('BCRI / Mobile Crisis Response Team', 'specializedResourcesCalled', 'bcri',
              input.specializedResourcesCalled.indexOf('bcri') !== -1)
          }
          { this.renderTempCheckbox('CIT Officer', 'specializedResourcesCalled', 'citOfficer',
              input.specializedResourcesCalled.indexOf('citOfficer') !== -1)
          }
          { this.renderTempCheckbox('CRT Unit', 'specializedResourcesCalled', 'crtUnit',
              input.specializedResourcesCalled.indexOf('crtUnit') !== -1)
          }
          { this.renderTempCheckbox('ESU', 'specializedResourcesCalled', 'esu',
              input.specializedResourcesCalled.indexOf('esu') !== -1)
          }
          { this.renderTempCheckbox('SWAT', 'specializedResourcesCalled', 'swat',
              input.specializedResourcesCalled.indexOf('swat') !== -1)
          }
          { this.renderTempCheckbox('Negotiation Team', 'specializedResourcesCalled', 'negotiationTeam',
              input.specializedResourcesCalled.indexOf('negotiationTeam') !== -1)
          }
          { this.renderTempCheckbox('Homeless Outreach', 'specializedResourcesCalled', 'homelessOutreach',
              input.specializedResourcesCalled.indexOf('homelessOutreach') !== -1)
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderSpecializedResourcesPortland = () => {

    const { input } = this.props;
    return (
      <FullWidthItem>
        <FieldHeader>Called for Specialized Resources</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'Behavioral Health Unit (BHU)',
              'specializedResourcesCalled',
              'BehavioralHealthUnit',
              input.specializedResourcesCalled.indexOf('BehavioralHealthUnit') !== -1
            )
          }
          {
            this.renderTempCheckbox('Crisis Team', 'specializedResourcesCalled', 'CrisisTeam',
              input.specializedResourcesCalled.indexOf('CrisisTeam') !== -1)
          }
          {
            this.renderTempCheckbox('Voluntary Transport', 'specializedResourcesCalled', 'voluntaryTransport',
              input.specializedResourcesCalled.indexOf('voluntaryTransport') !== -1)
          }
          {
            this.renderTempCheckbox('Involuntary Transport', 'specializedResourcesCalled', 'involuntaryTransport',
              input.specializedResourcesCalled.indexOf('involuntaryTransport') !== -1)
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderTransportedToHospitalPortland = () => {

    const {
      input,
      isInReview,
      updateStateValue,
      updateStateValues
    } = this.props;
    const { section } = this.state;
    return (
      <>
        <FullWidthItem>
          <FieldHeader>Transported to Hospital</FieldHeader>
          {
            this.renderTempRadio(
              'Yes',
              'hospitaltransportindicator',
              true,
              input.hospitaltransportindicator === true,
              () => {
                updateStateValues(section, {
                  // set to true
                  hospitaltransportindicator: true,
                  // set default values
                  hospitalname: '',
                  TransportingAgency: 'police',
                  voluntaryactionindicator: true
                });
              }
            )
          }
          {
            this.renderTempRadio(
              'No',
              'hospitaltransportindicator',
              false,
              input.hospitaltransportindicator === false,
              () => {
                updateStateValues(section, {
                  // set to true
                  hospitaltransportindicator: false,
                  // clear values
                  hospitalname: '',
                  TransportingAgency: '',
                  voluntaryactionindicator: null
                });
              }
            )
          }
        </FullWidthItem>
        {
          input.hospitaltransportindicator && (
            <>
              <HalfWidthItem>
                <FlexyWrapper inline>
                  {
                    this.renderTempRadio(
                      'Voluntary',
                      'voluntaryactionindicator',
                      true,
                      input.voluntaryactionindicator === true,
                      () => updateStateValues(section, { voluntaryactionindicator: true })
                    )
                  }
                  {
                    this.renderTempRadio(
                      'Involuntary',
                      'voluntaryactionindicator',
                      false,
                      input.voluntaryactionindicator === false,
                      () => updateStateValues(section, { voluntaryactionindicator: false })
                    )
                  }
                </FlexyWrapper>
              </HalfWidthItem>
              <HalfWidthItem>
                <FlexyWrapper inline>
                  { this.renderTempRadio('Police', 'TransportingAgency', 'police',
                      input.TransportingAgency === 'police')
                  }
                  { this.renderTempRadio('Medcu', 'TransportingAgency', 'medcu',
                      input.TransportingAgency === 'medcu')
                  }
                </FlexyWrapper>
              </HalfWidthItem>
              <FullWidthItem>
                <TextField
                    disabled={isInReview}
                    header="Hospital name"
                    name="hospitalname"
                    onChange={this.handleOnChange} />
              </FullWidthItem>
            </>
          )
        }
      </>
    );
  }

  renderTransportedToHospital = () => {

    const { input, isInReview, selectedOrganizationId } = this.props;
    return (
      <>
        <HalfWidthItem>
          <FieldHeader>Transported to Hospital</FieldHeader>
          <FlexyWrapper inline>
            { this.renderTempRadio('Yes', 'hospitaltransportindicator', true,
                input.hospitaltransportindicator === true)
            }
            { this.renderTempRadio('No', 'hospitaltransportindicator', false,
                input.hospitaltransportindicator === false)
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <FieldHeader>Hospital name</FieldHeader>
          {
            isPortlandOrg(selectedOrganizationId)
              ? (
                <TextField
                    disabled={isInReview}
                    name="hospital"
                    onChange={this.handleOnChange} />
              )
              : this.renderHospitalsSelect()
          }
        </HalfWidthItem>
      </>
    );
  }

  renderDeescalationTechniques = () => {

    const { input, isInReview, selectedOrganizationId } = this.props;
    const titleValue = isPortlandOrg(selectedOrganizationId)
      ? 'Use of Force / Equipment Used'
      : 'De-escalation Techniques / Equipment Used';

    return (
      <>
        <HalfWidthItem>
          <FieldHeader>{ titleValue }</FieldHeader>
          <FlexyWrapper>
            { this.renderTempCheckbox('Verbalization', 'deescalationTechniques', 'verbalization',
                input.deescalationTechniques.indexOf('verbalization') !== -1)
            }
            { this.renderTempCheckbox('Handcuffs', 'deescalationTechniques', 'handcuffs',
                input.deescalationTechniques.indexOf('handcuffs') !== -1)
            }
            { this.renderTempCheckbox('Leg Restraints', 'deescalationTechniques', 'legRestraints',
                input.deescalationTechniques.indexOf('legRestraints') !== -1)
            }
            { this.renderTempCheckbox('Taser', 'deescalationTechniques', 'taser',
                input.deescalationTechniques.indexOf('taser') !== -1)
            }
            { this.renderTempCheckbox('Arrest Control (Hands / Feet)', 'deescalationTechniques', 'arrestControl',
                input.deescalationTechniques.indexOf('arrestControl') !== -1)
            }
            { this.renderTempCheckbox('N/A', 'deescalationTechniques', 'n/a',
                input.deescalationTechniques.indexOf('n/a') !== -1)
            }
            { this.renderTempCheckbox('Other', 'deescalationTechniques', 'other',
                input.deescalationTechniques.indexOf('other') !== -1)
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isInReview}
              header="If other, specify other techniques"
              name="deescalationTechniquesOther"
              onChange={this.handleOnChange} />
        </HalfWidthItem>
      </>
    );
  }

  render() {

    const { isInReview, selectedOrganizationId } = this.props;
    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            { !isInReview && (
              <h1>Disposition</h1>
            )}
          </FullWidthItem>
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
          <FullWidthItem>
            <TextAreaField
                disabled={isInReview}
                header={incidentNarrativeTitle}
                name="incidentNarrative"
                onChange={this.handleOnChange} />
          </FullWidthItem>
        </FormGridWrapper>
        {
          !isInReview
            ? (
              <FormNav
                  prevPath={FORM_PATHS.COMPLAINANT}
                  nextPath={FORM_PATHS.OFFICER}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
      </>
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
