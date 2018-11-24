'use strict';

import * as express from 'express';

let router = express.Router();

router.get('/:name', function(req, res) {
  res.render(`pages/${req.params.name}`, {});
});

export default router;
