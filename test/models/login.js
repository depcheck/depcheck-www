/* global describe, it */

import 'should';
import model from '../utils/model';

describe('model login', () => {
  it('should pass validation when user match', () =>
    model('login').validate({
      provider: 'models',
      user: 'tester',
      session: {
        login: {
          provider: 'models',
          user: 'tester',
        },
      },
    })
    .then(() => 'everything'.should.be.ok()));

  it('should fail validation when user not match', () =>
    model('login').validate({
      provider: 'models',
      user: 'hacker',
      session: {
        login: {
          provider: 'models',
          user: 'tester',
        },
      },
    })
    .catch(error => error.should.have.properties(['code', 'message'])));
});
