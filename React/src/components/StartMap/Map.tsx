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
import "leaflet/dist/leaflet.css";
import "./Map.css";
import Slider from "./Slider";
import ClickableMap from "./ClickableMap";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
// import "../leaflet-config";

type MapComponentProps = {
  coords: [number, number] | null;
  setCoords: (coords: [number, number]) => void;
  radius: number;
};

export default function MapComponent({
  coords,
  setCoords,
  radius,
}: MapComponentProps) {
  return (
    <div>
      <MapContainer
        center={[55.9533, -3.1883]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
        />
        {/* ClickableMap will update coords in parent via setCoords */}
        <ClickableMap coords={coords} setCoords={setCoords} radius={radius} />
      </MapContainer>

      <div style={{ marginTop: "10px" }}>
        <h3>Selected Coordinates (JSON format):</h3>
        <pre>
          {coords
            ? JSON.stringify({ coords }, null, 2)
            : "Click on the map to select a location"}
        </pre>
      </div>
    </div>
  );
}
