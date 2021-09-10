// @flow
/* eslint-disable react/no-array-index-key */
import React from 'react';
import type { Node } from 'react';

import { Link } from 'react-router-dom';
import type { UUID } from 'lattice';

import Accordion from '../../../components/accordion';

type Props = {
  caption ?:Node;
  errors :string[];
  headline :Node;
  path :string;
  reportEKID :UUID;
};

const ExportErrorAccordion = ({
  caption,
  errors,
  headline,
  path,
  reportEKID,
} :Props) => {
  const subtitle = caption || <Link target="_blank" to={path}>{reportEKID}</Link>;
  return (
    <Accordion>
      <div caption={subtitle} headline={headline}>
        <ul>
          { errors.map((msg, idx) => (<li key={idx}>{msg}</li>))}
        </ul>
      </div>
    </Accordion>
  );
};

ExportErrorAccordion.defaultProps = {
  caption: '',
};

export default ExportErrorAccordion;
