// @flow

import React, { useEffect } from 'react';

import { List, Map } from 'immutable';
import {
  Spinner
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';

import CrisisReportSubscriptions from './CrisisReportSubscriptions';
import {
  clearSubscriptions,
  getSubscriptions,
} from './SubscriptionActions';

import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';
import { STATE, SUBSCRIBE } from '../../utils/constants/StateConstants';

type Props = {
  actions :{
    clearSubscriptions :Function;
    getSubscriptions :Function;
  };
  isLoadingSubscriptions :boolean;
  subscriptions :List;
}

const SubscriptionContainer = (props :Props) => {
  const { actions, isLoadingSubscriptions, subscriptions } = props;

  useEffect(() => {
    actions.getSubscriptions();

    return () => {
      actions.clearSubscriptions();
    };
  }, [actions]);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <Header>
          Manage Subscriptions
        </Header>
        {
          isLoadingSubscriptions
            ? <Spinner />
            : <CrisisReportSubscriptions subscriptions={subscriptions} />
        }
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

const mapStateToProps = (state :Map) => ({
  isLoadingSubscriptions: state.getIn([STATE.SUBSCRIPTIONS, 'fetchState']) === RequestStates.PENDING,
  subscriptions: state.getIn([STATE.SUBSCRIPTIONS, SUBSCRIBE.SUBSCRIPTIONS]),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    clearSubscriptions,
    getSubscriptions,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionContainer);
