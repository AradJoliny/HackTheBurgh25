import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

type Props = {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
};

const travelModes = ["WALK", "DRIVE", "TRANSIT"];

const TravelMode: React.FC<Props> = ({selectedMode, setSelectedMode}) => {

  const handleSelect = (mode: string | null) => {
    if (mode) setSelectedMode(mode);
  };

  return (
    <div className="d-flex flex-column">
      <DropdownButton
        id="travel-mode-dropdown"
        title={selectedMode || "Select Travel Mode"}
        onSelect={handleSelect}
        menuVariant="light"
      >
        {travelModes.map((mode, idx) => (
          <Dropdown.Item key={idx} eventKey={mode}>
            {mode}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      {selectedMode && (
        <p className="mt-2">Selected Travel Mode: <strong>{selectedMode}</strong></p>
      )}
    </div>
  );
};

export default TravelMode;