import React from "react";

interface RouteMapProps {
  activities: Array<{
    venue: {
      location: { lat: number; lng: number };
      name: string;
    };
  }>;
}

const RouteMap: React.FC<RouteMapProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p>No route to display</p>;
  }

  // Get origin (first activity)
  const origin = activities[0].venue.location;

  // Get destination (last activity)
  const destination = activities[activities.length - 1].venue.location;

  // Get waypoints (middle activities)
  const waypoints = activities
    .slice(1, -1)
    .map(act => `${act.venue.location.lat},${act.venue.location.lng}`)
    .join('|');

  // Build Google Maps Directions URL
    // @ts-ignore
    const mapsUrl = `https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.GOOGLE_PLACES_API_KEY}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}${waypoints ? `&waypoints=${waypoints}` : ''}&mode=walking`;
  return (
    <iframe
      width="100%"
      height="450"
      style={{ border: 0, borderRadius: '8px' }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={mapsUrl}
    />
  );
};

export default RouteMap;
