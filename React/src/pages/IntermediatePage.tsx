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

                    const cleanedSchedules = schedulesArray.map(removeDuplicateVenues);

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

    const calculate_total_duration = (schedule: Schedule): number => {
        if (!schedule.activities || schedule.activities.length === 0) {
            return 0;
        }

        return schedule.activities.reduce((total, activity) => {
            return total + activity.duration + activity.travel_time;
        }, 0);
    };

    const removeDuplicateVenues = (schedule: Schedule): Schedule => {
      const seenPlaceIds = new Set<string>();
      const uniqueActivities: Activity[] = [];

      schedule.activities?.forEach((activity) => {
        const placeId = activity.venue.name; // Use name as fallback if no place_id
        if (!seenPlaceIds.has(placeId)) {
          seenPlaceIds.add(placeId);
          uniqueActivities.push(activity);
        }
      });

      return {
        ...schedule,
        activities: uniqueActivities,
        total_activities: uniqueActivities.length
      };
    };

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
            <header className="app-header">
                <h1>Recommendations</h1>
            </header>

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
                        navigate("/final", {state: {selectedSchedule: schedule}});
                    }}
                >
                    <h2>{labels[idx]}</h2>
                    <div className="schedule-summary">
                        <p className="time-info">
                            <strong>{schedule.start_time} - {schedule.end_time}</strong>
                        </p>
                        <p>
                            <strong>Duration:</strong> {calculate_total_duration(schedule)} minutes (
                            {(calculate_total_duration(schedule) / 60).toFixed(1)} hours)
                        </p>
                        <p>
                            <strong>Activities:</strong> {schedule.activities?.length || 0}
                        </p>
                    </div>

                    {schedule.activities && schedule.activities.length > 0 ? (
                        <div className="activities-list">
                            {schedule.activities.map((activity, actIdx) => (
                                <div key={actIdx} className="activity-item">
                                    <p className="activity-name">
                                        <strong>
                                            {actIdx + 1}. {activity.venue.name}
                                            {activity.venue.rating && ` ★ ${activity.venue.rating}`}
                                        </strong>
                                    </p>
                                    <p className="activity-details">
                                        Start: {activity.start_time} |
                                        Duration: {activity.duration} mins |
                                        Travel: {activity.travel_time} mins
                                    </p>
                                    <p className="activity-meta">
                                        {activity.venue.rating && activity.venue.types?.length > 0 && " • "}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No activities</p>
                    )}
                </div>
            ))}
        </div>
    );
}
export default IntermediatePage;
