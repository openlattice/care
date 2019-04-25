/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Map, fromJS } from 'immutable'
import { DateTimePicker } from '@atlaskit/datetime-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';

import BasicButton from '../buttons/BasicButton';
import SecondaryButton from '../buttons/SecondaryButton';
import InfoButton from '../buttons/InfoButton';
import SearchableSelect from '../controls/SearchableSelect';
import { TIMEZONES } from '../../containers/subscribe/SubscribeConstants';

type Props = {
  query :string,
  title :string,
  description :string,
  subscription :Map,
  timezone? :string,
  expiration? :string,
  onCancel :Function,
  onEdit :Function,
  onCreate :Function
};

type State = {
  isCreating :boolean,
  isEditing :boolean,
  timezone :string,
  expiration :string
};

const Wrapper = styled.div`
  margin: 20px;
  padding: 30px;
  width: 100%;
  border: 1px solid #dcdce7;
  border-radius: 3px;
  display: flex;
  flex-direction: row;

  box-shadow: ${props => (props.active ? '0 5px 15px 0 rgba(0, 0, 0, 0.07)' : 'none')};
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;

  h1 {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    color: #2e2e34;
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
  justify-content: ${props => (props.oneButton ? 'center' : 'space-between')};
  margin: -10px 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
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
  justify-content: space-between;

  &:first-child {
    width: 30%;
    padding-right: 30px;
  }

  &:last-child {
    width: 70%;
  }

  h1 {
    font-weight: 600;
    font-size: 14px;
    color: #2e2e34;
    margin: 0;
  }
`;

const ReadOnlyDetail = styled.span`
  font-size: 14px;
  margin-bottom: 15px;
`;

const StyledInfoButton = styled(InfoButton)`
  padding: 10px 0;
  font-size: 14px;
`;

const StyledSecondaryButton = styled(SecondaryButton)`
  padding: 10px 0;
`;

const StyledBasicButton = styled(BasicButton)`
  padding: 10px 0;
`;

const DateTimePickerWrapper = styled.div`
  width: 100%;
`;

export default class Subscription extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);

    const { timezone, expiration } = props;

    this.state = {
      isCreating: false,
      isEditing: false,
      timezone: timezone || TIMEZONES.CST,
      expiration: expiration ? moment(expiration) : moment().add(1, 'year')
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
      expiration: expiration.toISOString(true)
    });
    this.setState({ isEditing: false });
  }

  createSubscription = () => {
    const { onCreate, query } = this.props;
    const { timezone, expiration } = this.state;
    onCreate({
      query,
      timezone,
      expiration: expiration.toISOString(true)
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
            <StyledInfoButton onClick={this.editSubscription}>Save</StyledInfoButton>
            <StyledBasicButton onClick={() => this.setState({ isEditing: false })}>Cancel</StyledBasicButton>
          </>
        );
      }
      return (
        <>
          <StyledSecondaryButton onClick={() => this.setState({ isEditing: true })}>
            Manage Subscription
          </StyledSecondaryButton>
          <StyledBasicButton onClick={this.cancelSubscription}>Cancel Subscription</StyledBasicButton>
        </>
      );
    }
    if (isCreating) {
      return (
        <>
          <StyledInfoButton onClick={this.createSubscription}>Confirm Subscription</StyledInfoButton>
          <StyledBasicButton onClick={() => this.setState({ isCreating: false })}>Cancel</StyledBasicButton>
        </>
      );
    }

    return (
      <StyledSecondaryButton onClick={() => this.setState({ isCreating: true })}>Subscribe</StyledSecondaryButton>
    );

  }

  handleDateChange = (newDate) => {
    const expiration = newDate.endsWith('T')
      ? moment(newDate.slice(0, newDate.length - 1))
      : moment(newDate);

    this.setState({ expiration });
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
          <h1>Timezone</h1>
          {
            isCreating ? (
              <SearchableSelect
                  value={timezone}
                  onSelect={newTimezone => this.setState({ timezone: newTimezone })}
                  options={fromJS(TIMEZONES)}
                  searchPlaceholder=""
                  transparent
                  fullWidth
                  dropdownIcon={false}
                  noFilter
                  withBorders
                  selectOnly
                  short />
            ) : <ReadOnlyDetail>{timezone}</ReadOnlyDetail>
          }
        </DetailSection>
        <DetailSection>
          <h1>Expiration</h1>
          {
            isCreating || isEditing ? (
              <DateTimePickerWrapper>
                <DateTimePicker
                    dateFormat={'MM/DD/YYYY'}
                    timeFormat={'h:mm a'}
                    value={expiration.toISOString(true)}
                    onChange={this.handleDateChange}
                    timeIsEditable />
              </DateTimePickerWrapper>
            ) : <ReadOnlyDetail>{expiration.format('MMMM DD YYYY, hh:mm a')}</ReadOnlyDetail>
          }
        </DetailSection>
      </>
    )

  }

  render() {
    const { isCreating, isEditing } = this.state;
    const { subscription, title, description } = this.props;

    return (
      <Wrapper active={isCreating || isEditing}>
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
      </Wrapper>
    );
  }
}
