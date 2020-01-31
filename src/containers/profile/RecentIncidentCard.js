// @flow
import React, { Component } from 'react';

import { faBullhorn } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Banner,
  Card,
} from 'lattice-ui-kit';

type Props = {
  count :number;
  isLoading ?:boolean;
}

class RecentIncidentCard extends Component<Props> {

  renderIcon = () => <FontAwesomeIcon icon={faBullhorn} fixedWidth />;

  render() {
    const { count, isLoading } = this.props;

    if (!count || isLoading) return null;

    return (
      <Card>
        <Banner
            isOpen
            icon={() => <FontAwesomeIcon icon={faBullhorn} fixedWidth />}>
          <span>
            {`${count} incident(s) within the last 7 days.`}
          </span>
        </Banner>
      </Card>
    );
  }
}

export default RecentIncidentCard;
