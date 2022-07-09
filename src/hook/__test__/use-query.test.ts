import { renderHook, act } from "@testing-library/react-hooks";
import useFetch from "../use-query";
import { getData } from "../mock/getData";

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

test("cache ", async () => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useFetch(["getData"], () => getData(), { cacheTime: 2000 })
  );

  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.isError).toBe(false);

  await waitForNextUpdate();

  expect(result.current.data).toBe("data");
  expect(result.current.isLoading).toBe(false);
  expect(result.current.isError).toBe(null);
});
