import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
//import StartPage from "../pages/StartPage";
import IntermediatePage from "../pages/IntermediatePage";
import FinalPage from "../pages/FinalPage";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Map from "../components/StartMap/Map";
import SubmitButton from "../components/StartMap/SubmitButton";
import Slider from "../components/StartMap/Slider";
import Time from "../components/Time";
import TravelMode from "../components/TravelMode";
import Title from "../components/Title";
import CategoryDropdown from "../components/CategoryDropdown/CategoryDropdown";


const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [coords, setCoords] = useState<[number, number]>([55.9533, -3.1883]);
  const [radius, setRadius] = useState<number>(1);
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
    coordinates: {
      lat: coords[0],
      lng: coords[1]
    },
    radius: radius * 1000,
    travel_mode: travelMode.toUpperCase(), // Ensure uppercase
  };

  console.log("Sending to backend:", payload);

  const API_BASE = "http://127.0.0.1:5050";

  try {
    const response = await fetch(`${API_BASE}/getChoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      alert(`Error: ${errorData.message || 'Failed to submit'}`);
      return;
    }

    const data = await response.json();
    console.log("Response from backend:", data);
    navigate("/intermediate");

  } catch (error) {
    console.error("Error sending data:", error);
    alert("Network error. Please try again.");
  }
};

  return (
    <div className="app">
      <header className="app-header">
        <Title />
      </header>

      <div className="dropdowns-container">
        {/* First row - Categories (full width) */}
        <div className="dropdown-wrapper full-width">
          <label className="dropdown-label">Choose Categories (max 3)</label>
          <CategoryDropdown
            items={items}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>

        {/* Second row - Time and Transportation side by side */}
        <div className="dropdown-row">
          <div className="dropdown-wrapper">
            <label className="dropdown-label">Select Start Time</label>
            <Time
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </div>

          <div className="dropdown-wrapper">
            <label className="dropdown-label">Choose Transportation</label>
            <TravelMode
              selectedMode={travelMode}
              setSelectedMode={setTravelMode}
            />
          </div>
        </div>
      </div>

      <main className="map-slider-container">
        <div className="map-wrapper">
          <Map radius={radius * 1000} coords={coords} setCoords={setCoords} />
        </div>
        <div className="slider-wrapper">
          <Slider radius={radius} setRadius={setRadius} />
        </div>
      </main>

      <footer className="submit-footer">

    <SubmitButton onClick={handleSubmit} />


      </footer>
    </div>
  );
};

export default StartPage;