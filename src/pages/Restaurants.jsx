import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";
import LocationMap from "../components/LocationMap";

import { useEffect, useState } from "react";
import axios from "axios";

function Restaurants() {
  const [location, setLocation] = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [crowdFilter, setCrowdFilter] = useState("All");

  // User Location
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");

    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
    }
  }, []);

  // Fetch Restaurants from Backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/restaurants"
        );

        console.log("API DATA:", response.data);

        setRestaurants(response.data);
      } catch (error) {
        console.error(
          "Error fetching restaurants:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Debug
  useEffect(() => {
    console.log("STATE:", restaurants);
  }, [restaurants]);

  // Search + Filter
  const filteredRestaurants = restaurants.filter(
    (restaurant) => {
      const matchesSearch = restaurant.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCrowd =
        crowdFilter === "All" ||
        restaurant.crowdLevel === crowdFilter;

      return matchesSearch && matchesCrowd;
    }
  );

  console.log("FILTERED:", filteredRestaurants);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-100 pt-32 px-8">
        <h1 className="text-5xl font-bold text-center mb-10">
          Nearby Restaurants
        </h1>

        {location && (
          <div className="flex justify-center mb-10">
            <div className="bg-white shadow-lg rounded-2xl px-8 py-5">
              <p className="font-semibold text-blue-600 text-lg">
                📍 Location Detected Successfully
              </p>

              <p className="text-gray-500 mt-2">
                Latitude: {location.lat.toFixed(4)}
                {" | "}
                Longitude: {location.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {location && (
          <LocationMap location={location} />
        )}

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mt-12 mb-10">
          <input
            type="text"
            placeholder="Search restaurant..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="flex-1 px-5 py-3 rounded-xl border bg-white"
          />

          <select
            value={crowdFilter}
            onChange={(e) =>
              setCrowdFilter(e.target.value)
            }
            className="px-5 py-3 rounded-xl border bg-white"
          >
            <option value="All">All Crowds</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {loading && (
          <p className="text-center text-lg font-medium">
            Loading restaurants...
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-20">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              id={restaurant._id}
              image={restaurant.image}
              name={restaurant.name}
              rating={restaurant.rating}
              crowd={restaurant.crowdLevel}
              waitTime={restaurant.waitTime}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Restaurants;