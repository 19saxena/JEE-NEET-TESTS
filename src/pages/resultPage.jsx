import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();

  const { state } = useLocation();
const { subjectResults, topicAnalysis } = state || {};

  const navigate = useNavigate();

  if (!Object.keys(subjectResults).length) {
    return <div>No results found.</div>;
  }

  const handleSubjectAnalysis = (subject) => {
    if (!subjectResults[subject]) {
      alert("No data for this subject");
      return;
    }
  
    navigate("/analysis", {
      state: {
        subject,
        topicAnalysis, // Pass detailed topic results
      },
    });
  };
  

  return (
    <div>
      <h1>Test Results</h1>
      {Object.keys(subjectResults).map((subject) => (
        <div key={subject}>
          <h2>{subject}</h2>
          <p>
            Correct: {subjectResults[subject]?.correct || 0} / Total:{" "}
            {subjectResults[subject]?.total || 0}
          </p>
          <p>Accuracy: {subjectResults[subject]?.accuracy || 0}%</p>
          <button onClick={() => handleSubjectAnalysis(subject)}>
            View {subject} Analysis
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResultPage;
