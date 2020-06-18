// Clock for Task app
import React, { useState, useEffect } from "react";

//  The Clock Compnent's main function.  Everything is in here.
const Clock = () => {
  // Setup short term memory.
  const [currentTime, setCurrentTime] = useState("loading...");

  // Build the Current Timestamp to display.
  function getDateTime() {
    //
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();

    var time = now.toLocaleTimeString();

    // Structured the way I am more used to: Month Day Year, for display on screen.
    var dateTime = month + "/" + day + "/" + year + " " + time;

    return dateTime;
  }

  // Set string to our clock's state / short term memory.
  useEffect(() => {
    // Set clock to update every second.
    // The setInterval() method calls a function or
    // evaluates an expression at specified intervals (in milliseconds).
    const interval = setInterval(() => {
      setCurrentTime((currentTime) => getDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // return = no more javascript section.
  return (
    <div id="clock-main">
      <div id="clock-parent">
        <div id="digital-clock">{currentTime}</div>
      </div>
    </div>
  );
};

export default Clock;
///////////////////////////////////////////////////////////////////////
