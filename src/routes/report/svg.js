import { logger } from '../../services';
import * as reportModel from '../../models/report';

export const route = '/:provider/:user/:repo/:branch/:report?.svg';

export const type = 'svg';

export const view = 'badge';

function toViewModel({ dependencies, devDependencies }) {
  if (!dependencies || !devDependencies) {
    return ['unknown', '#9f9f9f'];
  } else if (dependencies.length || devDependencies.length) {
    return ['failing', '#e05d44'];
  }

  return ['passing', '#4c1'];
}

export function model({ params }) {
  logger.debug(`[routes:report:svg] get report SVG view model with parameter ${JSON.stringify(params)}.`);

  params.report = params.report || '';

  return reportModel.query(params)
  .then(([first]) => first || {})
  .then(toViewModel)
  .then(([caption, color]) => ({ caption, color }));
}
