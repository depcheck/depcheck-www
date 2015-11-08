import response from './response';
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

function validate(condition, message) {
  return new Promise((resolve, reject) => {
    if (condition) {
      logger.warn(`[model:report] Reject to upsert report. ${message}`);
      reject(response(400, message));
    } else {
      resolve();
    }
  });
}

function isStringArray(object) {
  return object instanceof Array
      && object.every(item => typeof item === 'string');
}

export function upsert({ provider, user, repo, branch, report, result }) {
  const id = `${provider}:${user}:${repo}-$KEY$-${branch}:${report}`;
  logger.debug(`[model:report] upsert report with id [${id}] to result ${JSON.stringify(result)}.`);

  return Promise.all([
    validate(!branch, 'Required property `branch` is missing.'),
    validate(typeof branch !== 'string', 'Property `branch` only allow to be string.'),
    validate(!report && report !== '', 'Required property `report` is missing.'),
    validate(typeof report !== 'string', 'Property `report` only allow to be string.'),
    validate(!result, 'Required property `result` is missing.'),
    validate(result && !isStringArray(result.dependencies), 'Property `result.dependencies` only allow to be string array.'),
    validate(result && !isStringArray(result.devDependencies), 'Property `result.devDependencies` only allow to be string array.'),
  ])
  .then(() => table.upsert('report', {
    id,
    provider,
    user,
    repo,
    branch,
    report,
    dependencies: JSON.stringify(result.dependencies),
    devDependencies: JSON.stringify(result.devDependencies),
  }));
}
