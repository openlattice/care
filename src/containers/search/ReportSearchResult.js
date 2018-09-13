import React from 'react';
import styled, { css } from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/fontawesome-pro-light';

import { SearchResult } from './SearchResultsStyledComponents';


const BHRDetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  &:hover {
    cursor: pointer;
  }
`;

const BHRDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => {
    if (props.scStyles && props.scStyles.width) {
      return css`
        flex: 0 0 auto;
        width: ${props.scStyles.width};
      `;
    }
    return css`
      flex: 1;
    `;
  }}
  strong {
    font-weight: bold;
  }
`;


const ReportSearchResult = ({ searchResult, onSelectSearchResult, showDivider }) => (
  <SearchResult
      showDivider={showDivider}
      onClick={() => onSelectSearchResult(searchResult)}>
    <BHRDetailsRow>
      <BHRDetailItem scStyles={{ width: '150px' }}>
        <strong>Date Occurred</strong>
        <span>{ searchResult.getIn(['neighborDetails', 'bhr.dateOccurred', 0], '') }</span>
      </BHRDetailItem>
      <BHRDetailItem scStyles={{ width: '150px' }}>
        <strong>Date Reported</strong>
        <span>{ searchResult.getIn(['neighborDetails', 'bhr.dateReported', 0], '') }</span>
      </BHRDetailItem>
      <BHRDetailItem scStyles={{ width: '150px' }}>
        <strong>Complaint Number</strong>
        <span>{ searchResult.getIn(['neighborDetails', 'bhr.complaintNumber', 0], '') }</span>
      </BHRDetailItem>
      <BHRDetailItem>
        <strong>Incident</strong>
        <span>{ searchResult.getIn(['neighborDetails', 'bhr.incident', 0], '') }</span>
      </BHRDetailItem>
    </BHRDetailsRow>
    <FontAwesomeIcon icon={faAngleRight} size="2x" />
  </SearchResult>
);

export default ReportSearchResult;