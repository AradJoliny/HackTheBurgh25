import React from "react";
import Title from "./components/Title";
import CategoryDropdown from "./components/CategoryDropdown/CategoryDropdown";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Map from "./components/StartMap/Map";
import SubmitButton from "./components/StartMap/SubmitButton";
import Slider from "./components/StartMap/Slider";
import Time from "./components/Time";
import TravelMode from "./components/TravelMode";

const App: React.FC = () => {
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

  console.log({selectedCategories, selectedTime, coords, radius, travelMode});
  const handleSubmit = async () => {
    if (!coords || !selectedTime || selectedCategories.length === 0 || !travelMode) {
      alert("Please fill out all fields before submitting!");
      return;
    }

    const payload = {
  "start-time": selectedTime,
  categories: selectedCategories,
  coords: coords,
  radius: radius,
  travelMode: travelMode,
};


    console.log("Sending to backend:", payload);

    try {
      const response = await fetch("http://localhost:5000/api/start", {
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
    <div className="app bg-light min-vh-100 d-flex flex-column justify-content-between">
      {/* HEADER */}
      <header className="text-center py-4 shadow-sm bg-white">
        <Title />
      </header>

      {/* DROPDOWNS SIDE BY SIDE */}
      <div className="d-flex gap-3 flex-wrap justify-content-center mb-3">
        <div className="flex-grow-1" style={{ minWidth: "200px" }}>
          <CategoryDropdown items={items} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>
        </div>
        <div className="flex-grow-1" style={{ minWidth: "200px" }}>
          <Time selectedTime={selectedTime} setSelectedTime={setSelectedTime}  />
        </div>
        <div className="flex-grow-1" style={{ minWidth: "200px" }}>
          <TravelMode selectedMode={travelMode} setSelectedMode={setTravelMode}/>
        </div>
      </div>

      {/* MAP + SLIDER */}
      <main className="container mb-4 d-flex justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="map-container shadow rounded mb-3">
            <Map radius={radius * 1000} coords={coords} setCoords={setCoords} />
          </div>
          <div className="slider-container">
            <Slider radius={radius} setRadius={setRadius} />
          </div>
        </div>
      </main>

      {/* SUBMIT BUTTON */}
      <footer className="text-center py-4 bg-white shadow-sm">
        <SubmitButton onClick={handleSubmit} />
      </footer>
    </div>
  );
};

export default App;