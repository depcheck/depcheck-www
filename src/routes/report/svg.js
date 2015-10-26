import * as reportModel from '../../models/report';

export const route = '/:provider/:user/:repo/:branch/:report?.svg';

export const type = 'svg';

export const view = 'badge';

export function model({ params }) {
  return reportModel.get(params);
}
