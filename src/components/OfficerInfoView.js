import React from 'react';

import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import { CERTIFICATIONS, CERTIFICATIONS_PORTLAND } from '../utils/DataConstants';
import { isPortlandOrg } from '../utils/Whitelist';
import { checkboxesHelper } from '../containers/reports/HackyUtils';
import {
  EditButton,
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
} from './form/StyledFormComponents';

import {
  OFFICER_NAME_FQN,
  OFFICER_SEQ_ID_FQN,
  OFFICER_INJURIES_FQN,
  OFFICER_CERTIFICATION_FQN,
} from '../edm/DataModelFqns';

class OfficerInfoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      section: 'officerInfo',
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

  renderOfficerCertification = (isPortland) => {
    const certifications = isPortland ? CERTIFICATIONS_PORTLAND : CERTIFICATIONS;

    return (
      <FullWidthItem>
        <FieldHeader>Officer Certification</FieldHeader>
        <FlexyWrapper>
          {this.renderCheckboxes(certifications, OFFICER_CERTIFICATION_FQN)}
        </FlexyWrapper>
      </FullWidthItem>
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
            <h1>Officer</h1>
            { isInReview && (
              <Link to={FORM_PATHS.OFFICER}>
                <EditButton onClick={this.handleOnClickEditReport}>Edit</EditButton>
              </Link>
            )}
          </FullWidthItem>
          <TextField
              disabled={isReadOnly}
              header="Officer Name"
              onChange={value => updateStateValue(section, OFFICER_NAME_FQN, value)}
              value={input[OFFICER_NAME_FQN]} />
          <TextField
              disabled={isReadOnly}
              header="Officer Seq Id"
              onChange={value => updateStateValue(section, OFFICER_SEQ_ID_FQN, value)}
              value={input[OFFICER_SEQ_ID_FQN]} />
          <FullWidthItem>
            <TextField
                disabled={isReadOnly}
                header="Officer Injuries"
                onChange={value => updateStateValue(section, OFFICER_INJURIES_FQN, value)}
                value={input[OFFICER_INJURIES_FQN]} />
          </FullWidthItem>
          {this.renderOfficerCertification(isPortland)}
        </FormGridWrapper>
      </>
    );
  }
}

export default withRouter(OfficerInfoView);
