import styled, { css } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { Link } from 'react-router-dom';

const { NEUTRALS, PURPLES } = Colors;

const breadcrumbStyle = css`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const BreadcrumbLink = styled(Link)`
  ${breadcrumbStyle};
  color: ${PURPLES[1]};
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

const BreadcrumbItem = styled.span`
  ${breadcrumbStyle};
  color: ${NEUTRALS[1]};
`;

const BreadcrumbsWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
`;

export {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbsWrapper,
};
