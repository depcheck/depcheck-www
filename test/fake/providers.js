export const expectedLoginUrl = 'http://test/oauth/login/url';

function getLoginUrl() {
  return Promise.resolve(expectedLoginUrl);
}

export function getProvider() {
  return {
    getLoginUrl,
  };
}
