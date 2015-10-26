import * as reportModel from '../../models/report';

export const route = '/:provider/:user/:repo/:branch/:report?.svg';

export const type = 'svg';

export const view = 'badge';

function toViewModel(report) {
  if (!report.dependencies || !report.devDependencies) {
    return ['unknown', '#9f9f9f'];
  } else if (report.dependencies.length || report.devDependencies.length) {
    return ['failing', '#e05d44'];
  }

  return ['passing', '#4c1'];
}

export function model({ params }) {
  return reportModel.get(params)
  .then(report => toViewModel(report))
  .then(([caption, color]) => ({ caption, color }));
}
