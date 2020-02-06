import React, { Component } from 'react';

import styled from 'styled-components';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'lattice-ui-kit';

const MarginWrapper = styled.span`
  margin-left: 5px;
`;

const InfoIcon = React.forwardRef(function InfoIcon(props, ref) {
  return (
    <span {...props} ref={ref}>
      <FontAwesomeIcon icon={faInfoCircle} fixedWidth />
    </span>
  );
});

class TooltipIcon extends Component {
  render() {
    return (
      <MarginWrapper>
        <Tooltip
            arrow
            placement="top"
            title="Search by phonetic pronunciation">
          <InfoIcon />
        </Tooltip>
      </MarginWrapper>
    );
  }
};

export default TooltipIcon;
