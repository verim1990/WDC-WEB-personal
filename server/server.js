'use strict';

import app, * as express from './express';
import * as routes from './routes';
import config from './config';

const bootstrap = () => {
  express.init();
  routes.register(app);
  express.listen();
};

export function start() {
  if(config.environment.env == 'development') {
    require('./builder')
      .build()
      .then(() => {
        bootstrap();
      });
  } else {
    bootstrap();
  }
}
