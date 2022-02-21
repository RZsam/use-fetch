import React, { useState } from "react";
import { useQuery } from "react-query";
import Table from "../../component/table";

const ReactQuery = () => {
  const [page, setPage] = useState(1);

  const handleNext = () => setPage((p) => p + 1);
  const handlePrevious = () => {
    if (page === 1) return;
    setPage((p) => p - 1);
  };

  const { isLoading, isError, data, error } = useQuery(
    ["getList", page],
    ()=>getList(page)
  );

  console.log("render");
  return (
    <div>
      <h1>react-query</h1>
      <Table
        data={data?.data}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        loading={isLoading}
        page={page}
      />
    </div>
  );
};

export default ReactQuery;

const getList = (page) =>
  fetch(`https://reqres.in/api/users?page=${page}&per_page=2`)
    .then((res) => res.json())
    .then((res) => res);
