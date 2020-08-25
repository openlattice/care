// @flow

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { CardStack } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { UUID } from 'lattice';
import type { Dispatch } from 'redux';

import Subscription from './Subscription';
import {
  createSubscription,
  expireSubscription,
  updateSubscription,
} from './SubscriptionActions';
import { ALERT_NAMES, ISSUE_ALERT_TYPE } from './constants';

import { ASSIGNEE_ID_FQN, OPENLATTICE_ID_FQN } from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';

const {
  ASSIGNED_TO_FQN,
  ISSUE_FQN,
  PEOPLE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

const Header = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 20px 0;
`;

type Props = {
  actions :{
    createSubscription :Function;
    expireSubscription :Function;
    updateSubscription :Function;
  };
  assignedToEntitySetId :UUID;
  assigneeQuery :string;
  issueEntitySetId :UUID;
  personEntitySetId :UUID;
  reportedEntitySetId :UUID;
  staffEntitySetId :UUID;
  subscriptions :List;
}

const IssuesSubscriptions = (props :Props) => {
  const {
    actions,
    assignedToEntitySetId,
    assigneeQuery,
    issueEntitySetId,
    personEntitySetId,
    reportedEntitySetId,
    staffEntitySetId,
    subscriptions,
  } = props;

  const [state, setState] = useState({
    issuesSubscription: undefined,
  });

  useEffect(() => {

    let issuesSubscription;

    subscriptions.filter((subscription) => (
      subscription.getIn(['constraints', 'entitySetIds'], List()).includes(personEntitySetId)
        && subscription.getIn(['alertMetadata', 'personEntitySetId']) === personEntitySetId
        && subscription.getIn(['alertMetadata', 'staffEntitySetId']) === staffEntitySetId
    )).forEach((subscription) => {

      const query = subscription.getIn(['constraints', 'constraints', 0, 'constraints', 0, 'searchTerm']);
      if (query === assigneeQuery) {
        issuesSubscription = subscription;
      }
    });

    setState({ issuesSubscription });
  }, [
    personEntitySetId,
    staffEntitySetId,
    assigneeQuery,
    subscriptions,
  ]);

  const onCreate = ({
    alertName,
    expiration,
    query,
    timezone,
  } :any) => {

    const subscription = {
      expiration,
      type: ISSUE_ALERT_TYPE,
      constraints: {
        entitySetIds: [issueEntitySetId],
        start: 0,
        maxHits: 10000,
        constraints: [{
          constraints: [{
            searchTerm: query,
            fuzzy: false
          }]
        }]
      },
      alertMetadata: {
        alertName,
        assignedToEntitySetId,
        issueEntitySetId,
        reportedEntitySetId,
        staffEntitySetId,
        timezone,
      }
    };

    actions.createSubscription(subscription);
  };

  const {
    issuesSubscription,
  } = state;

  const subscriptionDefinitions = [
    {
      title: 'Issue Assignment',
      description: 'Receive an email when an issue is assigned to you.',
      alertName: ALERT_NAMES.ISSUE,
      query: assigneeQuery,
      subscription: issuesSubscription
    },
  ];

  return (
    <>
      <Header>
        Issues
      </Header>
      <CardStack>
        {
          subscriptionDefinitions.map((definition) => {
            const {
              title,
              description,
              alertName,
              query,
              subscription,
            } = definition;
            return (
              <Subscription
                  alertName={alertName}
                  description={description}
                  key={alertName}
                  onCancel={actions.expireSubscription}
                  onCreate={onCreate}
                  onEdit={actions.updateSubscription}
                  query={query}
                  subscription={subscription}
                  title={title} />
            );
          })
        }
      </CardStack>
    </>
  );
};

const mapStateToProps = (state :Map) => {
  const app = state.get('app', Map());
  const currentUserEKID = state.getIn(['staff', 'currentUser', 'data', OPENLATTICE_ID_FQN, 0]);
  return {
    assigneeQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', ASSIGNEE_ID_FQN]), currentUserEKID),
    assignedToEntitySetId: getESIDFromApp(app, ASSIGNED_TO_FQN),
    issueEntitySetId: getESIDFromApp(app, ISSUE_FQN),
    personEntitySetId: getESIDFromApp(app, PEOPLE_FQN),
    reporterEntitySetId: getESIDFromApp(app, REPORTED_FQN),
    staffEntitySetId: getESIDFromApp(app, STAFF_FQN),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    createSubscription,
    expireSubscription,
    updateSubscription,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(IssuesSubscriptions);
