import React, { Component } from 'react';

import { withRouter } from 'react-router';

import FormNav from './FormNav';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import { FormGridWrapper, FullWidthItem } from './form/StyledFormComponents';

// TODO: add flow types and PropTypes
class ComplainantInfoView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      section: 'complainantInfo',
    };
  }

  handlePageChange = (path) => {

    // TODO: validation
    const { handlePageChange } = this.props;
    handlePageChange(path);
  }

  render() {

    const { input, isInReview, updateStateValue } = this.props;
    const { section } = this.state;
    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            { !isInReview && (
              <h1>Complainant</h1>
            )}
          </FullWidthItem>
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Complainant Name (Last, First, Middle)"
                onChange={value => updateStateValue(section, 'complainantName', value)}
                value={input.complainantName} />
          </FullWidthItem>
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Residence / Address (Street, Apt Number, City, County, State, Zip)"
                onChange={value => updateStateValue(section, 'complainantAddress', value)}
                value={input.complainantAddress} />
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Relationship to Consumer"
              onChange={value => updateStateValue(section, 'complainantConsumerRelationship', value)}
              value={input.complainantConsumerRelationship} />
          <TextField
              disabled={isInReview}
              header="Phone Number"
              onChange={value => updateStateValue(section, 'complainantPhone', value)}
              value={input.complainantPhone} />
        </FormGridWrapper>
        {
          !isInReview && (
            <FormNav
                prevPath={FORM_PATHS.REPORT}
                nextPath={FORM_PATHS.DISPOSITION}
                handlePageChange={this.handlePageChange} />
          )
        }
      </>
    );
  }
}

export default withRouter(ComplainantInfoView);
