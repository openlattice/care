/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';

import SectionView from './SectionView';
import { Row, Label, TextInput, RadioInput } from '../shared/Layout';

const ReportInfoView = ({ section, handleInput, handleSingleSelection, input }) => {

	return (
		<SectionView header='Report Information'>

      <Row>
  		  <Label>1. Primary Reason for Dispatch</Label>
        <TextInput data-section={section} name='1' value={input[1]} onChange={handleInput} />
        <Label>2. Complaint Number</Label>
        <TextInput data-section={section} name='2' value={input[2]} onChange={handleInput} />
        <Label>3. Comparison Offense Report Prepared</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='3'
                value='yes'
                checked={input[3] === 'yes'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Yes</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name ='3'
              value='no'
              checked={input[3] === 'no'}
              onChange={handleSingleSelection} />
        </RadioInput>
        <Label>No</Label>
      </Row>

      <Row>
        <Label>4. Crime / Incident</Label>
        <TextInput data-section={section} name='4' value={input[4]} onChange={handleInput} />
        <Label>5. Location of Offense / Incident (exact street address, if applicable)</Label>
        <TextInput data-section={section} name='5' value={input[5]} onChange={handleInput} />
      </Row>

      <Row>
        <Label>6. Unit</Label>
        <TextInput data-section={section} name='6' value={input[6]} onChange={handleInput} />
        <Label>7. Post of Occurrence</Label>
        <TextInput data-section={section} name='7' value={input[7]} onChange={handleInput} />
        <Label>8. CAD Number</Label>
        <TextInput data-section={section} name='8' value={input[8]} onChange={handleInput} />
      </Row>

      <Row>
        <Label>9. On View</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='9'
              value='yes'
              onChange={handleSingleSelection} />
        </RadioInput>
        <Label>Yes</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name ='9'
              value='no'
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </RadioInput>
        <Label>10. Date / Time Occurred</Label>
        <TextInput data-section={section} name='10' value={input[10]} onChange={handleInput} />
        <Label>11. Date / Time Reported</Label>
        <TextInput data-section={section} name='11' value={input[11]} onChange={handleInput} />
      </Row>
		</SectionView>

	);
}

export default ReportInfoView;
