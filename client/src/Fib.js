import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function renderSeenIndexes(seenIndexes) {
  return seenIndexes.map(({ number }) => number).join(", ");
}

function renderValues(values) {
  const entries = [];

  for (let key in values) {
    entries.push(
      <div key={key}>
        For index {key} I calculated {values[key]}
      </div>
    );
  }

  return entries;
}

export default function Fib() {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  const fetchValues = useCallback(async () => {
    const fetchedValues = await axios.get("/api/values/current");
    setValues(fetchedValues.data);
  }, []);

  const fetchIndexes = useCallback(async () => {
    const fetchedSeenIndexes = await axios.get("/api/values/all");
    setSeenIndexes(fetchedSeenIndexes.data);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await axios.post("/api/values", { index });
      await fetchValues();
      await fetchIndexes();
    },
    [index, fetchIndexes, fetchValues]
  );

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchValues, fetchIndexes]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input value={index} onChange={(e) => setIndex(e.target.value)} />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes(seenIndexes)}
      <h3>Calculated values:</h3>
      {renderValues(values)}
    </div>
  );
}
