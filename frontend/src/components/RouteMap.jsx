import React from 'react';
import { Map, Source, Layer, Marker } from 'react-map-gl'; // Assuming you're using react-map-gl
import 'mapbox-gl/dist/mapbox-gl.css'; // Required for Mapbox styling

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJqdW5hY2hhbmRyYW52diIsImEiOiJjbTg5cHNpZ2MwMzdjMmxyMHNjcjRsMWJoIn0.OldnwVWzWiJ5ZdWr9-1Vwg'; // Replace with your Mapbox token

const RouteMap = ({ route,startStop, endStop }) => {
  const routeData = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };

  return (
    <div className="flex flex-col items-center text-white">
      <h2 className="text-2xl font-bold mb-4">Bus Route</h2>

      <Map
        initialViewState={{
          longitude: route[0][0], // Starting longitude
          latitude: route[0][1],  // Starting latitude
          zoom: 12,
        }}
        style={{ width: "100%", height: "500px", borderRadius: "10px" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Route Line */}
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route-layer"
            type="line"
            paint={{
              "line-color": "#00FF00", // Bright green for visibility
              "line-width": 4,
              "line-opacity": 0.8,
            }}
          />
        </Source>
        {/* Start Stop Marker */}
        {startStop && (
          <Marker longitude={startStop.longitude} latitude={startStop.latitude}>
            <div className="text-sm text-white p-1 bg-blue-600 rounded">
              🚏 {startStop.name}
            </div>
          </Marker>
        )}

        {/* End Stop Marker */}
        {endStop && (
          <Marker longitude={endStop.longitude} latitude={endStop.latitude}>
            <div className="text-sm text-white p-1 bg-red-600 rounded">
              🏁 {endStop.name}
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
};

export default RouteMap

