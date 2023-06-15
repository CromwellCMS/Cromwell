export const getFieldErrorFromState = (name: string, formState: any): { type: string; message: string } | undefined => {
  if (!formState?.errors) return;
  let error = formState?.errors;
  for (const key of name.split('.')) {
    if (!error[key]) return;
    error = error[key];
  }
  return error;
};

export const getFieldErrorMessageFromState = (name: string, formState: any): string | undefined => {
  const error = getFieldErrorFromState(name as string, formState);
  return error ? error?.message || 'Invalid field' : undefined;
};
