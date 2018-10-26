/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faAngleRight, faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import StyledCard from '../../components/cards/StyledCard';
import * as Routes from '../../core/router/Routes';
import { MEDIA_QUERY_MD } from '../../core/style/Sizes';

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
  max-width: 900px;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    margin-top: 50px;
  }
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

  &:not(:first-child) {
    margin-top: 25px;
  }
`;

const StyledNavCard = styled(StyledCard)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkTextWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const LinkText = styled.span`
  font-size: 14px;
  padding: 0 15px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    font-size: 18px;
    padding: 0 20px;
  }
`;

const HomeContainer = () => (
  <ContainerWrapper>
    <Content>
      <StyledNavLink to={Routes.BHR_PATH}>
        <StyledNavCard>
          <LinkTextWrapper>
            <FontAwesomeIcon icon={faFileAlt} size="2x" />
            <LinkText>Behavioral Health Report</LinkText>
          </LinkTextWrapper>
          <FontAwesomeIcon icon={faAngleRight} size="2x" />
        </StyledNavCard>
      </StyledNavLink>
      <StyledNavLink to={Routes.CRISIS_PATH}>
        <StyledNavCard>
          <LinkTextWrapper>
            <FontAwesomeIcon icon={faFileAlt} size="2x" />
            <LinkText>Crisis Template</LinkText>
          </LinkTextWrapper>
          <FontAwesomeIcon icon={faAngleRight} size="2x" />
        </StyledNavCard>
      </StyledNavLink>
      <StyledNavLink to={Routes.FOLLOW_UP_PATH}>
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
