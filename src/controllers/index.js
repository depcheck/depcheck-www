import Guid from 'guid';
import express from 'express';
import bodyParser from 'body-parser';
import { logger, table } from '../services';

const jsonParser = bodyParser.json();
const router = new express.Router();
export default router;

function validateToken(provider, user, repo, token) {
  const id = `${provider}:${user}-$KEY$-${repo}`;
  return table.query('token', {
    limite: 1,
    filter: { id },
  })
  .then(([expected]) => {
    if (!expected) {
      const name = `${provider}/${user}/${repo}`;
      logger.info(`[router] the repository [${name}] is not enabled.`);
      throw new Error(`Depcheck for repository [${name}] is not enabled.`);
    } else if (expected.token !== token) {
      logger.info(`[router] unauthorized, expected token [${expected.token}], actual token [${token}].`);
      throw new Error('Unauthorized to update the depcheck status.');
    }
  });
}

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
    const { provider, user, repo } = req.params;
    const id = `${provider}:${user}-$KEY$-${repo}`;

    table.query('token', {
      limite: 1,
      filter: { id },
    })
    .then(([record]) => res.json(record),
      error => res.send(error));
  })
  .post((req, res) => {
    const { provider, user, repo } = req.params;
    const id = `${provider}:${user}-$KEY$-${repo}`;
    const token = Guid.raw();

    table.insert('token', { id, token, provider, user, repo })
    .then(entity => res.json(entity),
      error => res.send(error.toString()));
  });

router.route('/:provider/:user/:repo')
  .get((req, res) => {
    const { provider, user, repo } = req.params;

    table.query('package', {
      limit: 1,
      filter: { provider, user, repo },
    })
    .then(([record]) => res.json(record),
      error => res.send(error));
  })
  .post(jsonParser, (req, res) => {
    const { provider, user, repo } = req.params;
    const token = req.body.token;
    const branch = req.body.branch;
    const report = req.body.report;
    const result = req.body.result;
    const id = `${provider}:${user}:${repo}-$KEY$-${branch}:${report}`;

    validateToken(provider, user, repo, token)
    .then(() => table.upsert('package', {
      id,
      provider,
      user,
      repo,
      branch,
      report,
      dependencies: JSON.stringify(result.dependencies),
      devDependencies: JSON.stringify(result.devDependencies),
    }))
    .then(entity => res.json(entity),
      error => res.send(error.toString()));
  });
