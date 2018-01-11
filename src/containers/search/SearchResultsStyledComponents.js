/*
 * @flow
 */

import styled, { css } from 'styled-components';

export const SearchResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 20px 0;
  min-height: 50px; /* height of loading spinner */
  position: relative;
  width: 100%;
`;

export const SearchResult = styled.div`
  align-items: center;
  display: flex;
  justify-content:space-between;
  padding: 20px 0;
  &:hover {
    cursor: pointer;
  }
  &:first-child {
    border-top: none;
  }
  ${(props) => {
    if (props.showDivider === true) {
      return css`
        border-top: 1px solid #c6d5e5;
      `;
    }
    return '';
  }}
`;
