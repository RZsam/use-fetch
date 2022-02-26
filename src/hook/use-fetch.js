import { useEffect, useState, useReducer, createContext } from "react";
let cache = {};

function reducer(state, action) {
  switch (action.type) {
    case "pending":
      return { ...state, loading: true };
    case "successfull":
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
  loading: false,
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
        dispatch({ type: "pending" });
        try {
          if (cache[depsJson]) {
            dispatch({ type: "successfull", payload: cache[depsJson] });
          } else {
            const res = await fetchFn();
            if (!signal?.aborted) {
              if (res.data) {
                if (cacheTime) {
                  cache[depsJson] = res;
                  setTimeout(() => {
                    delete cache[depsJson];
                  }, cacheTime);
                }
                dispatch({ type: "successfull", payload: res });
              } else {
                setError("error");
                dispatch({ type: "error" });
              }
            }
          }
        } catch (e) {
          setError(e);
        }
      })();
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
