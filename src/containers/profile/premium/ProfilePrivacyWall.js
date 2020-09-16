// @flow
import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';
import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { getIn } from 'immutable';
import { Button, IconSplash } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import VisibilityTypes from '../edit/visibility/VisibilityTypes';
import { STATUS_FQN } from '../../../edm/DataModelFqns';

const PrivacyWallWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: center;
`;

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
  hasReports,
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
    if (visibilityStatus === VisibilityTypes.AUTO) {
      if (!hasReports) {
        const splashCaption = 'No reports have been filed.';
        child = (
          <PrivacyWallWrapper>
            <IconSplash icon={faFolderOpen} caption={splashCaption} />
          </PrivacyWallWrapper>
        );
      }
      else if (!meetsThreshold && !show) {
        const splashCaption = 'Profile does not meet reporting threshold.';
        child = (
          <PrivacyWallWrapper>
            <IconSplash icon={faFolderOpen} caption={splashCaption} />
            {
              isAuthorized && <Button variant="text" color="primary" onClick={onShow}>Show Content</Button>
            }
          </PrivacyWallWrapper>
        );
      }
    }
    if (visibilityStatus === VisibilityTypes.PRIVATE && !show) {
      const splashCaption = 'This profile has been made private. Contact an administrator for access.';
      child = (
        <PrivacyWallWrapper>
          <IconSplash icon={faFolderOpen} caption={splashCaption} />
          {
            isAuthorized && <Button variant="text" color="primary" onClick={onShow}>Show Content</Button>
          }
        </PrivacyWallWrapper>
      );
    }
  }

  return child;
};

export default ProfilePrivacyWall;
