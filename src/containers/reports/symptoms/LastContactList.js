// @flow
import React from 'react';
import { List } from 'immutable';
import {
  Card,
  CardSegment,
  CardStack,
  Label
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import * as FQN from '../../../edm/DataModelFqns';

type Props = {
  recentInteractions :List;
};

const LastContactList = (props :Props) => {
  const { recentInteractions } = props;
  return (
    <CardStack>
      {
        recentInteractions.map((interaction) => {
          const email = interaction.getIn(['neighborDetails', FQN.PERSON_ID_FQN, 0]);
          const staffEKID = interaction.get('neighborId');
          const datetime = interaction.getIn(['associationDetails', FQN.CONTACT_DATE_TIME_FQN, 0]);
          const day = DateTime.fromISO(datetime).toLocaleString(DateTime.DATE_SHORT);

          return (
            <Card key={staffEKID}>
              <CardSegment padding="10px">
                <div>
                  <Label subtle>{day}</Label>
                  <span>{email}</span>
                </div>
              </CardSegment>
            </Card>
          );
        })
      }
    </CardStack>
  );
};

export default LastContactList;
