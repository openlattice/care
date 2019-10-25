/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faAngleRight, faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { Card, CardSegment, Colors } from 'lattice-ui-kit';

import * as Routes from '../../core/router/Routes';
import { MEDIA_QUERY_MD } from '../../core/style/Sizes';

const { NEUTRALS } = Colors;

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
  color: ${NEUTRALS[0]};
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
`;

const StyledNavCard = styled(CardSegment)`
  justify-content: space-between;
`;

const LinkTextWrapper = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  padding: 0 15px;
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
      <Card onClick={() => {}}>
        <StyledNavLink to={Routes.CRISIS_PATH}>
          <StyledNavCard>
            <LinkTextWrapper>
              <FontAwesomeIcon icon={faFileAlt} size="2x" />
              <LinkText>Crisis Report</LinkText>
            </LinkTextWrapper>
            <FontAwesomeIcon icon={faAngleRight} size="2x" />
          </StyledNavCard>
        </StyledNavLink>
      </Card>
    </Content>
  </ContainerWrapper>
);

// $FlowFixMe
export default HomeContainer;
