export function getProvider(provider) {
  // TODO catch exception if provider not support
  return require(`./${provider}`);
}
