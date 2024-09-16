export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  // the user should not be able to see this error message
  if (!value) throw new Error("Expected 'value' to be defined but received" + value)
}
