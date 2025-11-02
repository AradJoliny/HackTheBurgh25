
import { useState } from 'react';
import {Marker, Popup, useMapEvents, Circle} from 'react-leaflet';
import {LatLngExpression} from 'leaflet';

type ClickableMapProps = {
  setCoords: (coords: [number, number]) => void;
  radius: number;
};

export default function ClickableMap({ setCoords, radius }: ClickableMapProps) {
  const [clickedPoint, setClickedPoint] = useState<LatLngExpression | null>(null);

  useMapEvents({
    click(e) {
      const newPoint: LatLngExpression = [e.latlng.lat, e.latlng.lng];
      setClickedPoint(newPoint);
      setCoords([e.latlng.lng, e.latlng.lat]); // send back to parent (lng, lat)
    },
  });

  return (
    <>
      {clickedPoint && (
        <>
          <Marker position={clickedPoint}>
            <Popup>Selected Location</Popup>
          </Marker>
          <Circle center={clickedPoint} radius={radius} pathOptions={{ color: "pink" }} />
        </>
      )}
    </>
  );
}