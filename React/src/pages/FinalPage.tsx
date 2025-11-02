import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RouteMap from "./RouteMap";
import "./FinalPage.css";

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
}

const FinalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSchedule = location.state?.selectedSchedule as Schedule;

  const encodedPolyline = "wxptI|mlR``@~[rZ`{@";

  return (
    <div className="final-app">
      <header className="app-header">
        <h1>Your Schedule</h1>
      </header>

      <div className="final-content">
        <button className="page-button" onClick={() => navigate("/")}>
          Start Over
        </button>
      </div>

      {selectedSchedule && (
        <div className="schedule-details">
          <div className="time-info-container">
            <div className="time-box">
              <h3>Start Time</h3>
              <p>{selectedSchedule.start_time}</p>
            </div>
            <div className="time-box">
              <h3>End Time</h3>
              <p>{selectedSchedule.end_time}</p>
            </div>
          </div>

          <div className="map-container">
            <h3>Your Route</h3>
            <RouteMap activities={selectedSchedule.activities} />
          </div>

          <div className="activities-detail">
            <h3>Activities</h3>
            {selectedSchedule.activities?.map((activity, idx) => (
              <div key={idx} className="activity-card">
                <div className="activity-header">
                  <span className="activity-number">{idx + 1}</span>
                  <h4>{activity.venue.name}</h4>
                  {activity.venue.rating && (
                    <span className="rating">★ {activity.venue.rating}</span>
                  )}
                </div>
                <p className="activity-address">{activity.venue.address}</p>
                <div className="activity-timing">
                  <span>Start: {activity.start_time}</span>
                  <span>Duration: {activity.duration} mins</span>
                  <span>Travel: {activity.travel_time} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalPage;
