import React from "react";
import Title from "../components/Title";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Map from "../components/StartMap/Map";
import SubmitButton from "../components/StartMap/SubmitButton";
import Slider from "../components/StartMap/Slider";
import Time from "../components/Time";
import { useNavigate } from "react-router-dom";

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const [radius, setRadius] = useState<number>(50); // shared radius state
  const items: string[] = [
    "Coffee",
    "Dinner",
    "Lunch",
    "Walk",
    "Movies",
    "Museum",
    "Outdoor",
    "Live Events",
    "Drinks",
    "Shopping",
  ];

  const handleNext = () => {
    navigate("/intermediate");
  };

  return (
    <>
      <div className="App">
        <div className="content">
          <CategoryDropdown items={items} />
          <Title />
          <button
            onClick={handleNext}
            style={{
              padding: "10px 20px",
              margin: "20px",
              backgroundColor: "white",
              border: "2px solid black",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="app">
        <div>
          <Title />
        </div>
        {/* Pass radius state to Map */}
        <Map radius={radius} />
        {/* Pass radius state and setter to Slider */}
        <Slider radius={radius} setRadius={setRadius} />
      </div>
      <div>
        <SubmitButton />
      </div>
      <Time />
    </>
  );
};

export default StartPage;
