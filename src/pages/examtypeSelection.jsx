import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ExamTypeSelection = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examType = searchParams.get("examType");
  const navigate = useNavigate();

  useEffect(() => {
    if (examType) {
      // Redirect to the default question page with default subject and topic
      navigate(`/exam?examType=${examType}&subject=Physics&topic=elasticity`);
    }
  }, [examType, navigate]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Starting Exam...</h1>
      <p>Redirecting you to the default question page...</p>
    </div>
  );
};

export default ExamTypeSelection;
