// @flow
import React from 'react';

import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Label,
  Skeleton,
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import File from './File';

import { List } from '../../../components/layout';

const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;

const FilesPanel = () => {
  const files = useSelector((store) => store.getIn(['profile', 'documents', 'data']));
  const isLoading = useSelector(
    (store) => store.getIn(['profile', 'documents', 'fetchState']) === RequestStates.PENDING
  );

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={expandIcon}>
          <Label subtle>Files</Label>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            { isLoading && <Skeleton /> }
            {
              files.map((file) => <File file={file} />)
            }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default FilesPanel;
