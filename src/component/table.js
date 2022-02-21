import React from "react";

const Table = ({ loading, data,handlePrevious,handleNext, page }) => {
  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        data.map((person) => (
          <p key={person.id}>{`${person.first_name} ${person.last_name}`}</p>
        ))
      )}
      <div className="pagination">
        <button onClick={handlePrevious}>previous</button>
        <h4 className="page">{page}</h4>
        <button onClick={handleNext}>next</button>
      </div>
    </div>
  );
};

export default Table;
