import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// declare prop shape
interface RouteMapProps {
  encodedPolyline: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const libraries: "geometry"[] = ["geometry"];

//
const RouteMap: React.FC<RouteMapProps> = ({ encodedPolyline }) => {
  // hold a ref to map
  const mapRef = useRef<google.maps.Map | null>(null);
  // todo remove snapped path
  const [snappedPath, setSnappedPath] = useState<
    { lat: number; lng: number }[]
  >([]);

  // load api key to google maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Decode encoded polyline once map is loaded
  const decodedPath = isLoaded
    ? google.maps.geometry.encoding.decodePath(encodedPolyline)
    : [];

  // Set default mode to driving for now
  const travelMode = google.maps.TravelMode.DRIVING;

  // Convert Latlng objects to simple {lat, lng} format
  const originalPath = decodedPath.map((point) => ({
    lat: point.lat(),
    lng: point.lng(),
  }));

  // Snap to roads TODO change this to call route api
  useEffect(() => {
    if (!isLoaded || originalPath.length === 0) return;

    const pathParam = originalPath.map((p) => `${p.lat},${p.lng}`).join("|");

    const snapUrl = `https://roads.googleapis.com/v1/snapToRoads?path=${pathParam}&interpolate=true&key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`;

    fetch(snapUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!data.snappedPoints) {
          console.error("No snapped points returned:", data);
          return;
        }

        const snapped = data.snappedPoints.map((p: any) => ({
          lat: p.location.latitude,
          lng: p.location.longitude,
        }));

        console.log("Snapped path:", snapped);
        setSnappedPath(snapped);
      })
      .catch((err) => console.error("Error snapping to roads:", err));
  }, [isLoaded, encodedPolyline]);

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const displayPath = snappedPath.length > 0 ? snappedPath : originalPath;
  const center = displayPath[0] || { lat: 52.36045, lng: -0.14927 };

  return (
    <div>
      <p>Route with {displayPath.length} points</p>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={(map) => {
          mapRef.current = map;

          // Draw polyline
          const polyline = new google.maps.Polyline({
            path: displayPath,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: map,
          });
        }}
      >
        {/* Add markers at start and end */}
        {displayPath.length > 0 && (
          <>
            <Marker position={displayPath[0]} label="START" />
            <Marker
              position={displayPath[displayPath.length - 1]}
              label="END"
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default RouteMap;
