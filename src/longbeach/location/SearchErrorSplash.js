import React from 'react';

import styled from 'styled-components';
import { faLocationSlash } from '@fortawesome/pro-light-svg-icons';
import { IconSplash } from 'lattice-ui-kit';

const Centered = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const SearchErrorSplash = () => (
  <Centered>
    <IconSplash
        icon={faLocationSlash}
        caption="An error has occured. Please ensure location services are enabled." />
  </Centered>
);

export default SearchErrorSplash;
