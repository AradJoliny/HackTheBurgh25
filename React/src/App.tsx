import React from "react";
import Title from "./components/Title";
import CategoryDropdown from "./components/CategoryDropdown/CategoryDropdown";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import "./App.css";
import Map from "./components/StartMap/Map";
import SubmitButton from "./components/StartMap/SubmitButton";
import Slider from "./components/StartMap/Slider";
import Time from "./components/Time";

const App: React.FC = () => {
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

  return (
    <>
      <div className="App">
        <div className="content">
          <CategoryDropdown items={items} />
          <Title />
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

export default App;
