import express from 'express';
import bodyParser from 'body-parser';

import * as repoModel from '../models/repo';
import * as loginModel from '../models/login';
import * as tokenModel from '../models/token';
import * as packageModel from '../models/package';

const jsonParser = bodyParser.json();
const router = new express.Router();
export default router;

router.get('/', (req, res) =>
  res.render('index'));

router.get('/login/:provider', (req, res) =>
  loginModel.getLoginUrl(req.params)
  .then(url => res.redirect(url)));

router.get('/login/:provider/callback', (req, res) =>
  loginModel.callback(req.params, req.query, req.session)
  .then(url => res.redirect(url)));

router.get('/:provider/:user', loginModel.validate, (req, res) =>
  repoModel.query(req.params)
  .then(result => res.json(result),
    error => res.send(error)));

router.route('/token/:provider/:user/:repo')
  .all(loginModel.validate)
  .get((req, res) =>
    tokenModel.get(req.params)
    .then(token => res.json(token),
      error => res.send(error)))
  .post((req, res) =>
    tokenModel.create(req.params)
    .then(token => res.json(token),
      error => res.send(error.toString())));

router.route('/:provider/:user/:repo')
  .all(loginModel.validate)
  .get((req, res) =>
    packageModel.query(req.params)
    .then(result => res.json(result),
      error => res.send(error)))
  .post(jsonParser, (req, res) =>
    tokenModel.validate({ ...req.params, token: req.body.token })
    .then(() => packageModel.upsert({ ...req.params, ...req.body }))
    .then(entity => res.json(entity),
      error => res.send(error.toString())));
