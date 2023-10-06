import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthContext";
import "./HomePage.css";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        if (query) {
          const response = await axios.get(`http://localhost:5000/search?query=${query}`, config);
          const updatedResults = response.data.data.map((result) => {
            return {
              ...result,
              "Work Center": "PLACEHOLDER"  // Adding a placeholder for the work center
            };
          });
          setResults(updatedResults);
        }
      } catch (err) {
        console.error("An error occurred:", err);
      }
    };

    fetchData();
  }, [query, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Search for training..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Badge Number</th>
            <th>Training Title</th>
            <th>Trainer</th>
            <th>Date</th>
            <th>Work Center</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result['First Name']}</td>
              <td>{result['Last Name']}</td>
              <td>{result['Badge Number']}</td>
              <td>{result['Training Title']}</td>
              <td>{result.Trainer}</td>
              <td>{result.Date}</td>
              <td>{result['Work Center']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
