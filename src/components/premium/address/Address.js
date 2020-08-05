// @flow
import React from 'react';

import styled from 'styled-components';
import { LangUtils } from 'lattice-utils';

const { isEmptyString } = LangUtils;

const H2 = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3125rem;
  margin: 0 0 10px 0;
`;

const AddressWrapper = styled.div`
  font-size: 0.875rem;
`;

type Props = {
  cityStateZip :string;
  line2 :string;
  name :string;
  street :string;
};

const Address = (props :Props) => {
  const {
    cityStateZip,
    line2,
    name,
    street,
  } = props;

  const emptyAddress = [name, street, line2, cityStateZip].every(isEmptyString);
  if (emptyAddress) return <span>---</span>;

  return (
    <AddressWrapper>
      <H2>
        {name}
      </H2>
      <div>{street}</div>
      <div>{line2}</div>
      <div>{cityStateZip}</div>
    </AddressWrapper>
  );
};

Address.defaultProps = {
  cityStateZip: '',
  line2: '',
  name: '',
  street: '',
};

export default Address;
