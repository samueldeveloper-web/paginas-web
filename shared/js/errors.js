export const reportError = (error, fallback = "Ocurrio un error inesperado.") => {
  console.error(error);
  return error?.message || fallback;
};

export const withErrorBoundary = async (task, onError) => {
  try {
    return await task();
  } catch (error) {
    onError?.(reportError(error));
    return null;
  }
};
