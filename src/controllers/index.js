import express from 'express';
import bodyParser from 'body-parser';

import * as repoModel from '../models/repo';
import * as loginModel from '../models/login';
import * as tokenModel from '../models/token';
import * as reportModel from '../models/report';

const jsonParser = bodyParser.json();
const router = new express.Router();
export default router;

router.get('/:provider/:user', loginModel.validate, (req, res) =>
  repoModel.query(req.params)
  .then(result => res.render('repo-list', result),
    error => res.send(error)));

router.route('/:provider/:user/:repo/:report?')
  .get(loginModel.validate, (req, res) =>
    reportModel.query(req.params)
    .then(result => res.render('repo', result),
      error => res.send(error)))
  .post(jsonParser, (req, res) =>
    tokenModel.validate({ ...req.params, token: req.body.token })
    .then(() => reportModel.upsert({ ...req.params, ...req.body }))
    .then(entity => res.json(entity),
      error => res.send(error.toString())));
