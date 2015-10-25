export const expectedLoginUrl = 'http://test/oauth/login/url';
export const expectUserUrl = 'http://test/user/url';

function getLoginUrl() {
  return Promise.resolve(expectedLoginUrl);
}

function getUserUrl(code) {
  return Promise.resolve(`${expectUserUrl}?code=${code}`);
}

function query(user) {
  return Promise.resolve([
    {
      name: `${user}-1`,
      description: `This is ${user}-1 repo.`,
    },
    {
      name: `${user}-2`,
      description: `This is ${user}-2 repo.`,
    },
  ]);
}

export function getProvider() {
  return {
    getLoginUrl,
    getUserUrl,
    query,
  };
}

export default function fakeProviders({ providers = {} }) {
  return {
    getLoginUrl: providers.getLoginUrl,
  };
}
