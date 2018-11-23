'use stricte';

import chalk from 'chalk';
import gutil from 'gulp-util';

export default function Log(context, color, text) {
  if(color) {
    gutil.log(`${chalk[color](`[ ## ${context} ## ] \t`)}${text}`);
  } else {
    gutil.log(`${chalk.red(`[ ## ${context} ## ] \t`)}${text}`);
  }
}
