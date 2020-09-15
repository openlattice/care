// @flow
import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';
import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { Button, IconSplash } from 'lattice-ui-kit';

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

  let child = component;

  if (!isLoading) {
    if (!hasReports) {
      const splashCaption = 'No reports have been filed.';
      child = (
        <PrivacyWallWrapper>
          <IconSplash icon={faFolderOpen} caption={splashCaption} />
        </PrivacyWallWrapper>
      );
    }
    if (!meetsThreshold && !show) {
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

  return child;
};

export default ProfilePrivacyWall;
