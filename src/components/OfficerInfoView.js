/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';

const OfficerInfoView = ({ section, handleInput, handleCheckboxChange, input }) => {
  return(
    <SectionView header="Officer Information">
      <ControlLabel>32. Officer Name
        <FormControl data-section={section} name={32} value={input[32]} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>34. Seq ID
        <FormControl data-section={section} name={34} value={input[34]} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>35. Officer Injuries
        <FormControl data-section={section} name={35} value={input[35]} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>36. Officer Certification
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={36}
              value='crtUnit'
              checked={input[36].indexOf('crtUnit') !== -1}
              onChange={handleCheckboxChange} />CRT Unit
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={36}
              value='best'
              checked={input[36].indexOf('best') !== -1}
              onChange={handleCheckboxChange} />BEST
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={36}
              value='cit'
              checked={input[36].indexOf('cit') !== -1}
              onChange={handleCheckboxChange} />CIT
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={36}
              value='n/a'
              checked={input[36].indexOf('n/a') !== -1}
              onChange={handleCheckboxChange} />N/A
        </ControlLabel>
      </ControlLabel>
    </SectionView>
  );
}

export default OfficerInfoView;
