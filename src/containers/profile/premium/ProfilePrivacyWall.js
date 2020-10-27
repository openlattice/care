// @flow
import React from 'react';
import type { Node } from 'react';

import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { getIn } from 'immutable';
import { Button, IconSplash } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import { AbsoluteCenter } from './styled/layout';

import VisibilityTypes from '../edit/visibility/VisibilityTypes';
import { STATUS_FQN } from '../../../edm/DataModelFqns';

type Props = {
  component :Node;
  hasReports :boolean;
  isAuthorized :boolean;
  isLoading :boolean;
  meetsThreshold :boolean;
  onShow :() => void;
  show :boolean;
};

const ProfilePrivacyWall = ({
  component,
  isAuthorized,
  isLoading,
  meetsThreshold,
  onShow,
  show,
} :Props) => {
  const visibility = useSelector((store) => store.getIn(['profile', 'visibility', 'data']));
  const visibilityStatus = getIn(visibility, [STATUS_FQN, 0]);

  let child = component;

  if (!isLoading) {
    if (visibilityStatus === VisibilityTypes.AUTO || !visibilityStatus) {
      if (!meetsThreshold && !show) {
        const splashCaption = 'Profile does not meet reporting threshold.';
        child = (
          <AbsoluteCenter>
            <IconSplash icon={faFolderOpen} caption={splashCaption} />
            {
              isAuthorized && <Button variant="text" color="primary" onClick={onShow}>Show Content</Button>
            }
          </AbsoluteCenter>
        );
      }
    }
    if (visibilityStatus === VisibilityTypes.PRIVATE && !show) {
      const splashCaption = 'This profile has been made private. Contact an administrator for access.';
      child = (
        <AbsoluteCenter>
          <IconSplash icon={faFolderOpen} caption={splashCaption} />
          {
            isAuthorized && <Button variant="text" color="primary" onClick={onShow}>Show Content</Button>
          }
        </AbsoluteCenter>
      );
    }
  }

  return child;
};

export default ProfilePrivacyWall;
