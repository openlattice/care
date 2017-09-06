/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col } from 'react-bootstrap';

import SectionView from './SectionView';
import { PaddedRow, TitleLabel } from '../shared/Layout';

const ComplainantInfoView = ({ section, handleTextInput, input }) => {
  return(
    <div>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>28. Last Name</TitleLabel>
          <FormControl data-section={section} name='complainantLastName' value={input.complainantLastName} onChange={handleTextInput} />
        </Col>
        <Col lg={6}>
          <TitleLabel>First Name</TitleLabel>
          <FormControl data-section={section} name='complainantFirstName' value={input.complainantFirstName} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>Middle Name</TitleLabel>
          <FormControl data-section={section} name='complainantMiddleName' value={input.complainantMiddleName} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Address</TitleLabel>
          <FormControl data-section={section} name='complainantStreet' value={input.complainantStreet} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>City</TitleLabel>
          <FormControl data-section={section} name='complainantCity' value={input.complainantCity} onChange={handleTextInput} />
        </Col>
        <Col lg={6}>
          <TitleLabel>State</TitleLabel>
          <FormControl data-section={section} name='complainantState' value={input.complainantState} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>County</TitleLabel>
          <FormControl data-section={section} name='complainantCounty' value={input.complainantCounty} onChange={handleTextInput} />
        </Col>
        <Col lg={6}>
          <TitleLabel>Zip</TitleLabel>
          <FormControl data-section={section} name='complainantZip' value={input.complainantZip} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>Relationship to Consumer</TitleLabel>
          <FormControl data-section={section} name='complainantConsumerRelationship' value={input.complainantConsumerRelationship} onChange={handleTextInput} />
        </Col>
        <Col lg={6}>
          <TitleLabel>Phone Number</TitleLabel>
          <FormControl data-section={section} name='complainantPhone' value={input.complainantPhone} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
    </div>
  );
  // (Apt Number, City, County, State, Zip)
}

ComplainantInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
};

export default ComplainantInfoView;
