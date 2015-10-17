import { logger, table } from '../services';

export function query({ provider, user, repo }) {
  logger.debug(`[model:package] query package with provider [${provider}], user [${user}] and repo [${repo}].`);
  return table.query('package', {
    filter: { provider, user, repo },
  }).then(result => result.map(item => ({
    provider: item.provider,
    user: item.user,
    repo: item.repo,
    branch: item.branch,
    report: item.report,
    dependencies: JSON.parse(item.dependencies),
    devDependencies: JSON.parse(item.devDependencies),
  })));
}

export function upsert({ provider, user, repo, branch, report, result }) {
  const id = `${provider}:${user}:${repo}-$KEY$-${branch}:${report}`;

  logger.debug(`[model:package] upsert package with id [${id}] to result ${JSON.stringify(result)}.`);
  return table.upsert('package', {
    id,
    provider,
    user,
    repo,
    branch,
    report,
    dependencies: JSON.stringify(result.dependencies),
    devDependencies: JSON.stringify(result.devDependencies),
  });
}
