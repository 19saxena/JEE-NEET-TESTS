import React, { useState, useEffect } from "react";
import axios from "axios";

function TestPage({ examType = "JEE", subject = "Physics", topic = "Mechanics", timerDuration, onSubmit }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `?examType=${examType}&subject=${subject}&topic=${topic}`;
    axios
      .get(`http://localhost:5000/test${query}`)
      .then((response) => {
        console.log("Server response:", response.data); // Log the response
        setQuestions(response.data || []);  // Ensure questions is always an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      });
  }, [examType, subject, topic]);
  

  if (loading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div>
      <h1>{examType} - {subject} - {topic}</h1>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        questions.map((q, index) => (
          <div key={index}>
            <h3>{q.question}</h3>
            <ul>
              {q.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          </div>
        ))
      )}
      <button onClick={onSubmit}>Submit Test</button>
    </div>
  );
}

export default TestPage;
