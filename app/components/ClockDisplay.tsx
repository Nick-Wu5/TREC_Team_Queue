import React, { useEffect, useState } from "react";

/**
 * ClockDisplay component shows the current time in a formatted manner
 * and includes a header text for the TREC QUEUE.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered ClockDisplay component containing a
 * header and the current formatted time.
 */
const ClockDisplay: React.FC = () => {
  const [time, setTime] = useState(new Date()); //A state variable initalized with the current date and time

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Format the time as HH:MM AM/PM
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="clock-display">
      <div className="trec-text">TREC QUEUE</div>
      <div className="time-text">{formattedTime}</div>
    </div>
  );
};

export default ClockDisplay;
