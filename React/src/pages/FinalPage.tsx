import React from "react";
import { useNavigate } from "react-router-dom";
import RouteMap from "./RouteMap"; // Import the RouteMap component
import "./FinalPage.css";

const FinalPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedTime = localStorage.getItem("selectedTime");

  // Test polyline
  const encodedPolyline = "wxptI|mlR``@~[rZ`{@";

  return (
    <div className="final-page-container">
      <div className="section title-section">
        <h2>Title</h2>
        <button className="Button" onClick={() => navigate("/")}>
          Start Over
        </button>
      </div>

      <div className="time-container">
        <div className="section time-section">
          <h3>Start Time</h3>
          <p>{selectedTime || "No time selected"}</p>
        </div>

        <div className="section time-section">
          <h3>Estimated End Time</h3>
          <p>...</p>
        </div>
      </div>

      <div className="section map-section">
        <h3>Your Route</h3>
        <RouteMap encodedPolyline={encodedPolyline} />
      </div>
    </div>
  );
};

export default FinalPage;
