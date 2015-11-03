/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view tutorial', () => {
  it('should render depcheck tutorial', () => {
    const content = 'Depcheck Tutorial Markdown Content';
    const query = view('tutorial', {
      content: `## ${content}`,
    });

    query('h2').text().should.equal(content);
  });
});
