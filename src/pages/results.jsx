import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResultsPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('/test/results', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error.response.data.message);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="results-page">
      <h1>Your Results</h1>
      <ul>
        {results.map((test, index) => (
          <li key={index}>
            {test.examType} - {test.score} Marks on {new Date(test.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
