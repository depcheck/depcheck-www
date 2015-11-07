/* global describe, it */

import 'should';
import model from '../utils/model';

const session = {
  login: {
    provider: 'models',
    user: 'tester',
  },
};

describe('model login', () => {
  it('should pass validation when user match', () =>
    model('login').validate({
      provider: 'models',
      user: 'tester',
      session,
    })
    .then(() => 'everything'.should.be.ok()));

  it('should fail validation when user not match', () =>
    model('login').validate({
      provider: 'models',
      user: 'hacker',
      session,
    })
    .catch(error => error.should.have.properties(['code', 'message'])));

  it('should return true when logged user is the owner of repo', () =>
    model('login').isLoggedIn({
      provider: 'models',
      user: 'tester',
      session,
    })
    .then(result => result.should.equal(true)));

  it('should return false when logged user is not the owner of repo', () =>
    model('login').isLoggedIn({
      provider: 'models',
      user: 'hacker',
      session,
    })
    .catch(result => result.should.equal(false)));
});
