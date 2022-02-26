import React, { useCallback, useState } from "react";
import Table from "../../component/table";
import useFetch from "../../hook/use-fetch";

const Custom = () => {
  const [page, setPage] = useState(1);

  const [data, loading] = useFetch(["getList", page], () => getList(page), {
    // cacheTime: 50000,
  });

  const handleNext = () => setPage((p) => p + 1);
  const handlePrevious = () => {
    if (page === 1) return;
    setPage((p) => p - 1);
  };
  console.log("render");

  return (
    <div>
      <h1>custom</h1>
      <Table
        data={data?.data || []}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        loading={loading}
        page={data?.page}
      />
    </div>
  );
};

export default Custom;

const getList = (page) =>
  fetch(`https://reqres.in/api/users?page=${page}&per_page=2`)
    .then((res) => res.json())
    .then((res) => res);
