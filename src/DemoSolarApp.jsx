import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GOOGLE_API_KEY = "AIzaSyB9t-BW1mYPQs71c4EzgbzsMUq_TA1h1xU"; // Replace with your key

const DemoSolarApp = () => {
  const [roofBounds, setRoofBounds] = useState(null);
  const [panels, setPanels] = useState([]);

  const lat = 37.7749;
  const lon = -122.4194;
  const zoom = 20;

  useEffect(() => {
    const fetchRoofData = async () => {
      const url = `/api/solar?lat=${lat}&lon=${lon}`;
;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            location: {
              latitude: lat,
              longitude: lon
            },
            requiredQuality: "HIGH",
            view: "FULL_LAYERS"
          })
        });

        const data = await response.json();

        if (response.ok && data?.imagery?.imageryBounds) {
          const bounds = [
            [
              data.imagery.imageryBounds.southWest.latitude,
              data.imagery.imageryBounds.southWest.longitude
            ],
            [
              data.imagery.imageryBounds.northEast.latitude,
              data.imagery.imageryBounds.northEast.longitude
            ]
          ];
          setRoofBounds(bounds);
        } else {
          console.error("Solar API error:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchRoofData();
  }, []);

  const addPanel = () => {
    if (!roofBounds) return;
    const [southWest, northEast] = roofBounds;
    const latStep = 0.0001;
    const lonStep = 0.0001;
    const newPanel = [
      [southWest[0] + panels.length * latStep, southWest[1]],
      [southWest[0] + panels.length * latStep + latStep, southWest[1] + lonStep]
    ];
    setPanels([...panels, newPanel]);
  };

  return (
    <div className="w-full h-screen">
      <div className="p-4">
        <button
          onClick={addPanel}
          style={{ backgroundColor: "#3B82F6", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}
        >
          Add Panel
        </button>
      </div>
      <MapContainer center={[lat, lon]} zoom={zoom} style={{ height: "90vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {roofBounds && (
          <Rectangle bounds={roofBounds} color="green" weight={2} />
        )}
        {panels.map((bounds, i) => (
          <Rectangle key={i} bounds={bounds} color="orange" weight={1} />
        ))}
      </MapContainer>
    </div>
  );
};

export default DemoSolarApp;
