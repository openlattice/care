// @flow
import React from 'react';

import styled from 'styled-components';

const Headline = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

type Props = {
  headline :string;
};

const AdvancedHeader = (props :Props) => {
  const { headline } = props;
  return (
    <Headline>
      {headline}
    </Headline>
  );
};

export default AdvancedHeader;
