import { useEffect, useState, useReducer, createContext } from "react";
let cache = {};

function reducer(state, action) {
  switch (action.type) {
    case "pending":
      return { ...state, loading: true };
    case "resolved":
      return { loading: false, error: null, data: action.payload };
    case "error":
      return { loading: false, error: true, data: null };
    default:
      throw new Error();
  }
}
const initialState = {
  data: null,
  error: false,
  loading: true,
};

const useFetch = (
  depsArr = [],
  fetchFn,
  config = { skip: false, cacheTime: 0 }
) => {
  const [shouldRefetch, setShouldRefetch] = useState({});
  const [{ data, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { skip, cacheTime } = config;
  const refetch = () => setShouldRefetch({});
  const depsJson = JSON.stringify(depsArr);

  useEffect(() => {
    const abortController = window.AbortController
      ? new AbortController()
      : null;
    const signal = abortController?.signal;
    if (!skip) {
      (async () => {
        if (cache[depsJson]) {
          dispatch({ type: "resolved", payload: cache[depsJson] });
        } else {
          if (!loading) {
            dispatch({ type: "pending" });
          }
          try {
            const res = await fetchFn();
            if (!signal?.aborted) {
              if (res.data) {
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
    } else if (loading) {
      dispatch({ type: "resolved", payload: null });
    }
    return () => {
      if (window?.AbortController) {
        abortController.abort();
      }
    };
  }, [depsJson, shouldRefetch, skip]);
  return [data, loading, error, refetch];
};

export default useFetch;
