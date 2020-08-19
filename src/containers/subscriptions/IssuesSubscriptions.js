// @flow

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { AuthUtils } from 'lattice-auth';
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

import { PERSON_ID_FQN } from '../../edm/DataModelFqns';
import { getPeopleESId, getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';

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
  personEntitySetId :UUID;
  staffEntitySetId :UUID;
  staffQuery :string;
  subscriptions :List;
}

const IssuesSubscriptions = (props :Props) => {
  const {
    actions,
    personEntitySetId,
    staffEntitySetId,
    staffQuery,
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
      if (query === staffQuery) {
        issuesSubscription = subscription;
      }
    });

    setState({ issuesSubscription });
  }, [
    personEntitySetId,
    staffEntitySetId,
    staffQuery,
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
        entitySetIds: [personEntitySetId],
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
        personEntitySetId,
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
      query: staffQuery,
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
  const userInfo :Object = AuthUtils.getUserInfo();
  return {
    staffQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', PERSON_ID_FQN]), userInfo.email),
    personEntitySetId: getPeopleESId(app),
    staffEntitySetId: getStaffESId(app),
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
