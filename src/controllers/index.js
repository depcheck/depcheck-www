import express from 'express';
import bodyParser from 'body-parser';
import * as tokenModel from '../models/token';
import * as packageModel from '../models/package';
import { table } from '../services';

const jsonParser = bodyParser.json();
const router = new express.Router();
export default router;

router.get('/', (req, res) =>
  res.send('hello world'));

router.get('/:provider/:user', (req, res) => {
  const { provider, user } = req.params;
  const queryToken = table.query('token', { filter: { provider, user } });

  // TODO request all packages from provider (Github)
  Promise.all([queryToken]).then(([tokens]) => res.json(tokens),
    error => res.send(error));
});

router.route('/token/:provider/:user/:repo')
  .get((req, res) => {
    tokenModel.get(req.params)
    .then(token => res.json(token),
      error => res.send(error));
  })
  .post((req, res) => {
    tokenModel.create(req.params)
    .then(token => res.json(token),
      error => res.send(error.toString()));
  });

router.route('/:provider/:user/:repo')
  .get((req, res) => {
    packageModel.query(req.params)
    .then(result => res.json(result),
      error => res.send(error));
  })
  .post(jsonParser, (req, res) => {
    tokenModel.validate({ ...req.params, token: req.body.token })
    .then(() => packageModel.upsert({ ...req.params, ...req.body }))
    .then(entity => res.json(entity),
      error => res.send(error.toString()));
  });
