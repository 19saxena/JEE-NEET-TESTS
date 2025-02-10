import React from "react";

const Card = ({ children, className }) => {
  return <div className={`rounded-2xl p-4 shadow-lg ${className}`}>{children}</div>;
};

const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export { Card, CardContent };
