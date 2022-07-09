
export const getData = () => {
  return new Promise((resolve) =>
    setTimeout(resolve("data"), Math.random() * 500)
  );
};

