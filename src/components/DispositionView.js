import React from 'react';

import parseInt from 'lodash/parseInt';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FieldHeader from './text/styled/FieldHeader';
import TextAreaField from './text/TextAreaField';
import TextField from './text/TextField';
import {
  EditButton,
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from './form/StyledFormComponents';
import { FORM_PATHS } from '../shared/Consts';
import { isPortlandOrg } from '../utils/Whitelist';
import { checkboxesHelper } from '../containers/reports/HackyUtils';
import {
  DEESCALATION_SCALE_FQN,
  DEESCALATION_TECHNIQUES_FQN,
  DEESCALATION_TECHNIQUES_OTHER_FQN,
  DISPOSITION_FQN,
  HOSPITAL_TRANSPORT_INDICATOR_FQN,
  HOSPITAL_FQN,
  HOSPITAL_NAME_FQN,
  INCIDENT_NARRATIVE_FQN,
  REFERRAL_DEST_FQN,
  REFERRAL_PROVIDER_INDICATOR_FQN,
  SPECIAL_RESOURCES_CALLED_FQN,
  STABILIZED_INDICATOR_FQN,
  TRANSPORTING_AGENCY_FQN,
  VOLUNTARY_ACTION_INDICATOR_FQN,
} from '../edm/DataModelFqns';

const incidentNarrativeTitle = `Narrative of Incident, to include: Results of investigation, basis for actions taken,
emotional states, additional witnesses. Property listing.`;

class DispositionView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      section: 'dispositionInfo',
    };
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempCheckbox = (label, name, value, isChecked, onChange) => {

    const { isReadOnly } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
            disabled={isReadOnly}
            id={id}
            name={name}
            onChange={onChange}
            type="checkbox"
            value={value} />
        { label }
      </label>
    );
  }

  // TODO: replace this with real components from lattice-ui-kit
  renderTempRadio = (label, name, value, isChecked, onChange) => {

    const { isReadOnly } = this.props;
    const { section } = this.state;
    const id = `${name}-${value}`;
    return (
      <label htmlFor={id}>
        <input
            checked={isChecked}
            data-section={section}
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

  renderHospitalsSelect = () => {

    const {
      hospitals,
      input,
      isReadOnly,
      updateStateValue,
    } = this.props;
    const { section } = this.state;

    if (hospitals.isEmpty()) {
      return (
        <TextField
            disabled={isReadOnly}
            onChange={value => updateStateValue(section, HOSPITAL_FQN, value)}
            value={input[HOSPITAL_FQN]} />
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
          disabled={isReadOnly}
          name={HOSPITAL_FQN}
          onChange={event => updateStateValue(section, HOSPITAL_FQN, event.target.value)}
          value={input[HOSPITAL_FQN]}>
        <option value="">Select</option>
        { hospitalOptions }
      </select>
    );
  }

  renderDeescalationScalePortland = () => {

    const { input, isReadOnly, updateStateValue } = this.props;
    const { section } = this.state;

    const scaleRadios = [];
    for (let i = 1; i <= 10; i += 1) {
      const inputKey = `input-deescalationscale-${i}`;
      const labelKey = `label-deescalationscale-${i}`;
      scaleRadios.push(
        <label key={labelKey} htmlFor={inputKey}>
          <input
              checked={input[DEESCALATION_SCALE_FQN] === i}
              data-section={section}
              disabled={isReadOnly}
              id={inputKey}
              key={inputKey}
              name={DEESCALATION_SCALE_FQN}
              onChange={event => updateStateValue(section, DEESCALATION_SCALE_FQN, parseInt(event.target.value))}
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

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>Disposition</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'Arrest',
              DISPOSITION_FQN,
              'arrest',
              input[DISPOSITION_FQN].indexOf('arrest') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'EP',
              DISPOSITION_FQN,
              'ep',
              input[DISPOSITION_FQN].indexOf('ep') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Voluntary ER Intake',
              DISPOSITION_FQN,
              'voluntaryER',
              input[DISPOSITION_FQN].indexOf('voluntaryER') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'BCRI',
              DISPOSITION_FQN,
              'bcri',
              input[DISPOSITION_FQN].indexOf('bcri') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Information and Referral',
              DISPOSITION_FQN,
              'infoAndReferral',
              input[DISPOSITION_FQN].indexOf('infoAndReferral') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'LEAD',
              DISPOSITION_FQN,
              'lead',
              input[DISPOSITION_FQN].indexOf('lead') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Contacted or Referred to Current Treatment Provider',
              DISPOSITION_FQN,
              'contactedTreatementProvider',
              input[DISPOSITION_FQN].indexOf('contactedTreatementProvider') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Criminal Citation',
              DISPOSITION_FQN,
              'criminalCitation',
              input[DISPOSITION_FQN].indexOf('criminalCitation') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Civil Citation',
              DISPOSITION_FQN,
              'civilCitation',
              input[DISPOSITION_FQN].indexOf('civilCitation') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderDispositionPortland = () => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>Disposition</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'Referred to BHU',
              DISPOSITION_FQN,
              'referredToBHU',
              input[DISPOSITION_FQN].indexOf('referredToBHU') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Referred to Crisis',
              DISPOSITION_FQN,
              'referredToCrisis',
              input[DISPOSITION_FQN].indexOf('referredToCrisis') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Arrest',
              DISPOSITION_FQN,
              'arrest',
              input[DISPOSITION_FQN].indexOf('arrest') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Diverted from Arrest',
              DISPOSITION_FQN,
              'divertedFromArrest',
              input[DISPOSITION_FQN].indexOf('divertedFromArrest') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Resisted or Refused Supports',
              DISPOSITION_FQN,
              'resistedOrRefusedSupports',
              input[DISPOSITION_FQN].indexOf('resistedOrRefusedSupports') !== -1,
              event => updateStateValue(section, DISPOSITION_FQN,
                checkboxesHelper(input[DISPOSITION_FQN], event.target.value))
            )
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderStabilizedOnScene = () => {

    const {
      input,
      isReadOnly,
      updateStateValue,
      updateStateValues
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <HalfWidthItem>
          <FieldHeader>Stabilized on scene with Follow-Up Referral</FieldHeader>
          <FlexyWrapper inline>
            {
              this.renderTempRadio(
                'Yes',
                STABILIZED_INDICATOR_FQN,
                true,
                input[STABILIZED_INDICATOR_FQN] === true,
                () => {
                  updateStateValues(section, {
                    // set to true
                    [STABILIZED_INDICATOR_FQN]: true,
                    // set default values
                    [REFERRAL_DEST_FQN]: '',
                    [REFERRAL_PROVIDER_INDICATOR_FQN]: true,
                  });
                }
              )
            }
            {
              this.renderTempRadio(
                'No',
                STABILIZED_INDICATOR_FQN,
                false,
                input[STABILIZED_INDICATOR_FQN] === false,
                () => {
                  updateStateValues(section, {
                    // set to false
                    [STABILIZED_INDICATOR_FQN]: false,
                    // clear values
                    [REFERRAL_DEST_FQN]: '',
                    [REFERRAL_PROVIDER_INDICATOR_FQN]: false,
                  });
                }
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isReadOnly}
              header="If Yes, specify referral information"
              onChange={value => updateStateValue(section, REFERRAL_DEST_FQN, value)}
              value={input[REFERRAL_DEST_FQN]} />
        </HalfWidthItem>
      </>
    );
  }

  renderSpecializedResources = () => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>Called for Specialized Resources</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'BCRI / Mobile Crisis Response Team',
              SPECIAL_RESOURCES_CALLED_FQN,
              'bcri',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('bcri') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'CIT Officer',
              SPECIAL_RESOURCES_CALLED_FQN,
              'citOfficer',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('citOfficer') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'CRT Unit',
              SPECIAL_RESOURCES_CALLED_FQN,
              'crtUnit',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('crtUnit') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'ESU',
              SPECIAL_RESOURCES_CALLED_FQN,
              'esu',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('esu') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'SWAT',
              SPECIAL_RESOURCES_CALLED_FQN,
              'swat',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('swat') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Negotiation Team',
              SPECIAL_RESOURCES_CALLED_FQN,
              'negotiationTeam',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('negotiationTeam') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Homeless Outreach',
              SPECIAL_RESOURCES_CALLED_FQN,
              'homelessOutreach',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('homelessOutreach') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderSpecializedResourcesPortland = () => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>Called for Specialized Resources</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'Behavioral Health Unit (BHU)',
              SPECIAL_RESOURCES_CALLED_FQN,
              'BehavioralHealthUnit',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('BehavioralHealthUnit') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Crisis Team',
              SPECIAL_RESOURCES_CALLED_FQN,
              'CrisisTeam',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('CrisisTeam') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Voluntary Transport',
              SPECIAL_RESOURCES_CALLED_FQN,
              'voluntaryTransport',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('voluntaryTransport') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'Involuntary Transport',
              SPECIAL_RESOURCES_CALLED_FQN,
              'involuntaryTransport',
              input[SPECIAL_RESOURCES_CALLED_FQN].indexOf('involuntaryTransport') !== -1,
              event => updateStateValue(section, SPECIAL_RESOURCES_CALLED_FQN,
                checkboxesHelper(input[SPECIAL_RESOURCES_CALLED_FQN], event.target.value))
            )
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderTransportedToHospitalPortland = () => {

    const {
      input,
      isReadOnly,
      updateStateValue,
      updateStateValues,
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FullWidthItem>
          <FieldHeader>Transported to Hospital</FieldHeader>
          {
            this.renderTempRadio(
              'Yes',
              HOSPITAL_TRANSPORT_INDICATOR_FQN,
              true,
              input[HOSPITAL_TRANSPORT_INDICATOR_FQN] === true,
              () => {
                updateStateValues(section, {
                  // set to true
                  [HOSPITAL_TRANSPORT_INDICATOR_FQN]: true,
                  // set default values
                  [HOSPITAL_NAME_FQN]: '',
                  [TRANSPORTING_AGENCY_FQN]: 'police',
                  [VOLUNTARY_ACTION_INDICATOR_FQN]: true
                });
              }
            )
          }
          {
            this.renderTempRadio(
              'No',
              HOSPITAL_TRANSPORT_INDICATOR_FQN,
              false,
              input[HOSPITAL_TRANSPORT_INDICATOR_FQN] === false,
              () => {
                updateStateValues(section, {
                  // set to true
                  [HOSPITAL_TRANSPORT_INDICATOR_FQN]: false,
                  // clear values
                  [HOSPITAL_NAME_FQN]: '',
                  [TRANSPORTING_AGENCY_FQN]: '',
                  [VOLUNTARY_ACTION_INDICATOR_FQN]: null
                });
              }
            )
          }
        </FullWidthItem>
        {
          input[HOSPITAL_TRANSPORT_INDICATOR_FQN] && (
            <>
              <HalfWidthItem>
                <FlexyWrapper inline>
                  {
                    this.renderTempRadio(
                      'Voluntary',
                      VOLUNTARY_ACTION_INDICATOR_FQN,
                      true,
                      input[VOLUNTARY_ACTION_INDICATOR_FQN] === true,
                      () => updateStateValue(section, VOLUNTARY_ACTION_INDICATOR_FQN, true)
                    )
                  }
                  {
                    this.renderTempRadio(
                      'Involuntary',
                      VOLUNTARY_ACTION_INDICATOR_FQN,
                      false,
                      input[VOLUNTARY_ACTION_INDICATOR_FQN] === false,
                      () => updateStateValue(section, VOLUNTARY_ACTION_INDICATOR_FQN, false)
                    )
                  }
                </FlexyWrapper>
              </HalfWidthItem>
              <HalfWidthItem>
                <FlexyWrapper inline>
                  {
                    this.renderTempRadio(
                      'Police',
                      TRANSPORTING_AGENCY_FQN,
                      'police',
                      input[TRANSPORTING_AGENCY_FQN] === 'police',
                      () => updateStateValue(section, TRANSPORTING_AGENCY_FQN, 'police')
                    )
                  }
                  {
                    this.renderTempRadio(
                      'Medcu',
                      TRANSPORTING_AGENCY_FQN,
                      'medcu',
                      input[TRANSPORTING_AGENCY_FQN] === 'medcu',
                      () => updateStateValue(section, TRANSPORTING_AGENCY_FQN, 'medcu')
                    )
                  }
                </FlexyWrapper>
              </HalfWidthItem>
              <FullWidthItem>
                <TextField
                    disabled={isReadOnly}
                    header="Hospital name"
                    onChange={value => updateStateValue(section, HOSPITAL_NAME_FQN, value)}
                    value={input[HOSPITAL_NAME_FQN]} />
              </FullWidthItem>
            </>
          )
        }
      </>
    );
  }

  renderTransportedToHospital = () => {

    const {
      input,
      isReadOnly,
      selectedOrganizationId,
      updateStateValue,
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <HalfWidthItem>
          <FieldHeader>Transported to Hospital</FieldHeader>
          <FlexyWrapper inline>
            {
              this.renderTempRadio(
                'Yes',
                HOSPITAL_TRANSPORT_INDICATOR_FQN,
                true,
                input[HOSPITAL_TRANSPORT_INDICATOR_FQN] === true,
                () => updateStateValue(section, HOSPITAL_TRANSPORT_INDICATOR_FQN, true),
              )
            }
            {
              this.renderTempRadio(
                'No',
                HOSPITAL_TRANSPORT_INDICATOR_FQN,
                false,
                input[HOSPITAL_TRANSPORT_INDICATOR_FQN] === false,
                () => updateStateValue(section, HOSPITAL_TRANSPORT_INDICATOR_FQN, false),
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <FieldHeader>Hospital name</FieldHeader>
          {
            isPortlandOrg(selectedOrganizationId)
              ? (
                <TextField
                    disabled={isReadOnly}
                    onChange={value => updateStateValue(section, HOSPITAL_FQN, value)}
                    value={input[HOSPITAL_FQN]} />
              )
              : this.renderHospitalsSelect()
          }
        </HalfWidthItem>
      </>
    );
  }

  renderDeescalationTechniques = () => {

    const {
      input,
      isReadOnly,
      selectedOrganizationId,
      updateStateValue,
    } = this.props;
    const { section } = this.state;

    const titleValue = isPortlandOrg(selectedOrganizationId)
      ? 'Use of Force / Equipment Used'
      : 'De-escalation Techniques / Equipment Used';

    return (
      <>
        <HalfWidthItem>
          <FieldHeader>{ titleValue }</FieldHeader>
          <FlexyWrapper>
            {
              this.renderTempCheckbox(
                'Verbalization',
                DEESCALATION_TECHNIQUES_FQN,
                'verbalization',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('verbalization') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Handcuffs',
                DEESCALATION_TECHNIQUES_FQN,
                'handcuffs',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('handcuffs') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Leg Restraints',
                DEESCALATION_TECHNIQUES_FQN,
                'legRestraints',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('legRestraints') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Taser',
                DEESCALATION_TECHNIQUES_FQN,
                'taser',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('taser') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Arrest Control (Hands / Feet)',
                DEESCALATION_TECHNIQUES_FQN,
                'arrestControl',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('arrestControl') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'N/A',
                DEESCALATION_TECHNIQUES_FQN,
                'n/a',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('n/a') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
            {
              this.renderTempCheckbox(
                'Other',
                DEESCALATION_TECHNIQUES_FQN,
                'other',
                input[DEESCALATION_TECHNIQUES_FQN].indexOf('other') !== -1,
                event => updateStateValue(section, DEESCALATION_TECHNIQUES_FQN,
                  checkboxesHelper(input[DEESCALATION_TECHNIQUES_FQN], event.target.value))
              )
            }
          </FlexyWrapper>
        </HalfWidthItem>
        <HalfWidthItem>
          <TextField
              disabled={isReadOnly}
              header="If other, specify other techniques"
              onChange={value => updateStateValue(section, DEESCALATION_TECHNIQUES_OTHER_FQN, value)}
              value={input[DEESCALATION_TECHNIQUES_OTHER_FQN]} />
        </HalfWidthItem>
      </>
    );
  }

  render() {

    const {
      input,
      isInReview,
      isReadOnly,
      selectedOrganizationId,
      updateStateValue,
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            <h1>Disposition</h1>
            { isInReview && (
              <Link to={FORM_PATHS.DISPOSITION}>
                <EditButton onClick={this.handleOnClickEditReport}>Edit</EditButton>
              </Link>
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
                disabled={isReadOnly}
                header={incidentNarrativeTitle}
                name={INCIDENT_NARRATIVE_FQN}
                onChange={value => updateStateValue(section, INCIDENT_NARRATIVE_FQN, value)}
                value={input[INCIDENT_NARRATIVE_FQN]} />
          </FullWidthItem>
        </FormGridWrapper>
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
