import { compile } from 'path-to-regexp';
import { logger } from '../../services';
import * as reportModel from '../../models/report';

export const route = '/:provider/:user/:repo/:branch/:report?.svg';

const build = compile(route);
export const url = (opts) => {
  // not generate report segment if it is empty name
  if (!opts.report) opts.report = undefined;
  return build(opts);
};

export const type = 'svg';

export const view = 'badge';

function toViewModel({ dependencies, devDependencies }) {
  if (!dependencies || !devDependencies) {
    return ['unknown', '#9f9f9f', 122];
  } else if (dependencies.length || devDependencies.length) {
    return ['failing', '#e05d44', 107];
  } else { // eslint-disable-line no-else-return
    return ['passing', '#4c1', 119];
  }
}

export function model({ params }) {
  logger.debug(`[routes:report:svg] get report SVG view model with parameter ${JSON.stringify(params)}.`);

  params.report = params.report || '';

  return reportModel.query(params)
  .then(([first]) => first || {})
  .then(toViewModel)
  .then(([caption, color, width]) => ({ caption, color, width }));
}
