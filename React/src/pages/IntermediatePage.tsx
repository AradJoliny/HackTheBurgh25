import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface Activity {
  venue: {
    name: string;
    address: string;
    types: string[];
    rating?: number;
    location: { lat: number; lng: number };
  };
  travel_time: number;
  start_time: string;
  duration: number;
}

interface Schedule {
  duration: string;
  activities: Activity[];
  start_time: string;
  end_time: string;
  total_activities: number;
  // Add other fields your API returns
}

const IntermediatePage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);

        const API_BASE = 'http://127.0.0.1:5050';

        // Call your Flask API
        const response = await fetch(`${API_BASE}/giveSchedule`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received schedules:", data);

        // Convert object to array
        if (data.status === "ok" && data.schedules) {
          const schedulesArray = [
            data.schedules.short,
            data.schedules.medium,
            data.schedules.long
          ].filter(Boolean); // Remove any undefined/null entries

          setSchedules(schedulesArray);
        } else {
          throw new Error("Invalid response format");
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError("Failed to load schedules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const labels = ["Short activities", "Medium activities", "Long activities"];

  if (loading) {
    return (
      <div className="intermediate-app">
        <h1>Loading recommendations...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="intermediate-app">
        <h1>Error</h1>
        <p>{error}</p>
        <button className="page-button" onClick={() => navigate("/")}>
          Back to Start
        </button>
      </div>
    );
  }

  return (
    <div className="intermediate-app">
      <h1>Recommendations</h1>

      <div className="intermediate-content">
        <button className="page-button" onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      {schedules.map((schedule, idx) => (
          <div
              key={idx}
              className="activity-button"
              onClick={() => {
                // Store selected schedule in localStorage to access in FinalPage
                navigate("/final", {state: {selectedSchedule: schedule}});
              }}
          >
            <h1>{labels[idx]}</h1>
            <h1>{labels[idx]}</h1>
            <p>
              {schedule.activities && schedule.activities.length > 0
                  ? schedule.activities.map((a) => a.venue.name).join(", ")
                  : "No activities"}
            </p>
            <p className="time-info">
              {schedule.start_time} - {schedule.end_time}
            </p>
          </div>
      ))}
    </div>
  );
};

export default IntermediatePage;
