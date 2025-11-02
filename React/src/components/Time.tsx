import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

type Props = {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
};

const Time: React.FC<Props> = ({ selectedTime, setSelectedTime }) => {
  const generateTimes = () => {
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

  const removeTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTime("");
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" className="category-dropdown-toggle">
        <div className="dropdown-content-display">
          {!selectedTime ? (
            <span className="placeholder-text">Select time...</span>
          ) : (
            <span className="category-tag">
              {selectedTime}
              <button className="remove-tag" onClick={removeTime}>
                ×
              </button>
            </span>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
        {times.map((time) => (
          <Dropdown.Item key={time} onClick={() => setSelectedTime(time)}>
            {time}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Time;
