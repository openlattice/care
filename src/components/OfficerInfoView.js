/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, Label } from '../shared/Layout';


const OfficerInfoView = ({ section, handleInput, handleCheckboxChange, input }) => {
  return(
    <SectionView header="Officer Information">
      <Row>
        <Label>32. Officer Name</Label>
        <TextInput data-section={section} name={32} value={input[32]} onChange={handleInput} />
        <Label>34. Seq ID</Label>
        <TextInput data-section={section} name={34} value={input[34]} onChange={handleInput} />
        <Label>35. Officer Injuries</Label>
        <TextInput data-section={section} name={35} value={input[35]} onChange={handleInput} />
      </Row>

      <Row>
        <Label>36. Officer Certification</Label>
        <Checkbox
            data-section={section}
            name={36}
            value='crtUnit'
            checked={input[36].indexOf('crtUnit') !== -1}
            onChange={handleCheckboxChange} />
        <Label>CRT Unit</Label>
        <Checkbox
            data-section={section}
            name={36}
            value='best'
            checked={input[36].indexOf('best') !== -1}
            onChange={handleCheckboxChange} />
        <Label>BEST</Label>
        <Checkbox
            data-section={section}
            name={36}
            value='cit'
            checked={input[36].indexOf('cit') !== -1}
            onChange={handleCheckboxChange} />
        <Label>CIT</Label>
        <Checkbox
            data-section={section}
            name={36}
            value='n/a'
            checked={input[36].indexOf('n/a') !== -1}
            onChange={handleCheckboxChange} />
        <Label>N/A</Label>
      </Row>
    </SectionView>
  );
}

export default OfficerInfoView;
