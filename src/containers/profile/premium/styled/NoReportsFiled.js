import React from 'react';

import { faFolderOpen } from '@fortawesome/pro-duotone-svg-icons';
import { IconSplash } from 'lattice-ui-kit';

import { AbsoluteCenter } from './layout';

const NoReportsFiled = () => {
  const splashCaption = 'No reports have been filed.';
  return (
    <AbsoluteCenter>
      <IconSplash icon={faFolderOpen} caption={splashCaption} />
    </AbsoluteCenter>
  );
};

export default NoReportsFiled;
