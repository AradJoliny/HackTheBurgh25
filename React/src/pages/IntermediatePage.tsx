import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const IntermediatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState<string[][]>([]);

  useEffect(() => {
    const mockData = [
      ["Coffee at BrewLab", "Walk in the park", "Quick museum visit"], // Short
      ["Lunch at Dishoom", "Bowling with friends", "Mini golf"], // Medium
      ["Hike up Arthur’s Seat", "City sightseeing", "Kayaking trip"], // Long
      ["Trip to St Andrews", "Day at the beach", "Road trip to Glasgow"], // Full-day
    ];
    setActivitiesData(mockData);
  }, []);

  const labels = [
    "Short activities",
    "Medium activities",
    "Long activities",
    "Full day activities",
  ];

  return (
    <div className="intermediate-app">
      <h1> Recommendations </h1>

      <div className="intermediate-content">
        <h1></h1>
        <p>This is the middle step</p>
        <button className="page-button" onClick={() => navigate("/final")}>
          Go to Final Page
        </button>
        <button className="page-button" onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      {labels.map((label, idx) => (
        <div
          key={idx}
          className="activity-button"
          onClick={() => navigate("/final")}
        >
          <h1>{label}</h1>
          <p>{activitiesData[idx]?.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

export default IntermediatePage;
