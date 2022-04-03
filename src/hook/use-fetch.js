import { useEffect, useState } from "react";
let cache = {};

/**
 *
 * @template TReq
 * @template TRes
 * @param {(string|number)[]|number|string} depsArr
 * @param {(TReq)=>Promise<TRes>} fetchFn
 * @param {{skip:boolean,cacheTime:Number}|undefined} config
 * @returns {[Awaited<TRes>,boolean,boolean,Function]}
 */
const useFetch = (
  depsArr = [],
  fetchFn,
  config = { skip: false, cacheTime: 0 }
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState({});
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
        setLoading(true);
        try {
          if (cache[depsJson]) {
            setData(cache[depsJson]);
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
                setData(res);
              } else {
                setError("error");
              }
            }
          }
        } catch (e) {
          setError(e);
        }
        if (!signal?.aborted) {
          setLoading(false);
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
