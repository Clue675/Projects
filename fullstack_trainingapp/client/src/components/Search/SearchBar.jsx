import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Auth/AuthContext';  // Import AuthContext

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { token } = useContext(AuthContext);  // Use token from AuthContext

  useEffect(() => {
    if (query) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }  // Add this line for Authorization
      };
      axios.get(`http://localhost:5000/search?query=${query}`, config)
        .then(response => {
          setResults(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    }
  }, [query, token]);  // Add token dependency

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search for training..." 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
      />
      <table border="1">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Badge Number</th>
            <th>Work Center</th>
            <th>Training Title</th>
            <th>Trainer</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.firstName}</td>
              <td>{result.lastName}</td>
              <td>{result.badgeNumber}</td>
              <td>{result.workCenter}</td>
              <td>{result.trainingTitle}</td>
              <td>{result.trainer}</td>
              <td>{result.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchBar;

