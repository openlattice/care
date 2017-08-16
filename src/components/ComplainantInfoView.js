/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, Col } from 'react-bootstrap';

import SectionView from './SectionView';
import { PaddedRow, InputWrapper, TitleLabel } from '../shared/Layout';
import { FLEX } from '../shared/Consts';

const ComplainantInfoView = ({ section, handleTextInput, input }) => {
  return(
    <SectionView header="Complainant/Next of Kin Information">
      <PaddedRow>
        <Col lg={3}>
          <TitleLabel>27. Complainant Name (Last, First, MI)</TitleLabel>
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

ComplainantInfoView.propTypes = {
  handleTextInput: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default ComplainantInfoView;
