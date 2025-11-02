import { useState } from "react";
import { Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import { LatLngExpression } from "leaflet";

export default function ClickableMap({
  setCoordsJSON,
  radius,
}: {
  setCoordsJSON: (c: { coords: [number, number] }[]) => void;
  radius: number;
}) {
  const [clickedPoints, setClickedPoints] = useState<LatLngExpression[]>([]);

  // Hook to listen for clicks on the map

  useMapEvents({
    click(e) {
      const newPoint: LatLngExpression = [e.latlng.lat, e.latlng.lng];
      setClickedPoints([newPoint]);

      const newCoords = {
        coords: [e.latlng.lng, e.latlng.lat] as [number, number],
      };
      setCoordsJSON([newCoords]);
    },
  });

  return (
    <>
      {clickedPoints.map((point, idx) => (
        <div key={idx}>
          <Marker position={point}>
            <Popup>Selected Location</Popup>
          </Marker>
          <Circle
            center={point}
            radius={radius}
            pathOptions={{ color: "blue" }}
          />
        </div>
      ))}
    </>
  );
}
