import express from 'express';
import bodyParser from 'body-parser';

import * as repoModel from '../models/repo';
import * as loginModel from '../models/login';
import * as tokenModel from '../models/token';
import * as reportModel from '../models/report';

const jsonParser = bodyParser.json();
const router = new express.Router();
export default router;

router.get('/', (req, res) =>
  res.render('index'));

router.get('/login/:provider', (req, res) =>
  loginModel.getLoginUrl(req.services, req.params)
  .then(url => res.redirect(url)));

router.get('/login/:provider/callback', (req, res) =>
  loginModel.callback(req.services, req.params, req.query, req.session)
  .then(url => res.redirect(url)));

router.get('/:provider/:user', loginModel.validate, (req, res) =>
  repoModel.query(req.services, req.params)
  .then(result => res.render('repo-list', result),
    error => res.send(error)));

router.route('/token/:provider/:user/:repo')
  .all(loginModel.validate)
  .get((req, res) =>
    tokenModel.get(req.services, req.params)
    .then(token => res.json(token),
      error => res.send(error)))
  .post((req, res) =>
    tokenModel.create(req.services, req.params)
    .then(() => res.redirect(`/${req.params.provider}/${req.params.user}`),
      error => res.send(error.toString())));

// must place the svg router before the next one.
router.get('/:provider/:user/:repo/:branch/:report?.svg', (req, res) =>
  reportModel.get(req.services, req.params)
  .then(result => res.type('svg').render('badge', result)));

router.route('/:provider/:user/:repo/:report?')
  .get(loginModel.validate, (req, res) =>
    reportModel.query(req.services, req.params)
    .then(result => res.render('repo', result),
      error => res.send(error)))
  .post(jsonParser, (req, res) =>
    tokenModel.validate(req.services, { ...req.params, token: req.body.token })
    .then(() => reportModel.upsert(req.services, { ...req.params, ...req.body }))
    .then(entity => res.json(entity),
      error => res.send(error.toString())));
