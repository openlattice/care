/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, InputWrapper, TitleLabel } from '../shared/Layout';
import { FLEX } from '../shared/Consts';

const ComplainantInfoView = ({ section, handleInput, input }) => {
  return(
    <SectionView header="Complainant/Next of Kin Information">
      <Row>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>27. Complainant Name (Last, First, MI)</TitleLabel>
          <FormControl data-section={section} name='complainantName' value={input.complainantName} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>Address (Apt Number, City, County, State, Zip)</TitleLabel>
          <FormControl data-section={section} name='complainantAddress' value={input.complainantAddress} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>Relationship to Consumer</TitleLabel>
          <FormControl data-section={section} name='complainantConsumerRelationship' value={input.complainantConsumerRelationship} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>Phone Number</TitleLabel>
          <FormControl data-section={section} name='complainantPhone' value={input.complainantPhone} onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

ComplainantInfoView.propTypes = {
  handleInput: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default ComplainantInfoView;
