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
  HalfWidthItem
} from './form/StyledFormComponents';
import { FORM_PATHS } from '../shared/Consts';
import {
  DEESCALATION_TECHNIQUES,
  DISPOSITIONS,
  DISPOSITIONS_PORTLAND,
  RESOURCES,
  RESOURCES_PORTLAND,
  TRANSPORTING_AGENCIES,
  VOLUNTARY_ACTION_INDICATOR
} from '../utils/DataConstants';
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
  VOLUNTARY_ACTION_INDICATOR_FQN
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
      <label htmlFor={id} key={id}>
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
      <label htmlFor={id} key={id}>
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

  renderRadio = (label, fqn, valueIfDifferentFromLabel) => {
    const { input, updateStateValue } = this.props;
    const { section } = this.state;

    const value = valueIfDifferentFromLabel || label;

    return this.renderTempRadio(
      label,
      fqn,
      value,
      input[fqn] === value,
      () => updateStateValue(section, fqn, value)
    );
  }

  renderRadioButtons = (labels, fqn) => Object.values(labels).map(label => this.renderRadio(label, fqn))

  renderYesNoRadio = (fqn, withUnknown, inlineFalse) => {
    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    const currVal = `${input[fqn]}`;

    const yesVal = withUnknown ? 'Yes' : true;
    const noVal = withUnknown ? 'No' : false;

    return (
      <FlexyWrapper inline={!inlineFalse}>
        {
          this.renderTempRadio(
            'Yes',
            fqn,
            yesVal,
            currVal === `${yesVal}`,
            () => updateStateValue(section, fqn, yesVal)
          )
        }
        {
          this.renderTempRadio(
            'No',
            fqn,
            noVal,
            currVal === `${noVal}`,
            () => updateStateValue(section, fqn, noVal)
          )
        }
        {
          withUnknown ? this.renderTempRadio(
            'Unknown',
            fqn,
            'unknown',
            currVal === 'unknown',
            () => updateStateValue(section, fqn, 'unknown')
          ) : null
        }
      </FlexyWrapper>
    );
  }

  renderCheckbox = (label, fqn, valueIfDifferentFromLabel) => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    const value = valueIfDifferentFromLabel || label;

    return this.renderTempCheckbox(
      label,
      fqn,
      value,
      input[fqn].indexOf(value) !== -1,
      event => updateStateValue(section, fqn, checkboxesHelper(input[fqn], event.target.value))
    );
  }

  renderCheckboxes = (labels, fqn) => Object.values(labels).map(label => this.renderCheckbox(label, fqn))

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

  renderDisposition = (isPortland) => {
    const dispositions = isPortland ? DISPOSITIONS_PORTLAND : DISPOSITIONS;
    return (
      <FullWidthItem>
        <FieldHeader>Disposition</FieldHeader>
        <FlexyWrapper>
          {this.renderCheckboxes(dispositions, DISPOSITION_FQN)}
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

  renderSpecializedResources = (isPortland) => {
    const resources = isPortland ? RESOURCES_PORTLAND : RESOURCES;

    return (
      <FullWidthItem>
        <FieldHeader>Called for Specialized Resources</FieldHeader>
        <FlexyWrapper>
          {this.renderCheckboxes(resources, SPECIAL_RESOURCES_CALLED_FQN)}
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
          {this.renderCheckbox('Behavioral Health Unit (BHU)', SPECIAL_RESOURCES_CALLED_FQN, RESOURCES_PORTLAND.BHU)}
          {this.renderCheckbox('Crisis Team', SPECIAL_RESOURCES_CALLED_FQN, RESOURCES_PORTLAND.CRISIS)}
          {this.renderCheckbox('Voluntary Transport', SPECIAL_RESOURCES_CALLED_FQN, RESOURCES_PORTLAND.VOLUNTARY)}
          {this.renderCheckbox('Involuntary Transport', SPECIAL_RESOURCES_CALLED_FQN, RESOURCES_PORTLAND.INVOLUNTARY)}
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
                  {this.renderRadio(VOLUNTARY_ACTION_INDICATOR.VOLUNTARY, VOLUNTARY_ACTION_INDICATOR_FQN, true)}
                  {this.renderRadio(VOLUNTARY_ACTION_INDICATOR.INVOLUNTARY, VOLUNTARY_ACTION_INDICATOR_FQN, false)}
                </FlexyWrapper>
              </HalfWidthItem>
              <HalfWidthItem>
                <FlexyWrapper inline>
                  {this.renderRadioButtons(TRANSPORTING_AGENCIES, TRANSPORTING_AGENCY_FQN)}
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
          {this.renderYesNoRadio(HOSPITAL_TRANSPORT_INDICATOR_FQN)}
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
            {this.renderCheckboxes(DEESCALATION_TECHNIQUES, DEESCALATION_TECHNIQUES_FQN)}
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

    const isPortland = isPortlandOrg(selectedOrganizationId);

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
          {this.renderDisposition(isPortland)}
          {isPortland ? this.renderStabilizedOnScene() : null}
          {
            isPortland
              ? this.renderTransportedToHospitalPortland()
              : this.renderTransportedToHospital()
          }
          {isPortland ? this.renderDeescalationScalePortland() : null}
          {this.renderDeescalationTechniques()}
          {this.renderSpecializedResources(isPortland)}
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
