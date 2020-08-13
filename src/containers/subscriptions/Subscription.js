/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  DatePicker,
  Label,
  Select,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import { TIMEZONES } from './constants';

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;

  h1 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  span {
    font-size: 14px;
    color: #8e929b;
  }
`;

const CenterSection = styled.div`
  width: 45%;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
`;

const ButtonSection = styled.div`
  width: 15%;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.oneButton ? 'center' : 'space-between')};
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SubscribedWrapper = styled.div`
  color: #00be84;
  text-transform: uppercase;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;

  div {
    margin-left: 5px;
    font-size: 14px;
  }
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:first-child {
    width: 50%;
    padding-right: 30px;
  }

  &:last-child {
    width: 50%;
  }

  label {
    margin-bottom: 21px;
  }
`;

const ReadOnlyDetail = styled.span`
  font-size: 14px;
  margin-bottom: 15px;
`;

const DateTimePickerWrapper = styled.div`
  width: 100%;
`;

type Props = {
  alertName :string;
  description :string;
  onCancel :Function;
  onCreate :Function;
  onEdit :Function;
  query :string;
  subscription :Map;
  title :string;
};

type State = {
  expiration :string;
  isCreating :boolean;
  isEditing :boolean;
  timezone :string;
};

export default class Subscription extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);

    const { subscription } = props;

    const timezone = subscription ? subscription.getIn(['alertMetadata', 'timezone']) : undefined;
    const expiration = subscription ? subscription.get('expiration') : undefined;

    this.state = {
      isCreating: false,
      isEditing: false,
      timezone: timezone || 'CST',
      expiration: expiration || DateTime.local().plus({ years: 1 }).toISO()
    };
  }

  cancelSubscription = () => {
    const { onCancel, subscription } = this.props;
    const id = subscription.get('id');
    onCancel(id);
    this.setState({ isEditing: false });
  }

  cancelSubscription = () => {
    const { onCancel, subscription } = this.props;
    const id = subscription.get('id');
    onCancel(id);
    this.setState({ isEditing: false });
  }

  editSubscription = () => {
    const { onEdit, subscription } = this.props;
    const { expiration } = this.state;
    const id = subscription.get('id');
    onEdit({
      id,
      expiration
    });
    this.setState({ isEditing: false });
  }

  createSubscription = () => {
    const { onCreate, query, alertName } = this.props;
    const { timezone, expiration } = this.state;
    onCreate({
      alertName,
      query,
      timezone,
      expiration
    });
    this.setState({ isCreating: false });
  }

  renderSubscriptionButtons = () => {
    const { isCreating, isEditing } = this.state;
    const { subscription } = this.props;

    if (subscription) {
      if (isEditing) {
        return (
          <>
            <Button onClick={this.editSubscription}>Save</Button>
            <Button onClick={() => this.setState({ isEditing: false })}>Cancel</Button>
          </>
        );
      }
      return (
        <>
          <Button onClick={() => this.setState({ isEditing: true })} color="secondary">
            Manage
          </Button>
          <Button onClick={this.cancelSubscription}>Cancel</Button>
        </>
      );
    }
    if (isCreating) {
      return (
        <>
          <Button color="primary" onClick={this.createSubscription}>Subscribe</Button>
          <Button onClick={() => this.setState({ isCreating: false })}>Cancel</Button>
        </>
      );
    }

    return (
      <Button color="secondary" onClick={() => this.setState({ isCreating: true })}>Manage</Button>
    );

  }

  handleDateChange = (date) => {
    const eod = DateTime.fromISO(date).endOf('day').toISO();
    this.setState({ expiration: eod });
  }

  renderSubscriptionDetails = () => {
    const { subscription } = this.props;
    const {
      timezone,
      expiration,
      isCreating,
      isEditing
    } = this.state;

    if (!subscription && !isCreating) {
      return null;
    }

    return (
      <>
        <DetailSection>
          <Label subtle>Timezone</Label>
          {
            isCreating ? (
              <Select
                  value={timezone}
                  onChange={(newTimezone) => this.setState({ timezone: newTimezone })}
                  options={TIMEZONES}
                  useRawValues />
            ) : <ReadOnlyDetail>{timezone}</ReadOnlyDetail>
          }
        </DetailSection>
        <DetailSection>
          <Label subtle>Expiration</Label>
          {
            isCreating || isEditing ? (
              <DateTimePickerWrapper>
                <DatePicker
                    value={expiration}
                    onChange={this.handleDateChange} />
              </DateTimePickerWrapper>
            ) : <ReadOnlyDetail>{DateTime.fromISO(expiration).toLocaleString(DateTime.DATE_SHORT)}</ReadOnlyDetail>
          }
        </DetailSection>
      </>
    );

  }

  render() {
    const { isCreating } = this.state;
    const { subscription, title, description } = this.props;

    return (
      <Card>
        <CardSegment vertical={false}>
          <TitleSection>
            <TitleWrapper>
              <h1>{title}</h1>
              {subscription ? (
                <SubscribedWrapper>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <div>Subscribed</div>
                </SubscribedWrapper>
              ) : null}
            </TitleWrapper>
            <span>{description}</span>
          </TitleSection>
          <CenterSection>
            {this.renderSubscriptionDetails()}
          </CenterSection>
          <ButtonSection oneButton={!subscription && !isCreating}>
            {this.renderSubscriptionButtons()}
          </ButtonSection>
        </CardSegment>
      </Card>
    );
  }
}
