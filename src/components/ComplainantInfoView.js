import React from 'react';

import { withRouter } from 'react-router';

import FormNav from './FormNav';
import TextField from './text/TextField';
import { FORM_PATHS } from '../shared/Consts';
import { getCurrentPage } from '../utils/Utils';
import { FormGridWrapper, FullWidthItem } from './form/StyledFormComponents';

// TODO: add flow types and PropTypes
class ComplainantInfoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: getCurrentPage(),
      requiredFields: [],
      section: 'complainantInfo',
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

  render() {

    const { isInReview } = this.props;
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
                name="complainantName"
                onChange={this.handleOnChange} />
          </FullWidthItem>
          <FullWidthItem>
            <TextField
                disabled={isInReview}
                header="Residence / Address (Street, Apt Number, City, County, State, Zip)"
                name="complainantAddress"
                onChange={this.handleOnChange} />
          </FullWidthItem>
          <TextField
              disabled={isInReview}
              header="Relationship to Consumer"
              name="complainantConsumerRelationship"
              onChange={this.handleOnChange} />
          <TextField
              disabled={isInReview}
              header="Phone Number"
              name="complainantPhone"
              onChange={this.handleOnChange} />
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
