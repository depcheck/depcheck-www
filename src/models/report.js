import { logger, table } from '../services';

export function query(filter) {
  logger.debug(`[model:report] query reports with filter ${JSON.stringify(filter)}.`);

  return table.query('report', { filter })
  .then(reports =>
    reports.map(report => ({
      branch: report.branch,
      report: report.report,
      dependencies: JSON.parse(report.dependencies),
      devDependencies: JSON.parse(report.devDependencies),
    })));
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
