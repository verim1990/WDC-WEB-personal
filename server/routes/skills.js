'use strict';

import * as express from 'express';

let router = express.Router();

router.get('/:name', function(req, res) {
  res.render(`skills/${req.params.name}`, {});
});

export default router;
