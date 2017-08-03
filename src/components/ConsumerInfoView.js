/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, RadioInput, SelectInput, Label } from '../shared/Layout';

const ConsumerInfoView = ({ section, handleInput, handleSingleSelection, handleCheckboxChange, input }) => {

  return (
    <SectionView header='Consumer Information'>
      <Row>
        <Label>13. Consumer Name (Last, First, MI)</Label>
        <TextInput data-section={section} name='13a' value={input['13a']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>Residence / Address (Include Apartment Number, City, County, State, Zip) if Applicable</Label>
        <TextInput data-section={section} name='13b' value={input['13b']} onChange={handleInput} />
        <Label>Consumer Phone Number</Label>
        <TextInput data-section={section} name='13c' value={input['13c']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>14. Military Status</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='14a'
                value='active'
                checked={input['14a'] === 'active'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Active</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='14a' 
                value='veteran'
                checked={input['14a'] === 'veteran'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Veteran</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='14a'
                value='n/a'
                checked={input['14a'] === 'n/a'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>N/A</Label>

          <Label>Gender</Label>
          <SelectInput
              componentClass='select'
              placeholder='select'
              data-section={section}
              name='14b'
              value={input['14b']}
              onChange={handleSingleSelection}>
            <option value=''>Select</option>
            <option value='female'>Female</option>
            <option value='male'>Male</option>
            <option value='nonbinary'>Non-binary</option>
          </SelectInput>

          <Label>Race</Label>
          <SelectInput
              componentClass='select'
              placeholder='select'
              data-section={section}
              name='14c'
              value={input['14c']}
              onChange={handleSingleSelection}>
            <option value=''>select</option>
            <option value='americanIndian'>American Indian or Alaska Native</option>
            <option value='asian'>Asian</option>
            <option value='black'>Black or African American</option>
            <option value='hispanic'>Hispanic or Latino</option>
            <option value='nativeHawaiian'>Native Hawaiian or Other Pacific Islander</option>
            <option value='white'>White</option>
            <option value='other'>Other</option>
          </SelectInput>

        <Label>Age</Label>
        <TextInput data-section={section} name='14d' value={input['14d']} onChange={handleInput} />

        <Label>DOB</Label>
        <TextInput data-section={section} name='14e' value={input['14e']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>15. Homeless</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='15a'
                value='yes'
                checked={input['15a'] === 'yes'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Yes</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='15a' 
                value='no'
                checked={input['15a'] === 'no'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>No</Label>
        <Label>If Yes, Where Do They Usually Sleep / Frequent?</Label>
        <TextInput data-section={section} name='15b' value={input['15b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>16. Consumer Using Drugs, Alcohol, Both (If possible, include type of drugs)</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='16a'
                value='drugs'
                checked={input['16a'] === 'drugs'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Drugs</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='16a' 
                value='alcohol'
                checked={input['16a'] === 'alcohol'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Alcohol</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='16a' 
                value='both'
                checked={input['16a'] === 'both'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Both</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name ='16a' 
                value='n/a'
                checked={input['16a'] === 'n/a'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>N/A</Label>
          <Label>Drug type</Label>
          <TextInput data-section={section} name='16b' value={input['16b']} onChange={handleInput} />
        </Row>

      <Row>
        <Label>17. Is Consumer Prescribed Medication?</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17a'
                value='yes'
                checked={input['17a'] === 'yes'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Yes</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17a'
                value='no'
                checked={input['17a'] === 'no'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>No</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17a' 
                value='unknown'
                checked={input['17a'] === 'unknown'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Unknown</Label>
        <Label>If yes, is Consumer Taking Medication?</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17b'
                value='yes'
                checked={input['17b'] === 'yes'}
                onChange={handleSingleSelection} />
            <Label>Yes</Label>
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17b' 
                value='no'
                checked={input['17b'] === 'no'}
                onChange={handleSingleSelection} />
            <Label>No</Label>
          </RadioInput>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name='17b' 
                value='unknown'
                checked={input['17b'] === 'unknown'}
                onChange={handleSingleSelection} />
            <Label>Unknown</Label> 
          </RadioInput>
      </Row>

      <Row>
        <Label>18. Does Consumer Have Previous Psychiatric Hospital Admission?</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name={18}
                value='yes'
                checked={input[18] === 'yes'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Yes</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name={18}
                value='no'
                checked={input[18] === 'no'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>No</Label>
          <RadioInput>
            <input
                type='radio'
                data-section={section}
                name={18} 
                value='unknown'
                checked={input[18] === 'unknown'}
                onChange={handleSingleSelection} />
          </RadioInput>
          <Label>Unknown</Label>
      </Row>

      <Row>
        <Label>19. Self Diagnosis</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='bipolar'
                checked={input['19a'].indexOf('bipolar') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>Bipolar</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='depression'
                checked={input['19a'].indexOf('depression') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>Depression</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a' 
                value='ptsd'
                checked={input['19a'].indexOf('ptsd') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>PTSD</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='schizophrenia'
                checked={input['19a'].indexOf('schizophrenia') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>Schizophrenia</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a'
                value='dementia'
                checked={input['19a'].indexOf('dementia') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>Dementia</Label>
          <RadioInput>
            <Checkbox
                data-section={section}
                name='19a' 
                value='other'
                checked={input['19a'].indexOf('other') !== -1}
                onChange={handleCheckboxChange} />
          </RadioInput>
          <Label>Other:</Label>
          <TextInput data-section={section} name='19b' value={input['19b']} onChange={handleInput} />
        </Row>

      <Row>
        <Label>20. Armed with Weapon?</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='20a'
              value='yes'
              checked={input['20a'] === 'yes'}
              onChange={handleSingleSelection} />
        </RadioInput>
        <Label>Yes</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='20a'
              value='no'
              checked={input['20a'] === 'no'}
              onChange={handleSingleSelection} />
        </RadioInput>
        <Label>No</Label>
        <Label>If Yes, Weapon Type</Label>
        <TextInput data-section={section} name='20b' value={input['20b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>21. Have Access to Weapons?</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='21a'
              value='yes'
              checked={input['21a'] === 'yes'}
              onChange={handleSingleSelection} />
          <Label>Yes</Label>
        </RadioInput>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='21a'
              value='no'
              checked={input['21a'] === 'no'}
              onChange={handleSingleSelection} />
          <Label>No</Label>
        </RadioInput>
        <Label>If Yes, Weapon Type</Label>
        <TextInput data-section={section} name='21b' value={input['20b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>22. Observed Behaviors (Check all that apply)</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='disorientation'
              checked={input['22a'].indexOf('disorientation') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Disorientation / Confusion</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='abnormalBehavior'
              checked={input['22a'].indexOf('abnormalBehavior') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Abnormal Behavior / Appearance (neglect self-care)</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a' 
              value='hearingVoices'
              checked={input['22a'].indexOf('hearingVoices') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Hearing Voices / Hallucinating</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='anxious'
              checked={input['22a'].indexOf('anxious') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Anxious / Excited / Agitated</Label>
      </Row>
      <Row>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='depressed'
              checked={input['22a'].indexOf('depressed') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Depressed Mood</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='paranoid'
              checked={input['22a'].indexOf('paranoid') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Paranoid or Suspicious</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='self-mutilation'
              checked={input['22a'].indexOf('self-mutilation') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Self-mutilation</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a' 
              value='threatening'
              checked={input['22a'].indexOf('threatening') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Threatening / Violent Towards Others</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22a'
              value='other'
              checked={input['22a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Other:</Label>
        <TextInput data-section={section} name='22b' value={input['22b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>Emotional State (Check all that apply)</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c'
              value='angry'
              checked={input['22c'].indexOf('angry') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Angry</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c'
              value='afraid'
              checked={input['22c'].indexOf('afraid') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Afraid</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c' 
              value='apologetic'
              checked={input['22c'].indexOf('apologetic') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Apologetic</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c'
              value='calm'
              checked={input['22c'].indexOf('calm') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Calm</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c'
              value='crying'
              checked={input['22c'].indexOf('crying') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Crying</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c' 
              value='fearful'
              checked={input['22c'].indexOf('fearful') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Fearful</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c' 
              value='nervous'
              checked={input['22c'].indexOf('nervous') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Nervous</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='22c'
              value='other'
              checked={input['22c'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Other:</Label>
        <TextInput data-section={section} name='22d' value={input['22d']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>23. Photos Taken Of:</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name={23} 
              value='injuries'
              checked={input[23].indexOf('injuries') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Injuries</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name={23} 
              value='propertyDamage'
              checked={input[23].indexOf('propertyDamage') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Property Damage / Crime Scene</Label>
      </Row>

      <Row>
        <Label>24. Consumer Injuries</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='24a' 
              value='abrasions'
              checked={input['24a'].indexOf('abrasions') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Abrasions</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='24a' 
              value='bruises'
              checked={input['24a'].indexOf('bruises') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Bruises</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='24a' 
              value='complaintsOfPain'
              checked={input['24a'].indexOf('complaintsOfPain') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Complaints of Pain</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='24a' 
              value='concussion'
              checked={input['24a'].indexOf('concussion') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Concussion</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='24a' 
              value='fractures'
              checked={input['24a'].indexOf('fractures') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Fractures</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='24a' 
              value='other'
              checked={input['24a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Other:</Label>
        <TextInput data-section={section} name='24b' value={input['24b']} onChange={handleInput} />
      </Row>

      <Row>
        <Label>25. Suicidal</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='25a'
              value='yes'
              checked={input['25a'] === 'yes'}
              onChange={handleSingleSelection} />
        </RadioInput>
        <Label>Yes</Label>
        <RadioInput>
          <input
              type='radio'
              data-section={section}
              name='25a'
              value='no'
              checked={input['25a'] === 'no'}
              onChange={handleSingleSelection} />
        </RadioInput>
        <Label>No</Label>
      </Row>

      <Row>
        <Label>If Suicidal:</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='25b'
              value='thoughts'
              checked={input['25b'].indexOf('thoughts') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Thoughts</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='25b'
              value='threat'
              checked={input['25b'].indexOf('threat') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Threat</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='25b'
              value='attempt'
              checked={input['25b'].indexOf('attempt') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Attempt</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='25b'
              value='completed'
              checked={input['25b'].indexOf('completed') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Completed</Label>
      </Row>

      <Row>
        <Label>26. Method Used to Attempt, Threaten, or Complete Suicide</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='26a'
              value='narcotics'
              checked={input['26a'].indexOf('narcotics') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Narcotics (Prescription or Illicit)</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='26a'
              value='alcohol'
              checked={input['26a'].indexOf('alcohol') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Alcohol</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='26a'
              value='knife'
              checked={input['26a'].indexOf('knife') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Knife / Cutting Tool</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='26a'
              value='firearm'
              checked={input['26a'].indexOf('firearm') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Firearm</Label>
        <RadioInput>
          <Checkbox
              data-section={section}
              name='26a'
              value='other'
              checked={input['26a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />
        </RadioInput>
        <Label>Other:</Label>
        <TextInput data-section={section} name='26b' value={input['26b']} onChange={handleInput} />
      </Row>
    </SectionView>
  );
}

export default ConsumerInfoView;
// TODO: IF 15 is yes -> send copy of report to Homelessoutreach@BaltimorePolice.org
