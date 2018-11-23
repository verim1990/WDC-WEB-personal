'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

let global = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0'
};

let config = _.merge(
  global,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});

export default config;
