/*
 * @flow
 */

/* eslint-disable import/extensions */

import {
  isProd
} from '../app/env.config.js';

export const AUTH0_CLIENT_ID :string =
  isProd
    ? 'o8Y2U2zb5Iwo01jdxMN1W2aiN8PxwVjh'
    : '5zQu7w1czaGaRE41pojbiuVqro65BXcx';

export const AUTH0_DOMAIN :string = 'openlattice.auth0.com';
