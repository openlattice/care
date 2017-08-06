/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import SectionView from './SectionView';
import { Row, TextInput, Label, TitleLabel, CheckboxLabel, InlineCheckbox, InputWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts';


const OfficerInfoView = ({ section, handleInput, handleCheckboxChange, input }) => {
  return(
    <SectionView header="Officer Information">
      <Row>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>32. Officer Name</TitleLabel>
          <TextInput data-section={section} name={32} value={input[32]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>34. Seq ID</TitleLabel>
          <TextInput data-section={section} name={34} value={input[34]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>35. Officer Injuries</TitleLabel>
          <TextInput data-section={section} name={35} value={input[35]} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>36. Officer Certification</TitleLabel>
          <InlineCheckbox
              data-section={section}
              name={36}
              value='crtUnit'
              checked={input[36].indexOf('crtUnit') !== -1}
              onChange={handleCheckboxChange} />
          <Label>CRT Unit</Label>
          <InlineCheckbox
              data-section={section}
              name={36}
              value='best'
              checked={input[36].indexOf('best') !== -1}
              onChange={handleCheckboxChange} />
          <Label>BEST</Label>
          <InlineCheckbox
              data-section={section}
              name={36}
              value='cit'
              checked={input[36].indexOf('cit') !== -1}
              onChange={handleCheckboxChange} />
          <Label>CIT</Label>
          <InlineCheckbox
              data-section={section}
              name={36}
              value='n/a'
              checked={input[36].indexOf('n/a') !== -1}
              onChange={handleCheckboxChange} />
          <Label>N/A</Label>
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default OfficerInfoView;
