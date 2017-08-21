/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col } from 'react-bootstrap';

import SectionView from './SectionView';
import { PaddedRow, TitleLabel } from '../shared/Layout';

const ComplaintInfoView = ({ section, handleTextInput, input }) => {
  return(
    <SectionView header="Complaint/Next of Kin Information">
      <PaddedRow>
        <Col lg={3}>
          <TitleLabel>28. Complaint Name (Last, First, MI)</TitleLabel>
          <FormControl data-section={section} name='complainantName' value={input.complainantName} onChange={handleTextInput} />
        </Col>
        <Col lg={3}>
          <TitleLabel>Address (Apt Number, City, County, State, Zip)</TitleLabel>
          <FormControl data-section={section} name='complainantAddress' value={input.complainantAddress} onChange={handleTextInput} />
        </Col>
        <Col lg={3}>
          <TitleLabel>Relationship to Consumer</TitleLabel>
          <FormControl data-section={section} name='complainantConsumerRelationship' value={input.complainantConsumerRelationship} onChange={handleTextInput} />
        </Col>
        <Col lg={3}>
          <TitleLabel>Phone Number</TitleLabel>
          <FormControl data-section={section} name='complainantPhone' value={input.complainantPhone} onChange={handleTextInput} />
        </Col>
      </PaddedRow>
    </SectionView>
  );
}

ComplaintInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
};

export default ComplaintInfoView;
