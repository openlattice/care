// @flow
import React from 'react';

import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Label,
} from 'lattice-ui-kit';
import { List } from '../../../components/layout';

import LabeledDetail from '../../../components/premium/styled/LabeledDetail';
import * as FQN from '../../../edm/DataModelFqns';
import { inchesToFeetString } from '../../../utils/DataUtils';

const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;

type Props = {
  appearance :Map;
  isLoading :boolean;
  scars :Map;
  selectedPerson :Map;
};

const AppearancePanel = (props :Props) => {
  const {
    appearance,
    isLoading,
    scars,
    selectedPerson
  } = props;

  const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0]);
  const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0]);

  const height = appearance.getIn([FQN.HEIGHT_FQN, 0]);
  const weight = appearance.getIn([FQN.WEIGHT_FQN, 0]);
  const formattedHeight = height ? inchesToFeetString(height) : '';
  const formattedWeight = weight ? `${weight} lbs` : '';
  const hairColor = appearance.getIn([FQN.HAIR_COLOR_FQN, 0]);
  const eyeColor = appearance.getIn([FQN.EYE_COLOR_FQN, 0]);

  const identifiers = scars.getIn([FQN.DESCRIPTION_FQN]);
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={expandIcon}>
          <Label subtle>Appearance</Label>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            <li>
              <LabeledDetail isLoading={isLoading} label="race" content={race} />
            </li>
            <li>
              <LabeledDetail isLoading={isLoading} label="sex" content={sex} />
            </li>
            <li>
              <LabeledDetail isLoading={isLoading} label="height" content={formattedHeight} />
            </li>
            <li>
              <LabeledDetail isLoading={isLoading} label="weight" content={formattedWeight} />
            </li>
            <li>
              <LabeledDetail isLoading={isLoading} label="eye color" content={eyeColor} />
            </li>
            <li>
              <LabeledDetail isLoading={isLoading} label="hair color" content={hairColor} />
            </li>
            <li>
              <LabeledDetail isLoading={isLoading} label="identifiers" content={identifiers} />
            </li>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default AppearancePanel;
