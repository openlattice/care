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

import LabeledDetail from '../../../components/premium/styled/LabeledDetail';
import * as FQN from '../../../edm/DataModelFqns';
import { List } from '../../../components/layout';

const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;

type Props = {
  responsibleUser :Map;
  isLoading :boolean;
};

const AssignedOfficerPanel = (props :Props) => {
  const {
    responsibleUser,
    isLoading,
  } = props;

  const content = responsibleUser.getIn([FQN.PERSON_ID_FQN, 0]) || '---';

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={expandIcon}>
          <Label subtle>Assigned Supervisor</Label>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            <li>
              <LabeledDetail isLoading={isLoading} content={content} />
            </li>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default AssignedOfficerPanel;
