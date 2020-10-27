// @flow
import React from 'react';

import { LangUtils } from 'lattice-utils';

const { isEmptyString } = LangUtils;

type Props = {
  cityStateZip :string;
  line2 :string;
  street :string;
};

const Address = (props :Props) => {
  const {
    cityStateZip,
    line2,
    street,
  } = props;

  const emptyAddress = [street, line2, cityStateZip].every(isEmptyString);
  if (emptyAddress) return <span>---</span>;

  return (
    <div>
      <div>{street}</div>
      <div>{line2}</div>
      <div>{cityStateZip}</div>
    </div>
  );
};

Address.defaultProps = {
  cityStateZip: '',
  line2: '',
  street: '',
};

export default Address;
