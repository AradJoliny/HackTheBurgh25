import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

type TimeDropdownProps = {
  times: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
};

const TimeDropdown: React.FC<TimeDropdownProps> = ({ times, selectedTime, onSelect }) => {
  return (
    <DropdownButton
      id="time-dropdown"
      title={selectedTime || "Please select a start time"}
      onSelect={(time) => time && onSelect(time)}

    >
      {times.map((time, idx) => (
        <Dropdown.Item key={idx} eventKey={time}>
          {time}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default TimeDropdown;