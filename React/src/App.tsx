import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import IntermediatePage from "./pages/IntermediatePage";
import FinalPage from "./pages/FinalPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Map from "./components/StartMap/Map";
import SubmitButton from "./components/StartMap/SubmitButton";
import Slider from "./components/StartMap/Slider";
import Time from "./components/Time";
import TravelMode from "./components/TravelMode";
import Title from "./components/Title";
import CategoryDropdown from "./components/CategoryDropdown/CategoryDropdown";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/intermediate" element={<IntermediatePage />} />
          <Route path="/final" element={<FinalPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
