import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AnalysisPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.topicAnalysis || state.topicAnalysis.length === 0) {
    return <div>No analysis available.</div>;
  }

  const { topicAnalysis } = state;

  // Group by subject
  const groupedBySubject = topicAnalysis.reduce((acc, q) => {
    if (!acc[q.subject]) acc[q.subject] = [];
    acc[q.subject].push(q);
    return acc;
  }, {});

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      {Object.keys(groupedBySubject).map((subject) => (
        <div key={subject}>
          <h1>Analysis for {subject}</h1>
          {Object.entries(
            groupedBySubject[subject].reduce((acc, q) => {
              if (!acc[q.topic]) acc[q.topic] = [];
              acc[q.topic].push(q);
              return acc;
            }, {})
          ).map(([topic, questions]) => (
            <div key={topic}>
              <h2>Topic: {topic}</h2>
              {questions.map((question, index) => (
                <div key={index}>
                  <h3>Question {index + 1}</h3>
                  <p>{question.question}</p>
                  <p>Correct Answer: {question.correctAnswer}</p>
                  <p>Your Answer: {question.userAnswer}</p>
                  <p>Status: {question.status}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnalysisPage;
