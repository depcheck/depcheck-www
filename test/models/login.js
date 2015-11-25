/* global describe, it */

import 'should';
import model from '../utils/model';
import mockFunction from '../utils/mock-function';

const session = {
  accessToken: 'project-token',
  login: {
    provider: 'models',
    user: 'tester',
  },
};

describe('model login', () => {
  describe('hasAccess', () => {
    it('should return true when provider repos contains target repo', () => {
      const getRepos = mockFunction(['tester/project']);

      const loginModel = model('login', {
        '../providers': {
          getProvider: () => ({ getRepos }),
        },
      });

      loginModel.hasAccess({
        session,
        provider: 'models',
        user: 'tester',
        repo: 'project',
      })
      .then(result => result.should.equal(true))
      .then(() => getRepos.calls[0][0].should.equal('project-token'));
    });

    it('should return false when provider repos not contains target repo', () => {
      const getRepos = mockFunction([]);

      const loginModel = model('login', {
        '../providers': {
          getProvider: () => ({ getRepos }),
        },
      });

      loginModel.hasAccess({
        session,
        provider: 'models',
        user: 'tester',
        repo: 'project',
      })
      .then(result => result.should.equal(false))
      .then(() => getRepos.calls[0][0].should.equal('project-token'));
    });
  });

  describe('validateAccess', () => {
    it('should pass access validation when provider repos contains target repo', () => {
      const getRepos = mockFunction(['tester/project']);

      const loginModel = model('login', {
        '../providers': {
          getProvider: () => ({ getRepos }),
        },
      });

      loginModel.validateAccess({
        session,
        provider: 'models',
        user: 'tester',
        repo: 'project',
      })
      .then(() => 'everything'.should.be.ok());
    });

    it('should fail validation when user not match', () => {
      const getRepos = mockFunction([]);

      const loginModel = model('login', {
        '../providers': {
          getProvider: () => ({ getRepos }),
        },
      });

      loginModel.validateAccess({
        session,
        provider: 'models',
        user: 'tester',
        repo: 'project',
      })
      .catch(error => error.should.have.properties({
        statusCode: 401,
        message: 'Unanthorized, please login in.',
      }));
    });
  });
});
