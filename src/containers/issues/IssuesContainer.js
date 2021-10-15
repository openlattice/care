// @flow

import React from 'react';

import { CardStack } from 'lattice-ui-kit';
import { Redirect, Route, Switch } from 'react-router-dom';

import FilteredIssues from './FilteredIssues';
import Issue from './issue/Issue';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { ISSUES_PATH, ISSUE_PATH } from '../../core/router/Routes';

const IssuesContainer = () => (
  <ContentOuterWrapper>
    <ContentWrapper>
      <CardStack>
        <Switch>
          <Route path={ISSUES_PATH} exact strict component={FilteredIssues} />
          <Route exact path={ISSUE_PATH} component={Issue} />
          <Redirect to={ISSUES_PATH} />
        </Switch>
      </CardStack>
    </ContentWrapper>
  </ContentOuterWrapper>
);

export default IssuesContainer;
