import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';


function ClickableMap({ setCoordsJSON,}: { setCoordsJSON: (c: {coords: [number,number] }[]) => void }) {
  // Hook to listen for clicks on the map
  useMapEvents({
    click(e) {
      const newCoords = { coords: [e.latlng.lng, e.latlng.lat] as [number,number] };
      setCoordsJSON([newCoords]);
    },
  });
  return null;
}

export default function MapComponent() {
  const [coordsJSON, setCoordsJSON] = useState<{ coords: [number, number] }[]>([]);

  return (
      <div>
    <MapContainer center={[55.9533, -3.1883]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />
        <ClickableMap setCoordsJSON={setCoordsJSON} />
        {coordsJSON.map((c, idx) => (
          <Marker key={idx} position={[c.coords[1],c.coords[0]]}>
            <Popup>Selected location</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ marginTop: '10px' }}>
        <h3>Selected Coordinates (JSON format):</h3>
        <pre>{JSON.stringify(coordsJSON, null, 2)}</pre>
      </div>
    </div>
  );
}