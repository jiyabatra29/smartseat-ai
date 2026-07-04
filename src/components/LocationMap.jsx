import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationMap({ location }) {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);

  useEffect(() => {
    fetchNearbyRestaurants();
  }, []);

  const fetchNearbyRestaurants = async () => {
    try {
      const query = `
      [out:json];
      node
      ["amenity"="restaurant"]
      (around:3000,${location.lat},${location.lng});
      out;
      `;

      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      const data = await response.json();

      const filtered = data.elements.filter(
        (restaurant) => restaurant.tags?.name
      );

      setNearbyRestaurants(filtered.slice(0, 20));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mb-12">

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={14}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[location.lat, location.lng]}>
          <Popup>
            📍 You are here
          </Popup>
        </Marker>

        {nearbyRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[
              restaurant.lat,
              restaurant.lon,
            ]}
          >
            <Popup>
              <div>
                <h3 className="font-bold">
                  🍽️ {restaurant.tags.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Real restaurant from OpenStreetMap
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}

export default LocationMap;