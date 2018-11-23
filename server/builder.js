'use strict';

import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMake from '../webpack._make';
import logger from './helpers/logger';
import config from './config';

const log = text => logger('Builder', 'red', text);

export function build() {
  const webpackConfig = webpackMake({ DEV: true });
  const webpackCompiler = webpack(webpackConfig);
  const browserSyncInstance = browserSync.create();

  log('Starting building process.');
  log('BrowserSync initialization started.');
  log('Webpack compilation started.');
  console.log('');

  return new Promise(resolve => {
    browserSyncInstance.init({
      open: false,
      logLevel: 'info', // 'silent'
      proxy: {
        target: `localhost:${config.environment.port}`,
        ws: true
      },
      middleware: [
        webpackDevMiddleware(webpackCompiler, {
          noInfo: false,
          stats: {
            colors: true,
            timings: true,
            chunks: false
          },
          hot: true,
          historyApiFallback: true,
          publicPath: webpackConfig.output.publicPath
        }),
        webpackHotMiddleware(webpackCompiler, {
          log: console.log,
          path: '/__webpack_hmr',
          heartbeat: 10 * 1000
        })
      ],
      port: config.environment.browserSyncPort,
      plugins: ['bs-fullscreen-message']
    }, () => {
      console.log('');
      log('BrowserSync initialization finished.');
    });

    webpackCompiler.plugin('done', stats => {
      if(stats.hasErrors() || stats.hasWarnings()) {
        return browserSyncInstance.sockets.emit('fullscreen:message', {
          title: 'Webpack Error:',
          body: stats.toString(),
          timeout: 100000
        });
      }
      return resolve();
    });

    webpackCompiler.plugin('emit', (compilation, callback) => {
      log('Webpack compilation finished.');
      log('Webpack statistics:');
      console.log('');
      callback();
    });
  });
}
