// @flow
import React from 'react';

import { List } from 'immutable';
import { Typography } from 'lattice-ui-kit';

type Props = {
  errors :List;
};

const ExportIssues = ({ errors } :Props) => {

  if (errors.size) {
    return (
      <>
        <Typography variant="h4" component="h2">Issues:</Typography>
        <ul>
          {
            // eslint-disable-next-line react/no-array-index-key
            errors.map((error, index) => <li key={index}>{error}</li>)
          }
        </ul>
      </>
    );
  }
  return null;
};

export default ExportIssues;
