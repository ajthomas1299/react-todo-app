// Timer for Task app
import React, { useState, useEffect } from "react";

// setup interval
const Timer = () => {
  // Setup temp memory.
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // no more javascript section.
  return (
    <div id="timer-main">
      <div id="timer-parent">
        <div id="digital-timer">{seconds}</div>
      </div>
    </div>
  );
};

export default Timer;
///////////////////////////////////////////////////////////////////////
