/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, Label, TitleLabel, CheckboxLabel, InlineCheckbox, InputWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts';


const OfficerInfoView = ({ section, handleInput, handleCheckboxChange, input }) => {
  return(
    <SectionView header="Officer Information">
      <Row>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>32. Officer Name</TitleLabel>
          <FormControl data-section={section} name={32} value={input[32]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>34. Seq ID</TitleLabel>
          <FormControl data-section={section} name={34} value={input[34]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>35. Officer Injuries</TitleLabel>
          <FormControl data-section={section} name={35} value={input[35]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX.COL_1_4}>
          <TitleLabel>36. Officer Certification</TitleLabel>
          <InlineCheckbox
              inline
              data-section={section}
              name={36}
              value='crtUnit'
              checked={input[36].indexOf('crtUnit') !== -1}
              onChange={handleCheckboxChange}>CRT Unit</InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name={36}
              value='best'
              checked={input[36].indexOf('best') !== -1}
              onChange={handleCheckboxChange}>BEST</InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name={36}
              value='cit'
              checked={input[36].indexOf('cit') !== -1}
              onChange={handleCheckboxChange}>CIT</InlineCheckbox>
          <InlineCheckbox
              inline
              data-section={section}
              name={36}
              value='n/a'
              checked={input[36].indexOf('n/a') !== -1}
              onChange={handleCheckboxChange}>N/A</InlineCheckbox>
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

OfficerInfoView.propTypes = {
  handleInput: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  input: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired
}

export default OfficerInfoView;
