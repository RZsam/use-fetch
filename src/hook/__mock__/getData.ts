export const getData = (arg?: number) => {
  return new Promise<string>((resolve) =>
    setTimeout(() => resolve(arg ? `data-${arg}` : "data"), Math.random() * 500)
  );
};

export const getDataError = (arg?: number) => {
  return new Promise<string>((_, reject) =>
    setTimeout(() => reject(), Math.random() * 500)
  );
};
