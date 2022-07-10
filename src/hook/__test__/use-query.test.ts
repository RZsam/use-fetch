import { renderHook, act } from "@testing-library/react-hooks";
import useFetch from "../use-query";
import { getData, getDataError } from "../__mock__/getData";

test("normal functionality ", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useFetch(["getData"], () => getData())
  );

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(false);

  await waitForNextUpdate();

  expect(result.current.data).toBe("data");
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);
});

test("enable and disable useFetch", async () => {
  let enabled = false;
  const { result, rerender, waitForNextUpdate } = renderHook(() =>
    useFetch(["getData"], () => getData(), { enabled, cacheTime: 0 })
  );

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);

  act(() => {
    enabled = true;
  });

  rerender();

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  await waitForNextUpdate();

  expect(result.current.data).toBe("data");
  expect(result.current.isLoading).toBe(false);
  act(() => {
    enabled = false;
  });

  rerender();
  expect(result.current.isLoading).toBe(false);
});

test("read from cache and erase cache ", async () => {
  let page = 1;
  const cacheTime = 1000;
  let previousData;
  const { result, waitForNextUpdate, rerender } = renderHook(() =>
    useFetch(["getData", page], () => getData(page), { cacheTime })
  );

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(false);

  await waitForNextUpdate();

  expect(result.current.data).toBe(`data-${page}`);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);

  previousData = result.current.data;

  act(() => {
    page = 2;
  });

  rerender();

  expect(result.current.data).toBe(previousData);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(null);

  await waitForNextUpdate();

  expect(result.current.data).toBe(`data-${page}`);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);

  act(() => {
    page = 1;
  });

  rerender();

  expect(result.current.data).toBe(`data-${page}`);
  expect(result.current.isLoading).toBe(false);

  await new Promise((res) => setTimeout(res, cacheTime));

  act(() => {
    page = 2;
  });
  rerender();

  expect(result.current.isLoading).toBe(true);

  await waitForNextUpdate();

  expect(result.current.data).toBe(`data-${page}`);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);
});

test("get error", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useFetch(["getData"], () => getDataError())
  );

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(false);
  await waitForNextUpdate();
  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(true);
});

test("refetch", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useFetch(["getData"], () => getData())
  );

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(false);
  await waitForNextUpdate();
  expect(result.current.data).toBe("data");
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);

  const previousData = result.current.data;
  act(() => {
    result.current.refetch();
  });
  expect(result.current.data).toBe(previousData);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(null);
  await waitForNextUpdate();
  expect(result.current.data).toBe("data");
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);
});
