import React from 'react';

import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
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

  renderOfficerCertification = () => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>Officer Certification</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'CRT Unit',
              OFFICER_CERTIFICATION_FQN,
              'crtUnit',
              input[OFFICER_CERTIFICATION_FQN].indexOf('crtUnit') !== -1,
              event => updateStateValue(section, OFFICER_CERTIFICATION_FQN,
                checkboxesHelper(input[OFFICER_CERTIFICATION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'BEST',
              OFFICER_CERTIFICATION_FQN,
              'best',
              input[OFFICER_CERTIFICATION_FQN].indexOf('best') !== -1,
              event => updateStateValue(section, OFFICER_CERTIFICATION_FQN,
                checkboxesHelper(input[OFFICER_CERTIFICATION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'CIT',
              OFFICER_CERTIFICATION_FQN,
              'cit',
              input[OFFICER_CERTIFICATION_FQN].indexOf('cit') !== -1,
              event => updateStateValue(section, OFFICER_CERTIFICATION_FQN,
                checkboxesHelper(input[OFFICER_CERTIFICATION_FQN], event.target.value))
            )
          }
          {
            this.renderTempCheckbox(
              'N/A',
              OFFICER_CERTIFICATION_FQN,
              'n/a',
              input[OFFICER_CERTIFICATION_FQN].indexOf('n/a') !== -1,
              event => updateStateValue(section, OFFICER_CERTIFICATION_FQN,
                checkboxesHelper(input[OFFICER_CERTIFICATION_FQN], event.target.value))
            )
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderOfficerCertificationPortland = () => {

    const { input, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <FullWidthItem>
        <FieldHeader>Officer Certification</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox(
              'CIT',
              OFFICER_CERTIFICATION_FQN,
              'cit',
              input[OFFICER_CERTIFICATION_FQN].indexOf('cit') !== -1,
              event => updateStateValue(section, OFFICER_CERTIFICATION_FQN,
                checkboxesHelper(input[OFFICER_CERTIFICATION_FQN], event.target.value))
            )
          }
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
          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderOfficerCertificationPortland()
              : this.renderOfficerCertification()
          }
        </FormGridWrapper>
      </>
    );
  }
}

export default withRouter(OfficerInfoView);
