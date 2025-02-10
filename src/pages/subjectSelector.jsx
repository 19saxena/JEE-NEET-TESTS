import React from "react";

const SubjectSelector = ({ subjects, currentSubject, onSubjectChange }) => {
  return (
    <div className="subject-selector flex justify-center gap-4 mb-4">
      {subjects.map((subject) => (
        <button
          key={subject}
          className={`px-6 py-3 text-lg rounded-lg ${
            currentSubject === subject
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSubjectChange(subject)}
        >
          {subject}
        </button>
      ))}
    </div>
  );
};

export default SubjectSelector;
