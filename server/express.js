'use strict';

import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
// import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import logger from './helpers/logger';
import config from './config';

const log = text => logger('Express', 'green', text);
const app = express();

export default app;

export function init() {
  let env = app.get('env');

  log('Server initialization started.');

  if(env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.environment.root, '.tmp')));
  }

  if(env === 'production') {
    app.use(favicon(path.join(config.environment.root, 'client', 'favicon.ico')));
  }

  app.set('appPath', path.join(config.environment.root, 'client'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan(function(tokens, req, res) {
    let text = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ');

    logger('Morgan', 'magenta', text);
  }));

  app.set('views', `${config.environment.root}/server/views`);
  app.set('view engine', 'pug');
  // app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if(env === 'development' || env === 'test') {
    app.use(errorHandler());
  }

  log('Server initialization finished.');
}

export function listen() {
  app.listen(config.environment.port, config.environment.ip, function() {
    log(`Server listening on ${config.environment.port}, in ${app.get('env')} mode.`);
  });
}
