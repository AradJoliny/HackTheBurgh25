import React, { useState } from "react";
import TimeDropdown from "./TimeDropdown";

type Props = {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
};

const Time: React.FC<Props> = ({selectedTime, setSelectedTime}) => {

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

  const jsonString = selectedTime
    ? JSON.stringify({ "start-time": selectedTime })
    : "";

  return (
    <div className="d-flex flex-column align-items-start my-3">


      <TimeDropdown
        times={times}
        selectedTime={selectedTime}
        onSelect={setSelectedTime}
      />

      {selectedTime && <p>Selected start time: {selectedTime}</p>}
      {selectedTime && (
        <pre className="bg-light p-2 rounded">{jsonString}</pre>
      )}
    </div>
  );
};
export default Time;
