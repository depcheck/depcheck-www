import express from 'express';

import * as repoModel from '../models/repo';
import * as loginModel from '../models/login';

const router = new express.Router();
export default router;

router.get('/:provider/:user', loginModel.validate, (req, res) =>
  repoModel.query(req.params)
  .then(result => res.render('repo-list', result),
    error => res.send(error)));
