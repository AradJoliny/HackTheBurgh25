import React, { useState } from "react";

function Time() {
  const [selectedTime, setSelectedTime] = useState("");

  const generateTimes = () => {
    // Creates a list of times from
    const times: string[] = [];
    for (let h = 9; h < 22; h++) {
      const hour = h.toString().padStart(2, "0");
      for (let m = 0; m < 60; m += 30) {
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };
  const times = generateTimes();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  const jsonString = selectedTime
    ? JSON.stringify({ "start-time": selectedTime })
    : "";

  return (
    <div>
      <label htmlFor="start-time">Select a start time: </label>
      <select id="time" value={selectedTime} onChange={handleChange} size={10}>
        <option value="">--Select a start time--</option>
        {times.map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </select>

      {selectedTime && <p>Selected start time: {selectedTime}</p>}
    </div>
  );
}
export default Time;
