import { logger, table } from '../services';

export function query({ provider, user, repo }) {
  logger.debug(`[model:report] query reports with provider [${provider}], user [${user}] and repo [${repo}].`);
  return table.query('report', {
    filter: { provider, user, repo },
  }).then(result => ({
    provider,
    user,
    repo,
    reports: result.map(item => ({
      branch: item.branch,
      report: item.report,
      dependencies: JSON.parse(item.dependencies),
      devDependencies: JSON.parse(item.devDependencies),
    })),
  }));
}

// TODO need refactor to merge with query function
export function get(params) {
  logger.debug(`[model:report] get report with parameter ${JSON.stringify(params)}.`);
  const { branch, report = '' } = params;
  return query(params)
  .then(result =>
    result.reports.filter(its =>
      its.branch === branch && its.report === report))
  .then(([first]) => first || {});
}

export function upsert({ provider, user, repo, branch, report, result }) {
  const id = `${provider}:${user}:${repo}-$KEY$-${branch}:${report}`;

  logger.debug(`[model:report] upsert report with id [${id}] to result ${JSON.stringify(result)}.`);
  return table.upsert('report', {
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
