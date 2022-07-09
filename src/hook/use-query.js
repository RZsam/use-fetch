import { useEffect, useState, useReducer } from "react";
let cache = {};

function reducer(state, action) {
  switch (action.type) {
    case "pending":
      return { ...state, isLoading: true };
    case "resolved":
      return { isLoading: false, isError: null, data: action.payload };
    case "error":
      return { isLoading: false, isError: true, data: null };
    default:
      throw new Error();
  }
}
const initialState = {
  data: null,
  isError: false,
  isLoading: true,
};

const useQuery = (depsArr = [], fetchFn, config = {}) => {
  const [shouldRefetch, setShouldRefetch] = useState({});
  const [{ data, isLoading, isError }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { enabled = true, cacheTime = 0 } = config;
  const refetch = () => setShouldRefetch({});
  const depsJson = JSON.stringify(depsArr);

  useEffect(() => {
    const abortController = window.AbortController
      ? new AbortController()
      : null;
    const signal = abortController?.signal;
    if (enabled !== false) {
      (async () => {
        if (cache[depsJson]) {
          dispatch({ type: "resolved", payload: cache[depsJson] });
        } else {
          if (!isLoading) {
            dispatch({ type: "pending" });
          }
          try {
            const res = await fetchFn();
            if (!signal?.aborted) {
              if (res) {
                if (cacheTime) {
                  cache[depsJson] = res;
                  setTimeout(() => {
                    delete cache[depsJson];
                  }, cacheTime);
                }
                dispatch({ type: "resolved", payload: res });
              } else {
                dispatch({ type: "error" });
              }
            }
          } catch (e) {
            dispatch({ type: "error" });
          }
        }
      })();
    } else if (isLoading) {
      dispatch({ type: "resolved", payload: null });
    }
    return () => {
      if (window?.AbortController) {
        abortController.abort();
      }
    };
  }, [depsJson, shouldRefetch, enabled]);
  return { data, isLoading, isError, refetch };
};

export default useQuery;
