// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { IconSplash } from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import { UL } from '../../../components/layout';
import { TECHNIQUES_FQN } from '../../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  isLoading ?:boolean;
  techniques :List<Map>;
}

const SpecificTechniques = (props :Props) => {
  const { isLoading, techniques } = props;

  if (isLoading) {
    return (
      <div>
        <UL isLoading />
      </div>
    );
  }

  let content = <IconSplash caption="No techniques." />;
  if (!techniques.isEmpty()) {
    content = (
      <UL>
        {
          techniques.map((technique) => {
            const value :string = technique.getIn([TECHNIQUES_FQN, 0], '');
            const entityKeyId :UUID = technique.getIn([OPENLATTICE_ID_FQN, 0]);
            return <li key={entityKeyId}>{value}</li>;
          })
        }
      </UL>
    );
  }

  return (
    <div>
      { content }
    </div>
  );
};

SpecificTechniques.defaultProps = {
  isLoading: false
};

export default SpecificTechniques;
