/*
 * @flow
 */

import React from 'react';

import { List, Map } from 'immutable';
import { Card, CardSegment, Spinner } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import Subscription from './Subscription';
import * as SubscribeActionFactory from './SubscriptionActions';
import { SUBSCRIPTION_TYPE } from './constants';

import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';
import { HOUSING_SITUATION_FQN } from '../../edm/DataModelFqns';
import { getPeopleESId, getReportESId, getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';
import { STATE, SUBSCRIBE } from '../../utils/constants/StateConstants';
import { HOMELESS_STR } from '../pages/natureofcrisis/Constants';

type Props = {
  app :Map,
  isLoadingSubscriptions :boolean,
  subscriptions :List,
  homelessQuery :string,
  actions :{
    createSubscription :Function,
    expireSubscription :Function,
    getSubscriptions :Function,
    updateSubscription :Function
  }
}

type State = {
  homelessSubscription :?Map
};

class SubscribeContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      homelessSubscription: undefined
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getSubscriptions();
  }

  static getDerivedStateFromProps(props) {
    const {
      app,
      subscriptions,
      homelessQuery
    } = props;

    const reportEntitySetId = getReportESId(app);
    const personEntitySetId = getPeopleESId(app);
    const staffEntitySetId = getStaffESId(app);

    let homelessSubscription;

    subscriptions.filter((subscription) => (
      subscription.getIn(['constraints', 'entitySetIds'], List()).includes(reportEntitySetId)
        && subscription.getIn(['alertMetadata', 'personEntitySetId']) === personEntitySetId
        && subscription.getIn(['alertMetadata', 'staffEntitySetId']) === staffEntitySetId
    )).forEach((subscription) => {

      const query = subscription.getIn(['constraints', 'constraints', 0, 'constraints', 0, 'searchTerm']);
      if (query === homelessQuery) {
        homelessSubscription = subscription;
      }
    });

    return {
      homelessSubscription
    };
  }

  createSubscription = ({ query, expiration, timezone }) => {
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
        personEntitySetId,
        staffEntitySetId,
        timezone
      }
    };

    actions.createSubscription(subscription);
  }

  renderSubscription = (title, description, query, subscription) => {
    const { actions } = this.props;

    const timezone = subscription ? subscription.getIn(['alertMetadata', 'timezone']) : undefined;
    const expiration = subscription ? subscription.get('expiration') : undefined;

    return (
      <Subscription
          title={title}
          description={description}
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
    const { homelessQuery } = this.props;
    const { homelessSubscription } = this.state;

    return (
      <>
        {this.renderSubscription(
          'Homeless Alerts',
          'Receive an email when a Crisis Report is marked with "Unsheltered Homeless"',
          homelessQuery,
          homelessSubscription
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

function mapStateToProps(state) {

  return {
    isLoadingSubscriptions: state.getIn([STATE.SUBSCRIPTIONS, SUBSCRIBE.IS_LOADING_SUBSCRIPTIONS]),
    subscriptions: state.getIn([STATE.SUBSCRIPTIONS, SUBSCRIBE.SUBSCRIPTIONS]),
    homelessQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', HOUSING_SITUATION_FQN]), HOMELESS_STR),
    app: state.get('app', Map())
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {};

  Object.keys(SubscribeActionFactory).forEach((action) => {
    actions[action] = SubscribeActionFactory[action];
  });

  return {
    actions: {
      ...bindActionCreators(actions, dispatch)
    }
  };
}

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscribeContainer)
);
