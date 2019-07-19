// @flow
import React, { Component } from 'react';
import {
  Banner,
  Card,
} from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/pro-solid-svg-icons';

type Props = {
  count :number;
}

class RecentIncidentCard extends Component<Props> {

  renderIcon = () => <FontAwesomeIcon icon={faBullhorn} fixedWidth />;

  render() {
    const { count } = this.props;

    if (!count) return null;

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
