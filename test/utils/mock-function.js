export default function mockFunction(value) {
  const calls = [];

  function fn(...args) {
    calls.push(args);
    const result = typeof value === 'function' ? value(...args) : value;
    return Promise.resolve(result);
  }

  fn.calls = calls;
  return fn;
}
