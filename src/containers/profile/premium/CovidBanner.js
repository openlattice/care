// @flow
import React from 'react';

import { Banner } from 'lattice-ui-kit';

type Props = {
  recentSymptoms :boolean
};

const CovidBanner = ({ recentSymptoms } :Props) => {
  return (
    <Banner mode="warning" isOpen={recentSymptoms}>
      Recent COVID-19 symptoms
    </Banner>
  );
};

CovidBanner.defaultProps = {
  recentSymptoms: false
};

export default React.memo<Props>(CovidBanner);
