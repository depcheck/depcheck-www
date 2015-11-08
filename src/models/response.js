export default function response(statusCode, message) {
  const stack = new Error().stack;
  return {
    isResponse: true,
    statusCode,
    message,
    stack,
  };
}
