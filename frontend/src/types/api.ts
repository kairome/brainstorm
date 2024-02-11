export interface ApiFormError {
  message: string,
  name: string,
}

export interface ApiFormErrors {
  errors: ApiFormError[],
}

export interface ApiError {
  message: string,
}