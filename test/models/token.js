/* global describe, it */

import 'should';
import model from '../utils/model';
import mockFunction from '../utils/mock-function';

describe('model token', () => {
  it('should get the token from the token table', () => {
    const tableQuery = mockFunction([{
      token: 'my-token',
    }]);

    const tokenModel = model('token', {
      '../services': {
        table: {
          query: tableQuery,
        },
      },
    });

    return tokenModel.get({
      provider: 'models',
      user: 'tester',
      repo: 'project',
    })
    .then(token => token.should.equal('my-token'))
    .then(() => {
      tableQuery.calls[0][0].should.equal('token');
      tableQuery.calls[0][1].limit.should.equal(1);
      tableQuery.calls[0][1].filter.should.property('id');
    });
  });

  it('should throw response error when token not exists in table', () => {
    const tokenModel = model('token', {
      '../services': {
        table: {
          query: mockFunction([]),
        },
      },
    });

    return tokenModel.get({
      provider: 'models',
      user: 'tester',
      repo: 'project',
    })
    .catch(response => {
      response.stack.should.not.be.empty();
      response.message.should.not.be.empty();
      response.should.have.properties({
        isResponse: true,
        statusCode: 400,
      });
    });
  });

  it('should pass validation when token matches', () => {
    const tokenModel = model('token', {
      '../services': {
        table: {
          query: mockFunction([{
            token: 'my-token',
          }]),
        },
      },
    });

    return tokenModel.validate({
      provider: 'models',
      user: 'tester',
      repo: 'project',
      token: 'my-token',
    })
    .then(() => 'everything'.should.be.ok());
  });

  it('should throw response error when token not matches', () => {
    const tokenModel = model('token', {
      '../services': {
        table: {
          query: mockFunction([{
            token: 'my-token',
          }]),
        },
      },
    });

    return tokenModel.validate({
      provider: 'models',
      user: 'tester',
      repo: 'project',
      token: 'hack-token',
    })
    .catch(response => {
      response.stack.should.not.be.empty();
      response.message.should.not.be.empty();
      response.should.have.properties({
        isResponse: true,
        statusCode: 401,
      });
    });
  });
});
