import styled from 'styled-components';
import { CardSegment, StyleUtils } from 'lattice-ui-kit';

const { media } = StyleUtils;

const StyledSegment = styled(CardSegment)`
  ${media.phone`
    flex-direction: column;
    padding: 10px 15px;
  `}
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 16px;
  margin: 0 30px;
  min-width: 0;
  ${media.phone`
    font-size: 12px;
    margin: 0 10px;
  `}
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  ${media.phone`
    font-size: 16px;
  `}
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1;
`;

export {
  StyledSegment,
  Details,
  Name,
  FlexRow,
};
