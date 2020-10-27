// @flow
import React from 'react';

import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Label,
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import Address from '../../../components/premium/address/Address';
import LabeledDetail from '../../../components/premium/styled/LabeledDetail';
import PhoneLink from '../../../components/links/PhoneLink';
import * as FQN from '../../../edm/DataModelFqns';
import { List } from '../../../components/layout';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { formatCityStateZip } from '../../../utils/AddressUtils';
import { getEntityKeyId } from '../../../utils/DataUtils';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;

const MarginIcon = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

const ExternalLinkIcon = () => <MarginIcon icon={faExternalLinkAlt} fixedWidth />;

type Props = {
  address :Map;
  contact :Map;
  isLoading :boolean;
  person :Map;
};

const ContactPanel = (props :Props) => {
  const {
    address,
    contact,
    isLoading,
    person,
  } = props;

  const peopleESID = useSelector((store) => store.getIn(['app', 'selectedOrgEntitySetIds', PEOPLE_FQN]));
  const personEKID = getEntityKeyId(person);
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
    <>
      <strong>{name}</strong>
      <Address
          cityStateZip={cityStateZip}
          line2={line2}
          street={street} />
    </>
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
            <li>
              <a
                  href={`https://openlattice.com/heracles/#/profile/${peopleESID}/${personEKID}/communications`}
                  rel="noreferrer"
                  target="_blank">
                Heracles
                <ExternalLinkIcon />
              </a>
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
