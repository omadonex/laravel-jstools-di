export function AbstractNotBindToConcreteException(message: string = ''): Error {
  return new Error(message);
}
