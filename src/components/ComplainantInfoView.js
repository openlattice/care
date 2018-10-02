import React, { Component } from 'react';

import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import { EditButton, FormGridWrapper, FullWidthItem } from './form/StyledFormComponents';

import {
  COMPLAINANT_NAME_FQN,
  COMPLAINANT_ADDRESS_FQN,
  COMPLAINANT_RELATIONSHIP_FQN,
  COMPLAINANT_PHONE_FQN,
} from '../edm/DataModelFqns';

// TODO: add flow types and PropTypes
class ComplainantInfoView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      section: 'complainantInfo',
    };
  }

  render() {

    const {
      input,
      isInReview,
      isReadOnly,
      updateStateValue
    } = this.props;
    const { section } = this.state;

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            <h1>Complainant</h1>
            { isInReview && (
              <Link to={FORM_PATHS.COMPLAINANT}>
                <EditButton onClick={this.handleOnClickEditReport}>Edit</EditButton>
              </Link>
            )}
          </FullWidthItem>
          <FullWidthItem>
            <TextField
                disabled={isReadOnly}
                header="Complainant Name (Last, First, Middle)"
                onChange={value => updateStateValue(section, COMPLAINANT_NAME_FQN, value)}
                value={input[COMPLAINANT_NAME_FQN]} />
          </FullWidthItem>
          <FullWidthItem>
            <TextField
                disabled={isReadOnly}
                header="Residence / Address (Street, Apt Number, City, County, State, Zip)"
                onChange={value => updateStateValue(section, COMPLAINANT_ADDRESS_FQN, value)}
                value={input[COMPLAINANT_ADDRESS_FQN]} />
          </FullWidthItem>
          <TextField
              disabled={isReadOnly}
              header="Relationship to Consumer"
              onChange={value => updateStateValue(section, COMPLAINANT_RELATIONSHIP_FQN, value)}
              value={input[COMPLAINANT_RELATIONSHIP_FQN]} />
          <TextField
              disabled={isReadOnly}
              header="Phone Number"
              onChange={value => updateStateValue(section, COMPLAINANT_PHONE_FQN, value)}
              value={input[COMPLAINANT_PHONE_FQN]} />
        </FormGridWrapper>
      </>
    );
  }
}

export default withRouter(ComplainantInfoView);
