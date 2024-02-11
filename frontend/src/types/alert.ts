export interface AlertPayload {
  type: 'success' | 'info' | 'error',
  message: string,
  timeout?: number, // in seconds
}

export interface AlertStateItem extends AlertPayload {
  id: string,
}