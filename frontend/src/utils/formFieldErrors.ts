function toMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

export function formatFieldErrors(errors: readonly unknown[]): string {
  return errors.map(toMessage).join(', ');
}
