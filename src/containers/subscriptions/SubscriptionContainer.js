// @flow

import React, { useEffect, useState } from 'react';

import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  CardStack,
  Spinner
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { UUID } from 'lattice';
import type { Dispatch } from 'redux';

import Subscription from './Subscription';
import {
  clearSubscriptions,
  createSubscription,
  expireSubscription,
  getSubscriptions,
  updateSubscription,
} from './SubscriptionActions';
import { ADDITIONAL_ALERT_TYPES, ALERT_NAMES, SUBSCRIPTION_TYPE } from './constants';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';
import { AFFILIATION_FQN, HOUSING_SITUATION_FQN, MILITARY_STATUS_FQN } from '../../edm/DataModelFqns';
import { getPeopleESId, getReportESId, getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';
import { STATE, SUBSCRIBE } from '../../utils/constants/StateConstants';
import { HOMELESS_STR, UNIVERSITY_OF_IOWA, VETERAN } from '../reports/crisis/schemas/v1/constants';

type Props = {
  actions :{
    clearSubscriptions :Function;
    createSubscription :Function;
    expireSubscription :Function;
    getSubscriptions :Function;
    updateSubscription :Function;
  };
  affiliateQuery :string;
  homelessQuery :string;
  isLoadingSubscriptions :boolean;
  personEntitySetId :UUID;
  reportEntitySetId :UUID;
  staffEntitySetId :UUID;
  subscriptions :List;
  veteranQuery :string;
}

const SubscriptionContainer = (props :Props) => {
  const {
    actions,
    affiliateQuery,
    homelessQuery,
    personEntitySetId,
    reportEntitySetId,
    staffEntitySetId,
    subscriptions,
    veteranQuery,
  } = props;

  const settings = useAppSettings();
  const hasAffiliateSubscription = settings
    .getIn(['additionalSubscriptions', ADDITIONAL_ALERT_TYPES.UNIVERSITY_OF_IOWA_AFFILIATE], false);

  const [state, setState] = useState({
    affiliateSubscription: undefined,
    homelessSubscription: undefined,
    veteranSubscription: undefined,
  });

  useEffect(() => {
    actions.getSubscriptions();

    return () => {
      actions.clearSubscriptions();
    };
  }, [actions]);

  useEffect(() => {

    let affiliateSubscription;
    let homelessSubscription;
    let veteranSubscription;

    subscriptions.filter((subscription) => (
      subscription.getIn(['constraints', 'entitySetIds'], List()).includes(reportEntitySetId)
        && subscription.getIn(['alertMetadata', 'personEntitySetId']) === personEntitySetId
        && subscription.getIn(['alertMetadata', 'staffEntitySetId']) === staffEntitySetId
    )).forEach((subscription) => {

      const query = subscription.getIn(['constraints', 'constraints', 0, 'constraints', 0, 'searchTerm']);
      if (query === affiliateQuery) {
        affiliateSubscription = subscription;
      }
      if (query === homelessQuery) {
        homelessSubscription = subscription;
      }
      if (query === veteranQuery) {
        veteranSubscription = subscription;
      }
    });

    setState({
      affiliateSubscription,
      homelessSubscription,
      veteranSubscription,
    });
  }, [
    affiliateQuery,
    homelessQuery,
    personEntitySetId,
    reportEntitySetId,
    staffEntitySetId,
    subscriptions,
    veteranQuery,
  ]);

  const onCreate = ({
    alertName,
    expiration,
    query,
    timezone,
  } :any) => {

    const subscription = {
      expiration,
      type: SUBSCRIPTION_TYPE,
      constraints: {
        entitySetIds: [reportEntitySetId],
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
        timezone
      }
    };

    actions.createSubscription(subscription);
  };

  const { isLoadingSubscriptions } = props;
  const {
    affiliateSubscription,
    homelessSubscription,
    veteranSubscription,
  } = state;

  const subscriptionDefinitions = [
    {
      title: 'Homeless Alerts',
      description: 'Receive an email when a Crisis Report is marked with "Unsheltered Homeless"',
      alertName: ALERT_NAMES.HOMELESS,
      query: homelessQuery,
      subscription: homelessSubscription
    },
    {
      title: 'Veteran Alerts',
      description: 'Receive an email when a Crisis Report is created for a veteran',
      alertName: ALERT_NAMES.VETERAN,
      query: veteranQuery,
      subscription: veteranSubscription
    },
  ];

  if (hasAffiliateSubscription) {
    subscriptionDefinitions.push(
      {
        title: 'University of Iowa Affiliate Alerts',
        description: 'Receive an email when a Crisis Report is created for a University of Iowa affiliate',
        alertName: ALERT_NAMES.UNIVERSITY_OF_IOWA_AFFILIATE,
        query: affiliateQuery,
        subscription: affiliateSubscription
      }
    );
  }

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <Card>
          <CardSegment vertical>
            <Header>
              Manage Subscriptions
            </Header>
            <CardStack>
              {
                isLoadingSubscriptions
                  ? <Spinner />
                  : subscriptionDefinitions.map((definition) => {
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
          </CardSegment>
        </Card>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

const mapStateToProps = (state :Map) => {
  const app = state.get('app', Map());
  return {
    affiliateQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', AFFILIATION_FQN]), UNIVERSITY_OF_IOWA),
    homelessQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', HOUSING_SITUATION_FQN]), HOMELESS_STR),
    isLoadingSubscriptions: state.getIn([STATE.SUBSCRIPTIONS, 'fetchState']) === RequestStates.PENDING,
    personEntitySetId: getPeopleESId(app),
    reportEntitySetId: getReportESId(app),
    staffEntitySetId: getStaffESId(app),
    subscriptions: state.getIn([STATE.SUBSCRIPTIONS, SUBSCRIBE.SUBSCRIPTIONS]),
    veteranQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', MILITARY_STATUS_FQN]), VETERAN),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearSubscriptions,
    createSubscription,
    expireSubscription,
    getSubscriptions,
    updateSubscription,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionContainer);
