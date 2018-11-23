'use strict';

import path from 'path';

export function register(app) {
  app.use('/views/pages', require('./pages').default);
  app.use('/views/skills', require('./skills').default);

  app.route('/*').get((req, res) => {
    res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
  });
}
