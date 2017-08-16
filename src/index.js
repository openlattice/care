/*
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Lattice from 'lattice';

import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import Form from './containers/Form';

Lattice.configure({ baseUrl: 'localhost', authToken: 'authToken' });

injectGlobal`${normalize()}`

injectGlobal`

  html,
  body {
    height: 100%;
    width: 100%;
    font-family: 'Open Sans', sans-serif;
  }

  #app {
    height: 100%;
    width: 100%;
  }
`;

ReactDOM.render(
  <Form />,
  document.getElementById('app')
);
