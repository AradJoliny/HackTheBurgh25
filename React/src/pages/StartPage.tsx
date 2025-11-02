import React from "react";
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import StartPage from "../pages/StartPage";
import IntermediatePage from "../pages/IntermediatePage";
import FinalPage from "../pages/FinalPage";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Map from "../components/StartMap/Map";
import SubmitButton from "../components/StartMap/SubmitButton";
import Slider from "../components/StartMap/Slider";
import Time from "../components/Time";
import TravelMode from "../components/TravelMode";
import Title from "../components/Title";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";

const App: React.FC = () => {
    const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState<number>(1); // km
  const [travelMode, setTravelMode] = useState<string>("");

  const items = [
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

  console.log({ selectedCategories, selectedTime, coords, radius, travelMode });
  const handleSubmit = async () => {
    if (
      !coords ||
      !selectedTime ||
      selectedCategories.length === 0 ||
      !travelMode
    ) {
      alert("Please fill out all fields before submitting!");
      return;
    }

    const payload = {
      start_time: selectedTime,
      categories: selectedCategories,
      coords: coords,
      radius: radius,
      travel_mode: travelMode,
    };

    console.log("Sending to backend:", payload);

    const API_BASE = 'http://127.0.0.1:5050';

    try {
      const response = await fetch(`${API_BASE}/getChoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <Title />
      </header>

      {/* DROPDOWNS SIDE BY SIDE */}
      <div className="dropdowns-container">
        <CategoryDropdown
          items={items}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <Time selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        <TravelMode selectedMode={travelMode} setSelectedMode={setTravelMode} />
      </div>

      {/* MAP + SLIDER */}
      <main className="map-slider-container">
        <div className="map-wrapper">
          <Map radius={radius * 1000} coords={coords} setCoords={setCoords} />
        </div>
        <div className="slider-wrapper">
          <Slider radius={radius} setRadius={setRadius} />
        </div>
      </main>

      {/* SUBMIT BUTTON */}
      <footer className="submit-footer">
        <SubmitButton onClick={handleSubmit} />
          <button className="page-button" onClick={() => navigate("/intermediate")}>
            Go to Final Page
          </button>
      </footer>
    </div>
  );
};

export default App;
