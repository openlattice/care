/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row } from '../shared/Layout';

const ConsumerInfoView = ({ section, handleInput, handleSingleSelection, handleCheckboxChange, input }) => {

  return (
    <SectionView header='Consumer Information'>
      <Row>
        <ControlLabel>13. Consumer Name (Last, First, MI)
          <FormControl data-section={section} name='13a' value={input['13a']} onChange={handleInput}></FormControl>
        </ControlLabel>
      </Row>
      <Row>
        <ControlLabel>Residence / Address (Include Apartment Number, City, County, State, Zip) if Applicable
          <FormControl data-section={section} name='13b' value={input['13b']} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>Consumer Phone Number
          <FormControl data-section={section} name='13c' value={input['13c']} onChange={handleInput}></FormControl>
        </ControlLabel>
      </Row>

      <ControlLabel>14. Military Status
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='14a'
              value='active'
              checked={input['14a'] === 'active'}
              onChange={handleSingleSelection} />Active
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='14a' 
              value='veteran'
              checked={input['14a'] === 'veteran'}
              onChange={handleSingleSelection} />Veteran
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='14a'
              value='n/a'
              checked={input['14a'] === 'n/a'}
              onChange={handleSingleSelection} />N/A
        </ControlLabel>
        <ControlLabel>Gender
          <FormControl
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
          </FormControl>
        </ControlLabel>
        <ControlLabel>Race
          <FormControl
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
          </FormControl>
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>Age
        <FormControl data-section={section} name='14d' value={input['14d']} onChange={handleInput} />
      </ControlLabel>
      <ControlLabel>DOB
        <FormControl data-section={section} name='14e' value={input['14e']} onChange={handleInput} />
      </ControlLabel>

      <ControlLabel>15. Homeless
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='15a'
              value='yes'
              checked={input['15a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='15a' 
              value='no'
              checked={input['15a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>If Yes, Where Do They Usually Sleep / Frequent?
        <FormControl data-section={section} name='15b' value={input['15b']} onChange={handleInput} />
      </ControlLabel>

      <ControlLabel>16. Consumer Using Drugs, Alcohol, Both (If possible, include type of drugs)
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='16a'
              value='drugs'
              checked={input['16a'] === 'drugs'}
              onChange={handleSingleSelection} />Drugs
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='16a' 
              value='alcohol'
              checked={input['16a'] === 'alcohol'}
              onChange={handleSingleSelection} />Alcohol
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='16a' 
              value='both'
              checked={input['16a'] === 'both'}
              onChange={handleSingleSelection} />Both
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='16a' 
              value='n/a'
              checked={input['16a'] === 'n/a'}
              onChange={handleSingleSelection} />N/A
        </ControlLabel>
        <ControlLabel>Drug type
          <FormControl data-section={section} name='16b' value={input['16b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>17. Is Consumer Prescribed Medication?
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17a'
              value='yes'
              checked={input['17a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17a'
              value='no'
              checked={input['17a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17a' 
              value='unknown'
              checked={input['17a'] === 'unknown'}
              onChange={handleSingleSelection} />Unknown
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>If yes, is Consumer Taking Medication?
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17b'
              value='yes'
              checked={input['17b'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17b' 
              value='no'
              checked={input['17b'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17b' 
              value='unknown'
              checked={input['17b'] === 'unknown'}
              onChange={handleSingleSelection} />Unknown
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>18. Does Consumer Have Previous Psychiatric Hospital Admission?
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={18}
              value='yes'
              checked={input[18] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={18}
              value='no'
              checked={input[18] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={18} 
              value='unknown'
              checked={input[18] === 'unknown'}
              onChange={handleSingleSelection} />Unknown
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>19. Self Diagnosis
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='19a'
              value='bipolar'
              checked={input['19a'].indexOf('bipolar') !== -1}
              onChange={handleCheckboxChange} />Bipolar
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='19a'
              value='depression'
              checked={input['19a'].indexOf('depression') !== -1}
              onChange={handleCheckboxChange} />Depression
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='19a' 
              value='ptsd'
              checked={input['19a'].indexOf('ptsd') !== -1}
              onChange={handleCheckboxChange} />PTSD
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='19a'
              value='schizophrenia'
              checked={input['19a'].indexOf('schizophrenia') !== -1}
              onChange={handleCheckboxChange} />Schizophrenia
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='19a'
              value='dementia'
              checked={input['19a'].indexOf('dementia') !== -1}
              onChange={handleCheckboxChange} />Dementia
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='19a' 
              value='other'
              checked={input['19a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='19b' value={input['19b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>20. Armed with Weapon?
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='20a'
              value='yes'
              checked={input['20a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='20a'
              value='no'
              checked={input['20a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>If Yes, Weapon Type
          <FormControl data-section={section} name='20b' value={input['20b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>21. Have Access to Weapons?
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='21a'
              value='yes'
              checked={input['21a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='21a'
              value='no'
              checked={input['21a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>If Yes, Weapon Type
          <FormControl data-section={section} name='21b' value={input['20b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>22. Observed Behaviors (Check all that apply)
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='disorientation'
              checked={input['22a'].indexOf('disorientation') !== -1}
              onChange={handleCheckboxChange} />Disorientation / Confusion
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='abnormalBehavior'
              checked={input['22a'].indexOf('abnormalBehavior') !== -1}
              onChange={handleCheckboxChange} />Abnormal Behavior / Appearance (neglect self-care)
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a' 
              value='hearingVoices'
              checked={input['22a'].indexOf('hearingVoices') !== -1}
              onChange={handleCheckboxChange} />Hearing Voices / Hallucinating
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='anxious'
              checked={input['22a'].indexOf('anxious') !== -1}
              onChange={handleCheckboxChange} />Anxious / Excited / Agitated
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='depressed'
              checked={input['22a'].indexOf('depressed') !== -1}
              onChange={handleCheckboxChange} />Depressed Mood
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='paranoid'
              checked={input['22a'].indexOf('paranoid') !== -1}
              onChange={handleCheckboxChange} />Paranoid or Suspicious
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='self-mutilation'
              checked={input['22a'].indexOf('self-mutilation') !== -1}
              onChange={handleCheckboxChange} />Self-mutilation
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a' 
              value='threatening'
              checked={input['22a'].indexOf('threatening') !== -1}
              onChange={handleCheckboxChange} />Threatening / Violent Towards Others
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22a'
              value='other'
              checked={input['22a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='22b' value={input['22b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>Emotional State (Check all that apply)
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='angry'
              checked={input['22c'].indexOf('angry') !== -1}
              onChange={handleCheckboxChange} />Angry
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='afraid'
              checked={input['22c'].indexOf('afraid') !== -1}
              onChange={handleCheckboxChange} />Afraid
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c' 
              value='apologetic'
              checked={input['22c'].indexOf('apologetic') !== -1}
              onChange={handleCheckboxChange} />Apologetic
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='calm'
              checked={input['22c'].indexOf('calm') !== -1}
              onChange={handleCheckboxChange} />Calm
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='crying'
              checked={input['22c'].indexOf('crying') !== -1}
              onChange={handleCheckboxChange} />Crying
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c' 
              value='fearful'
              checked={input['22c'].indexOf('fearful') !== -1}
              onChange={handleCheckboxChange} />Fearful
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c' 
              value='nervous'
              checked={input['22c'].indexOf('nervous') !== -1}
              onChange={handleCheckboxChange} />Nervous
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='22c'
              value='other'
              checked={input['22c'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='22d' value={input['22d']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>23. Photos Taken Of:
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={23} 
              value='injuries'
              checked={input[23].indexOf('injuries') !== -1}
              onChange={handleCheckboxChange} />Injuries
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={23} 
              value='propertyDamage'
              checked={input[23].indexOf('propertyDamage') !== -1}
              onChange={handleCheckboxChange} />Property Damage / Crime Scene
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>24. Consumer Injuries
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='abrasions'
              checked={input['24a'].indexOf('abrasions') !== -1}
              onChange={handleCheckboxChange} />Abrasions
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='bruises'
              checked={input['24a'].indexOf('bruises') !== -1}
              onChange={handleCheckboxChange} />Bruises
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='complaintsOfPain'
              checked={input['24a'].indexOf('complaintsOfPain') !== -1}
              onChange={handleCheckboxChange} />Complaints of Pain
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='concussion'
              checked={input['24a'].indexOf('concussion') !== -1}
              onChange={handleCheckboxChange} />Concussion
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='fractures'
              checked={input['24a'].indexOf('fractures') !== -1}
              onChange={handleCheckboxChange} />Fractures
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='24a' 
              value='other'
              checked={input['24a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='24b' value={input['24b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>25. Suicidal
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='25a'
              value='yes'
              checked={input['25a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='25a'
              value='no'
              checked={input['25a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>If Suicidal:
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='thoughts'
              checked={input['25b'].indexOf('thoughts') !== -1}
              onChange={handleCheckboxChange} />Thoughts
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='threat'
              checked={input['25b'].indexOf('threat') !== -1}
              onChange={handleCheckboxChange} />Threat
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='attempt'
              checked={input['25b'].indexOf('attempt') !== -1}
              onChange={handleCheckboxChange} />Attempt
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='25b'
              value='completed'
              checked={input['25b'].indexOf('completed') !== -1}
              onChange={handleCheckboxChange} />Completed
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>26. Method Used to Attempt, Threaten, or Complete Suicide
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='narcotics'
              checked={input['26a'].indexOf('narcotics') !== -1}
              onChange={handleCheckboxChange} />Narcotics (Prescription or Illicit)
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='alcohol'
              checked={input['26a'].indexOf('alcohol') !== -1}
              onChange={handleCheckboxChange} />Alcohol
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='knife'
              checked={input['26a'].indexOf('knife') !== -1}
              onChange={handleCheckboxChange} />Knife / Cutting Tool
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='firearm'
              checked={input['26a'].indexOf('firearm') !== -1}
              onChange={handleCheckboxChange} />Firearm
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='26a'
              value='other'
              checked={input['26a'].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other:
          <FormControl data-section={section} name='26b' value={input['26b']} onChange={handleInput} />
        </ControlLabel>
      </ControlLabel>
    </SectionView>
  );
}

export default ConsumerInfoView;
// NEXT: Add text field for Other checkboxes
// TODO: IF 15 is yes -> send copy of report to Homelessoutreach@BaltimorePolice.org
