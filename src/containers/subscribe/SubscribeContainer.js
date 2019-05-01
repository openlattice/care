/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { List, Map } from 'immutable';

import StyledCheckbox from '../../components/controls/StyledCheckbox';
import Spinner from '../../components/spinner/Spinner';
import Subscription from '../../components/subscribe/Subscription';

import {
  FormWrapper,
  FormSection,
  FormSectionWithValidation,
  Header,
  IndentWrapper,
  RequiredField
} from '../../components/crisis/FormComponents';

import { PERSON_SSN_LAST_4_FQN, HOUSING_SITUATION_FQN } from '../../edm/DataModelFqns';
import { STATE, SUBSCRIBE } from '../../utils/constants/StateConstants';
import { HOMELESS_STR } from '../pages/natureofcrisis/Constants';
import { TEST_SSN, SUBSCRIPTION_TYPE } from './SubscribeConstants';
import { getInvalidFields } from './SubscribeReducer';
import { getPeopleESId, getReportESId, getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';
import * as SubscribeActionFactory from './SubscribeActionFactory';

type Props = {
  app :Map,
  isLoadingSubscriptions :boolean,
  subscriptions :List,
  testQuery :string,
  homelessQuery :string,
  actions :{
    createSubscription :Function,
    expireSubscription :Function,
    getSubscriptions :Function,
    updateSubscription :Function
  }
}

type State = {
  testSubscription :?Map,
  homelessSubscription :?Map
};

class SubscribeContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      testSubscription: undefined,
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
      testQuery,
      homelessQuery
    } = props;

    const reportEntitySetId = getReportESId(app);
    const personEntitySetId = getPeopleESId(app);
    const staffEntitySetId = getStaffESId(app);

    let testSubscription;
    let homelessSubscription;

    subscriptions.filter(subscription => (
      subscription.getIn(['constraints', 'entitySetIds'], List()).includes(reportEntitySetId)
        && subscription.getIn(['alertMetadata', 'personEntitySetId']) === personEntitySetId
        && subscription.getIn(['alertMetadata', 'staffEntitySetId']) === staffEntitySetId
    )).forEach((subscription) => {

      const query = subscription.getIn(['constraints', 'constraints', 0, 'constraints', 0, 'searchTerm']);
      if (query === testQuery) {
        testSubscription = subscription;
      }
      else if (query === homelessQuery) {
        homelessSubscription = subscription;
      }
    });

    return {
      testSubscription,
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
    const { testQuery, homelessQuery } = this.props;
    const { testSubscription, homelessSubscription } = this.state;

    return (
      <>
        {this.renderSubscription(
          'Test Alerts',
          'Email notifications will be sent for crisis templates for newly created users whose SSN ends with "0000"',
          testQuery,
          testSubscription
        )}
        {this.renderSubscription(
          'Homeless Alerts',
          'Email notifications will be sent for crisis templates where current housing situation is marked as "Unsheltered Homeless"',
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
      <FormWrapper>
        <FormSection>
          Manage Subscriptions
        </FormSection>
        <FormSection>
          {content}
        </FormSection>
      </FormWrapper>
    );
  }
}

function mapStateToProps(state) {

  return {
    isLoadingSubscriptions: state.getIn([STATE.SUBSCRIBE, SUBSCRIBE.IS_LOADING_SUBSCRIPTIONS]),
    subscriptions: state.getIn([STATE.SUBSCRIBE, SUBSCRIBE.SUBSCRIPTIONS]),

    testQuery: getSearchTerm(state.getIn(['edm', 'fqnToIdMap', PERSON_SSN_LAST_4_FQN]), TEST_SSN),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubscribeContainer));
