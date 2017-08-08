/*
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';

import styled, { injectGlobal } from 'styled-components';
import { normalize } from 'polished';

import Form from './containers/Form';

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

const Title = styled.h1`
  color: #815dd2;
  font-size: 40px;
  letter-spacing: 30px;
  text-align: center;
  text-indent: 30px;
`;

const Description = styled.p`
  color: #737d8c;
  text-align: center;
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

ReactDOM.render(
  <Form />,
  document.getElementById('app')
);
