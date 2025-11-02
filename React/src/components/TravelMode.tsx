import React from "react";
import { Dropdown } from "react-bootstrap";

type Props = {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
};

const travelModes = ["Walk", "Drive", "Transit"];

const TravelMode: React.FC<Props> = ({ selectedMode, setSelectedMode }) => {
  const removeMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMode("");
  };

  return (
    <div className="d-flex flex-column">
      <Dropdown>
        <Dropdown.Toggle variant="light" className="category-dropdown-toggle">
          <div className="dropdown-content-display">
            {!selectedMode ? (
              <span className="placeholder-text">Select Travel Mode...</span>
            ) : (
              <span className="category-tag">
                {selectedMode}
                <button className="remove-tag" onClick={removeMode}>
                  ×
                </button>
              </span>
            )}
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {travelModes.map((mode) => (
            <Dropdown.Item key={mode} onClick={() => setSelectedMode(mode)}>
              {mode}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default TravelMode;
