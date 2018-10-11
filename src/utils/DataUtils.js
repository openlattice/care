import React from 'react';

export const getFqnObj = (fqnStr) => {
  const splitStr = fqnStr.split('.');
  return {
    namespace: splitStr[0],
    name: splitStr[1]
  };
};
