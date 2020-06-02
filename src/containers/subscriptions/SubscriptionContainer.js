/*
 * @flow
 */

import React, { Component } from 'react';

import { List, Map } from 'immutable';
import { Card, CardSegment, Spinner } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import Subscription from './Subscription';
import {
  createSubscription,
  expireSubscription,
  getSubscriptions,
  updateSubscription,
} from './SubscriptionActions';
import { ALERT_NAMES, SUBSCRIPTION_TYPE } from './constants';

import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';
import { AFFILIATION_FQN, HOUSING_SITUATION_FQN, MILITARY_STATUS_FQN } from '../../edm/DataModelFqns';
import { getPeopleESId, getReportESId, getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';
import { STATE, SUBSCRIBE } from '../../utils/constants/StateConstants';
import { HOMELESS_STR, UNIVERSITY_OF_IOWA, VETERAN } from '../reports/crisis/schemas/v1/constants';

type AlertMetadata = {
  alertName :string;
  query :string;
  expiration :string;
  timezone :string,
}

type Props = {
  app :Map,
  isLoadingSubscriptions :boolean,
  subscriptions :List,
  homelessQuery :string,
  veteranQuery :string,
  affiliateQuery :string,
  actions :{
    createSubscription :Function,
    expireSubscription :Function,
    getSubscriptions :Function,
    updateSubscription :Function
  }
}

type State = {
  affiliateSubscription :?Map;
  homelessSubscription :?Map;
  veteranSubscription :?Map;
};

class SubscriptionContainer extends Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      affiliateSubscription: undefined,
      homelessSubscription: undefined,
      veteranSubscription: undefined,
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getSubscriptions();
  }

  static getDerivedStateFromProps(props :Props) {
    const {
      affiliateQuery,
      app,
      homelessQuery,
      subscriptions,
      veteranQuery,
    } = props;

    const personEntitySetId = getPeopleESId(app);
    const reportEntitySetId = getReportESId(app);
    const staffEntitySetId = getStaffESId(app);

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

    return {
      affiliateSubscription,
      homelessSubscription,
      veteranSubscription,
    };
  }

  createSubscription = ({
    alertName,
    expiration,
    query,
    timezone,
  } :AlertMetadata) => {
    const { actions, app } = this.props;

    const reportEntitySetId = getReportESId(app);
    const personEntitySetId = getPeopleESId(app);
    const staffEntitySetId = getStaffESId(app);

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
  }

  renderSubscription = (
    title :string,
    description :string,
    alertName :string,
    query :string,
    subscription :?Map
  ) => {
    const { actions } = this.props;

    const timezone = subscription ? subscription.getIn(['alertMetadata', 'timezone']) : undefined;
    const expiration = subscription ? subscription.get('expiration') : undefined;

    return (
      <Subscription
          title={title}
          description={description}
          alertName={alertName}
          query={query}
          subscription={subscription}
          timezone={timezone}
          expiration={expiration}
          onCreate={this.createSubscription}
          onEdit={actions.updateSubscription}
          onCancel={actions.expireSubscription} />
    );
  }

  renderSubscriptions = () => {
    const {
      affiliateQuery,
      homelessQuery,
      veteranQuery,
    } = this.props;
    const {
      affiliateSubscription,
      homelessSubscription,
      veteranSubscription,
    } = this.state;

    return (
      <>
        {this.renderSubscription(
          'Homeless Alerts',
          'Receive an email when a Crisis Report is marked with "Unsheltered Homeless"',
          ALERT_NAMES.HOMELESS,
          homelessQuery,
          homelessSubscription
        )}
        {this.renderSubscription(
          'Veteran Alerts',
          'Receive an email when a Crisis Report is created for a veteran',
          ALERT_NAMES.VETERAN,
          veteranQuery,
          veteranSubscription
        )}
        {this.renderSubscription(
          'University of Iowa Affiliate Alerts',
          'Receive an email when a Crisis Report is created for a University of Iowa affiliate',
          ALERT_NAMES.AFFILIATE,
          affiliateQuery,
          affiliateSubscription
        )}
      </>
    );
  }

  render() {
    const { isLoadingSubscriptions } = this.props;
    const content = isLoadingSubscriptions ? <Spinner /> : this.renderSubscriptions();

    return (
      <ContentOuterWrapper>
        <ContentWrapper>
          <Card>
            <CardSegment vertical>
              <Header>
                Manage Subscriptions
              </Header>
              {content}
            </CardSegment>
          </Card>
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  affiliateQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', AFFILIATION_FQN]), UNIVERSITY_OF_IOWA),
  app: state.get('app', Map()),
  homelessQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', HOUSING_SITUATION_FQN]), HOMELESS_STR),
  isLoadingSubscriptions: state.getIn([STATE.SUBSCRIPTIONS, SUBSCRIBE.IS_LOADING_SUBSCRIPTIONS]),
  subscriptions: state.getIn([STATE.SUBSCRIPTIONS, SUBSCRIBE.SUBSCRIPTIONS]),
  veteranQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', MILITARY_STATUS_FQN]), VETERAN),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    createSubscription,
    expireSubscription,
    getSubscriptions,
    updateSubscription,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionContainer);
