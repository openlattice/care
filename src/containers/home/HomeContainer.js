/*
 * @flow
 */

import React from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { faAngleRight, faFileAlt } from '@fortawesome/fontawesome-pro-light';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import StyledCard from '../../components/cards/StyledCard';
import * as Routes from '../../core/router/Routes';

/*
 * styled components
 */

const ContainerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  width: 900px;
`;

const StyledNavLink = styled(NavLink)`
  color: #113355;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-decoration: none;
    > div {
      border-color: #95aabf;
    }
  }
`;

const StyledNavCard = StyledCard.extend`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkTextWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const LinkText = styled.span`
  font-size: 18px;
  margin-left: 20px;
`;

const HomeContainer = () => (
  <ContainerWrapper>
    <Content>
      <StyledNavLink to={Routes.BHR}>
        <StyledNavCard>
          <LinkTextWrapper>
            <FontAwesomeIcon icon={faFileAlt} size="2x" />
            <LinkText>Behavioral Health Report</LinkText>
          </LinkTextWrapper>
          <FontAwesomeIcon icon={faAngleRight} size="2x" />
        </StyledNavCard>
      </StyledNavLink>
      <StyledNavLink to={Routes.FOLLOW_UP_PATH} style={{ marginTop: '25px' }}>
        <StyledNavCard>
          <LinkTextWrapper>
            <FontAwesomeIcon icon={faFileAlt} size="2x" />
            <LinkText>Follow-Up Report</LinkText>
          </LinkTextWrapper>
          <FontAwesomeIcon icon={faAngleRight} size="2x" />
        </StyledNavCard>
      </StyledNavLink>
    </Content>
  </ContainerWrapper>
);

export default withRouter(
  connect()(HomeContainer)
);
