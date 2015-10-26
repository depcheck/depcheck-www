export default function mockFunction(value) {
  const calls = [];

  function fn(...args) {
    calls.push(args);
    return Promise.resolve(value);
  }

  fn.calls = calls;
  return fn;
}
