// Generated on 2017-01-17 using generator-angular-fullstack 4.1.2
'use strict';

import _ from 'lodash';
import chalk from 'chalk';
import del from 'del';
import gulp from 'gulp';
import gutil from 'gulp-util';
import tsLintStylish from 'tslint-stylish';
import grunt from 'grunt';
import path from 'path';
import through2 from 'through2';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';
import webpack from 'webpack-stream';
import makeWebpackConfig from './webpack._make';

var plugins = gulpLoadPlugins();
var config;

const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [`${clientPath}/**/!(*.spec|*.mock).ts`],
    styles: [`${clientPath}/{app,components}/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/{app,components}/**/*.pug`,
    mainView: `${clientPath}/index.html`
  },
  server: {
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`
    ],
    json: [`${serverPath}/**/*.json`],
    views: `${serverPath}/views/**/*.pug`,
  },
  dist: 'dist'
};

/********************
 * Helper functions
 ********************/

var cl = console.log;
console.log = function() {
  var args = Array.prototype.slice.call(arguments);
  if(args.length) {
    if(!/\[.\#{2}.*.*\#{2}.\]/.test(args[0])) {
      args[0] = chalk.magenta('[ ## Gulp ## ] \t') + args[0];
    }
  }

  return cl.apply(console, args);
};

function onServerLog(log) {
  gutil.log(chalk.cyan('[ ## Nodemon ## ] \t') + log.message);
}

function checkAppReady(cb) {
  var options = {
    host: 'localhost',
    port: config.port
  };
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  var serverReady = false;
  var appReadyInterval = setInterval(() =>
    checkAppReady(ready => {
      if(!ready || serverReady) {
        return;
      }
      clearInterval(appReadyInterval);
      serverReady = true;
      cb();
    }),
    100);
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
    .pipe(plugins.tslint, require(`./${clientPath}/tslint.json`))
    .pipe(plugins.tslint.report, tsLintStylish, {emitError: false});

let lintServerScripts = lazypipe()
    .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
    .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
      plugins: [
        'transform-class-properties',
        'transform-runtime'
      ]
    })
    .pipe(plugins.sourcemaps.write, '.');

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig;
  try {
    localConfig = require(`./${serverPath}/config/local.env`);
  } catch(e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});
gulp.task('env:test', () => {
  plugins.env({
    vars: {NODE_ENV: 'test'}
  });
});
gulp.task('env:prod', () => {
  plugins.env({
    vars: {NODE_ENV: 'production'}
  });
});

/********************
 * Tasks
 ********************/

gulp.task('inject', cb => {
  runSequence(['inject:scss'], cb);
});

gulp.task('inject:scss', () => {
  return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort()),
          {
            transform: filepath => {
              let newPath = filepath
                        .replace(`/${clientPath}/app/`, '')
                        .replace(`/${clientPath}/components/`, '../components/')
                        .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
                        .replace('.scss', '');
              return `@import '${newPath}';`;
            }
          }))
        .pipe(gulp.dest(`${clientPath}/app`));
});

gulp.task('webpack:dev', function() {
  const webpackDevConfig = makeWebpackConfig({ DEV: true });
  return gulp.src(webpackDevConfig.entry.app)
        .pipe(plugins.plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:dist', function() {
  const webpackDistConfig = makeWebpackConfig({ BUILD: true });
  return gulp.src(webpackDistConfig.entry.app)
        .pipe(webpack(webpackDistConfig))
        .on('error', err => {
          this.emit('end'); // Recover from errors
        })
        .pipe(gulp.dest(`${paths.dist}/client`));
});

gulp.task('webpack:test', function() {
  const webpackTestConfig = makeWebpackConfig({ TEST: true });
  return gulp.src(webpackTestConfig.entry.app)
        .pipe(webpack(webpackTestConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:e2e', function() {
  const webpackE2eConfig = makeWebpackConfig({ E2E: true });
  return gulp.src(webpackE2eConfig.entry.app)
        .pipe(webpack(webpackE2eConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('styles', () => {
  return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('transpile:server', () => {
  return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
  return gulp.src(paths.client.scripts)
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
  return gulp.src(paths.server.scripts)
        .pipe(lintServerScripts());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));

gulp.task('start:client', cb => {
  whenServerReady(() => {
    open('http://localhost:' + config.browserSyncPort);
    cb();
  });
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  config = require(`./${paths.dist}/${serverPath}/config/environment`);
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:inspector', () => {
  gulp.src([])
        .pipe(plugins.nodeInspector({
          debugPort: 5858
        }));
});

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('watch', () => {
  plugins.watch(paths.server.scripts)
        .pipe(plugins.plumber())
        .pipe(lintServerScripts());
});

gulp.task('serve', cb => {
  runSequence(
    [
      'clean:tmp',
      'inject',
      'copy:fonts:dev',
      'env:all'
    ],
        'lint:scripts',
        // 'webpack:dev',
        ['start:server', 'start:client'],
        'watch',
        cb
    );
});

gulp.task('serve:debug', cb => {
  runSequence(
    [
      'clean:tmp',
      'lint:scripts',
      'inject',
      'copy:fonts:dev',
      'env:all'
    ],
        'webpack:dev',
        'start:inspector',
        ['start:server:debug', 'start:client'],
        'watch',
        cb
    );
});

gulp.task('serve:dist', cb => {
  runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod', 'start:client'],
        cb);
});

/********************
 * Build
 ********************/

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
        'inject',
        'transpile:server',
    [
      'build:images'
    ],
    [
      'copy:extras',
      'copy:assets',
      'copy:fonts:dist',
      'copy:server',
      'webpack:dist'
    ],
        'revReplaceWebpack',
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));

gulp.task('build:images', () => {
  return gulp.src(paths.client.images)
        .pipe(plugins.imagemin([
          plugins.imagemin.optipng({optimizationLevel: 5}),
          plugins.imagemin.jpegtran({progressive: true}),
          plugins.imagemin.gifsicle({interlaced: true}),
          plugins.imagemin.svgo({plugins: [{removeViewBox: false}]})
        ]))
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
          base: `${paths.dist}/${clientPath}/assets`,
          merge: true
        }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('revReplaceWebpack', function() {
  return gulp.src('dist/client/app.*.js')
        .pipe(plugins.revReplace({manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)}))
        .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:extras', () => {
  return gulp.src([
    `${clientPath}/favicon.ico`,
    `${clientPath}/robots.txt`,
    `${clientPath}/.htaccess`
  ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */
function flatten() {
  return through2.obj(function(file, enc, next) {
    if(!file.isDirectory()) {
        try {
            let dir = path.dirname(file.relative).split(path.sep)[0];
            let fileName = path.normalize(path.basename(file.path));
            file.path = path.join(file.base, path.join(dir, fileName));
            this.push(file);
          } catch(e) {
              this.emit('error', new Error(e));
            }
      }
    next();
  });
}
gulp.task('copy:fonts:dev', () => {
  return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${clientPath}/assets/fonts`));
});
gulp.task('copy:fonts:dist', () => {
  return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`));
});

gulp.task('copy:assets', () => {
  return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:server', () => {
  return gulp.src([
    'package.json',
    paths.server.views
  ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
  buildcontrol: {
    options: {
        dir: paths.dist,
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
    heroku: {
        options: {
            remote: 'heroku',
            branch: 'master'
          }
      },
    openshift: {
        options: {
            remote: 'openshift',
            branch: 'master'
          }
      }
  }
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', function(done) {
  grunt.tasks(
        ['buildcontrol:heroku'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function() {done();}
    );
});
gulp.task('buildcontrol:openshift', function(done) {
  grunt.tasks(
        ['buildcontrol:openshift'],    //you can add more grunt tasks in this array
        {gruntfile: false}, //don't look for a Gruntfile - there is none. :-)
        function() {done();}
    );
});
