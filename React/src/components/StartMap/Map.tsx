import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import Slider from "./Slider";
import ClickableMap from "./ClickableMap";

type MapComponentProps = {
  radius: number;
};

export default function MapComponent({ radius }: MapComponentProps) {
  const [coordsJSON, setCoordsJSON] = useState<{ coords: [number, number] }[]>(
    [],
  );

  return (
    <div>
      <MapContainer
        center={[55.9533, -3.1883]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />
        <ClickableMap setCoordsJSON={setCoordsJSON} radius={radius} />
      </MapContainer>

      <div style={{ marginTop: "10px" }}>
        <h3>Selected Coordinates (JSON format):</h3>
        <pre>{JSON.stringify(coordsJSON, null, 2)}</pre>
      </div>
    </div>
  );
}
