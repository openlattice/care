import React from 'react';

import styled from 'styled-components';
import { IconSplash } from 'lattice-ui-kit';

const ExploreResultsWrapper = styled.div`
  margin: 20px 0;
`;

const DetailWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  > span {
    min-width: 100px;
  }
`;

const WordBreak = styled.div`
  word-break: break-all;
  min-width: 0;
`;

const NoResults = () => <IconSplash caption="No results" />;

export {
  DetailWrapper,
  ExploreResultsWrapper,
  NoResults,
  WordBreak,
};
