// @flow
import React from 'react';

import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Label,
} from 'lattice-ui-kit';

import Address from '../../../components/premium/address/Address';
import LabeledDetail from '../../../components/premium/styled/LabeledDetail';
import * as FQN from '../../../edm/DataModelFqns';
import { formatCityStateZip } from '../../../utils/AddressUtils';
import { List } from '../../../components/layout';

const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;

type Props = {
  address :Map;
  isLoading :boolean;
};

const ContactPanel = (props :Props) => {
  const {
    address,
    isLoading,
  } = props;

  const name = address.getIn([FQN.LOCATION_NAME_FQN, 0]);
  const street = address.getIn([FQN.LOCATION_STREET_FQN, 0]);
  const line2 = address.getIn([FQN.LOCATION_ADDRESS_LINE_2_FQN, 0]);
  const city = address.getIn([FQN.LOCATION_CITY_FQN, 0]);
  const state = address.getIn([FQN.LOCATION_STATE_FQN, 0]);
  const zip = address.getIn([FQN.LOCATION_ZIP_FQN, 0]);
  const cityStateZip = formatCityStateZip(city, state, zip);

  const content = (
    <Address
        cityStateZip={cityStateZip}
        isLoading={isLoading}
        line2={line2}
        name={name}
        street={street} />
  );

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={expandIcon}>
          <Label subtle>Contact</Label>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            <li>
              <LabeledDetail isLoading={isLoading} label="address" content={content} />
            </li>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default ContactPanel;
