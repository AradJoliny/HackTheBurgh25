import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface Schedule {
  duration: string;
  activities: any[]; // Adjust type based on your actual data structure
  start_time: string;
  end_time: string;
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

        // Call your Flask API
        const response = await fetch("http://localhost:5000/giveSchedules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received schedules:", data);
        setSchedules(data);
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
            localStorage.setItem("selectedSchedule", JSON.stringify(schedule));
            navigate("/final");
          }}
        >
          <h1>{labels[idx] || schedule.duration}</h1>
          <p>
            {schedule.activities?.map((a) => a.name || a).join(", ") ||
              "No activities"}
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
