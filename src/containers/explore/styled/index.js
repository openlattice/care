import styled from 'styled-components';

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

export {
  DetailWrapper,
  ExploreResultsWrapper,
  WordBreak,
};
