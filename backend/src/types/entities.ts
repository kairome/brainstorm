export interface YupError extends Error {
  errors: string[],
  inner: {
    path: string,
    message: string,
  }[],
}

export interface ValidationError {
  name: string,
  message: string,
}