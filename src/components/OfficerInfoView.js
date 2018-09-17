import React from 'react';

import { withRouter } from 'react-router';

import FormNav from './FormNav';
import FieldHeader from './text/styled/FieldHeader';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import { isPortlandOrg } from '../utils/Whitelist';
import {
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
} from './form/StyledFormComponents';

class OfficerInfoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      section: 'officerInfo',
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

  renderOfficerCertification = () => {

    const { input } = this.props;
    return (
      <FullWidthItem>
        <FieldHeader>Officer Certification</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox('CRT Unit', 'officerCertification', 'crtUnit',
              input.officerCertification.indexOf('crtUnit') !== -1)
          }
          {
            this.renderTempCheckbox('BEST', 'officerCertification', 'best',
              input.officerCertification.indexOf('best') !== -1)
          }
          {
            this.renderTempCheckbox('CIT', 'officerCertification', 'cit',
              input.officerCertification.indexOf('cit') !== -1)
          }
          {
            this.renderTempCheckbox('N/A', 'officerCertification', 'n/a',
              input.officerCertification.indexOf('n/a') !== -1)
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  renderOfficerCertificationPortland = () => {

    const { input } = this.props;
    return (
      <FullWidthItem>
        <FieldHeader>Officer Certification</FieldHeader>
        <FlexyWrapper>
          {
            this.renderTempCheckbox('CIT', 'officerCertification', 'cit',
              input.officerCertification.indexOf('cit') !== -1)
          }
        </FlexyWrapper>
      </FullWidthItem>
    );
  }

  render() {

    const { isInReview, selectedOrganizationId } = this.props;
    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            { !isInReview && (
              <h1>Officer</h1>
            )}
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Officer Name"
              name="officerName"
              onChange={this.handleOnChange} />
          <TextField
              disabled={isInReview}
              header="Officer Seq Id"
              name="officerSeqID"
              onChange={this.handleOnChange} />
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Officer Injuries"
                name="officerInjuries"
                onChange={this.handleOnChange} />
          </FullWidthItem>
          {
            isPortlandOrg(selectedOrganizationId)
              ? this.renderOfficerCertificationPortland()
              : this.renderOfficerCertification()
          }
        </FormGridWrapper>
        {
          !isInReview
            ? (
              <FormNav
                  prevPath={FORM_PATHS.DISPOSITION}
                  nextPath={FORM_PATHS.REVIEW}
                  handlePageChange={this.handlePageChange} />
            )
            : null
        }
      </>
    );
  }
}

export default withRouter(OfficerInfoView);
