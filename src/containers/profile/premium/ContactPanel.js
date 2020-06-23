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
import PhoneLink from '../../../components/links/PhoneLink';
import * as FQN from '../../../edm/DataModelFqns';
import { List } from '../../../components/layout';
import { formatCityStateZip } from '../../../utils/AddressUtils';

const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;

type Props = {
  address :Map;
  contact :Map;
  isLoading :boolean;
};

const ContactPanel = (props :Props) => {
  const {
    address,
    contact,
    isLoading,
  } = props;

  const name = address.getIn([FQN.LOCATION_NAME_FQN, 0]);
  const street = address.getIn([FQN.LOCATION_STREET_FQN, 0]);
  const line2 = address.getIn([FQN.LOCATION_ADDRESS_LINE_2_FQN, 0]);
  const city = address.getIn([FQN.LOCATION_CITY_FQN, 0]);
  const state = address.getIn([FQN.LOCATION_STATE_FQN, 0]);
  const zip = address.getIn([FQN.LOCATION_ZIP_FQN, 0]);
  const cityStateZip = formatCityStateZip(city, state, zip);

  const phone = contact.getIn([FQN.CONTACT_PHONE_NUMBER_FQN, 0]);
  const ext = contact.getIn([FQN.EXTENTION_FQN, 0]);
  const type = contact.getIn([FQN.TYPE_FQN, 0]);
  const phoneContent = (
    <PhoneLink number={phone} extension={ext} />
  );

  const addressContent = (
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
            {
              contact.isEmpty() && !isLoading
                ? null
                : (
                  <li>
                    <LabeledDetail isLoading={isLoading} label={type} content={phoneContent} />
                  </li>
                )
            }
            <li>
              <LabeledDetail isLoading={isLoading} label="address" content={addressContent} />
            </li>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

ContactPanel.defaultProps = {
  contact: Map(),
  address: Map(),
};

export default ContactPanel;
