/*
 * @flow
 */

import React, { Fragment } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { faAngleRight, faFileAlt } from '@fortawesome/fontawesome-pro-light';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router';

import StyledCard from '../../components/cards/StyledCard';
import * as Routes from '../../core/router/Routes';
import ReportSummariesContainer from '../reportsummaries/ReportSummariesContainer';


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

const NewReportsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

const StyledNavLink = styled(NavLink)`
  color: #135;
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

const TabBarContainer = styled.div`
  display: flex;
  margin: 0 20px;
  width: 100%;
`;

const TabLink = styled(NavLink)`
  border-radius: 3px;
  color: inherit;
  font-size: 18px;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: auto;

  &:hover {
    color: inherit;
    cursor: pointer;
    text-decoration: none;
  }

  &.active {
    background: #dee8f2;
    text-decoration: none;
  }
`;

const TabBar = () => (
  <TabBarContainer>
    <TabLink to={Routes.CREATE_REPORT_PATH}>
      Create Report
    </TabLink>
    <TabLink to={Routes.REPORT_SUMMARIES_PATH}>
      View Reports
    </TabLink>
  </TabBarContainer>
);

const NewReportsList = () => (
  <NewReportsContainer>
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
  </NewReportsContainer>
);

const HomeContainer = () => (
  <ContainerWrapper>
    <Content>
      { TabBar() }
      <Switch>
        <Route exact strict path={Routes.CREATE_REPORT_PATH} component={NewReportsList} />
        <Route path={Routes.REPORT_SUMMARIES_PATH} component={ReportSummariesContainer} />
        <Redirect to={Routes.CREATE_REPORT_PATH} />
      </Switch>
    </Content>
  </ContainerWrapper>
);

export default withRouter(HomeContainer);
