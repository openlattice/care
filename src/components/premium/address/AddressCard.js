// @flow

import React from 'react';
import {
  Card,
  CardSegment,
  CardHeader,
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { faHome } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import * as FQN from '../../../edm/DataModelFqns';
import EditLinkButton from '../../buttons/EditLinkButton';
import { BASIC_PATH } from '../../../core/router/Routes';
import { formatCityStateZip } from './AddressUtils';
import { H1, IconWrapper } from '../../layout';
import Address from './Address';


type Props = {
  address :Map;
  isLoading :boolean;
  match :Match;
};

const AddressCard = (props :Props) => {

  const { address, isLoading, match } = props;

  const name = address.getIn([FQN.LOCATION_NAME_FQN, 0]);
  const street = address.getIn([FQN.LOCATION_STREET_FQN, 0]);
  const line2 = address.getIn([FQN.LOCATION_ADDRESS_LINE_2_FQN, 0]);
  const city = address.getIn([FQN.LOCATION_CITY_FQN, 0]);
  const state = address.getIn([FQN.LOCATION_STATE_FQN, 0]);
  const zip = address.getIn([FQN.LOCATION_ZIP_FQN, 0]);
  const cityStateZip = formatCityStateZip(city, state, zip);

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faHome} />
          </IconWrapper>
          Address
          <EditLinkButton mode="primary" to={`${match.url}${BASIC_PATH}`} />
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Address
            cityStateZip={cityStateZip}
            isLoading={isLoading}
            line2={line2}
            name={name}
            street={street} />
      </CardSegment>
    </Card>
  );

};

export default withRouter(AddressCard);
