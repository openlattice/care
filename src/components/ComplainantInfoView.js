/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col } from 'react-bootstrap';

import FormNav from './FormNav';
import { PaddedRow, TitleLabel, SectionHeader } from '../shared/Layout';
import { FORM_PATHS } from '../shared/Consts';

const ComplainantInfoView = ({ section, handleTextInput, input, isInReview, handlePageChange }) => {
  return(
    <div>
      { !isInReview() ? <SectionHeader>Complainant</SectionHeader> : null}

      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>28. Last Name</TitleLabel>
          <FormControl data-section={section} name='complainantLastName' value={input.complainantLastName} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>First Name</TitleLabel>
          <FormControl data-section={section} name='complainantFirstName' value={input.complainantFirstName} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>Middle Name</TitleLabel>
          <FormControl data-section={section} name='complainantMiddleName' value={input.complainantMiddleName} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={12}>
          <TitleLabel>Address</TitleLabel>
          <FormControl data-section={section} name='complainantStreet' value={input.complainantStreet} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>City</TitleLabel>
          <FormControl data-section={section} name='complainantCity' value={input.complainantCity} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>State</TitleLabel>
          <FormControl data-section={section} name='complainantState' value={input.complainantState} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>County</TitleLabel>
          <FormControl data-section={section} name='complainantCounty' value={input.complainantCounty} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>Zip</TitleLabel>
          <FormControl data-section={section} name='complainantZip' value={input.complainantZip} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>
      <PaddedRow>
        <Col lg={6}>
          <TitleLabel>Relationship to Consumer</TitleLabel>
          <FormControl data-section={section} name='complainantConsumerRelationship' value={input.complainantConsumerRelationship} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
        <Col lg={6}>
          <TitleLabel>Phone Number</TitleLabel>
          <FormControl data-section={section} name='complainantPhone' value={input.complainantPhone} onChange={handleTextInput} disabled={isInReview()} />
        </Col>
      </PaddedRow>

      <FormNav prevPath={FORM_PATHS.CONSUMER} nextPath={FORM_PATHS.DISPOSITION} handlePageChange={handlePageChange} />
    </div>
  );
}

ComplainantInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
};

export default ComplainantInfoView;
