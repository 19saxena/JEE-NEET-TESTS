import React, { useState, useEffect } from "react";

const Timer = ({ initialMinutes = 60, onTimeUp }) => {
  const [time, setTime] = useState(initialMinutes * 60);

  useEffect(() => {
    if (time === 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const timerId = setInterval(() => setTime((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [time, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-2 bg-gray-200 rounded-md text-center">
      <h1 className="text-xl font-semibold">Time Left</h1>
      <p className="text-2xl font-bold text-red-500">{formatTime(time)}</p>
    </div>
  );
};

export default Timer;
