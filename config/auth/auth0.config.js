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
    : 'uy3biAScODcrQnSZIVLD4Auc39K4ioB1';

export const AUTH0_DOMAIN :string = 'openlattice.auth0.com';
