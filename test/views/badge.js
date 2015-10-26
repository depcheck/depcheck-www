/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view badge', () => {
  it('should render depcheck badge with caption and color', () => {
    const query = view('badge', {
      caption: 'my-caption',
      color: 'green',
    });

    query('text').eq(0).text().should.equal('depcheck');
    query('text').eq(1).text().should.equal('depcheck');

    query('text').eq(2).text().should.equal('my-caption');
    query('text').eq(3).text().should.equal('my-caption');

    query('rect').eq(1).attr('fill').should.equal('green');
    query('path').eq(0).attr('fill').should.equal('green');
  });
});
