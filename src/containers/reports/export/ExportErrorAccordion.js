// @flow
/* eslint-disable react/no-array-index-key */
import React from 'react';
import type { Node } from 'react';

import { Link } from 'react-router-dom';
import type { UUID } from 'lattice';

import Accordion from '../../../components/accordion';
import { CRISIS_REPORT_CLINICIAN_PATH, REPORT_ID_PATH } from '../../../core/router/Routes';

type Props = {
  caption ?:Node;
  errors :string[];
  headline :Node;
  path ?:string;
  reportEKID :UUID;
};

const ExportErrorAccordion = ({
  caption,
  errors,
  headline,
  path,
  reportEKID,
} :Props) => {
  const defaultPath = CRISIS_REPORT_CLINICIAN_PATH.replace(REPORT_ID_PATH, reportEKID);
  const defaultCaption = <Link target="_blank" to={path || defaultPath}>{reportEKID}</Link>;
  return (
    <Accordion>
      <div caption={caption || defaultCaption} headline={headline}>
        <ul>
          { errors.map((msg, idx) => (<li key={idx}>{msg}</li>))}
        </ul>
      </div>
    </Accordion>
  );
};

ExportErrorAccordion.defaultProps = {
  caption: '',
  path: ''
};

export default ExportErrorAccordion;
