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

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

          async (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const userLocation = { lat, lng };

            setLocation(userLocation);

            localStorage.setItem(
              "userLocation",
              JSON.stringify(userLocation)
            );

            const response = await axios.get(
              `https://smartseat-ai.onrender.com/api/restaurants/nearby/${lat}/${lng}`
            );

            setRestaurants(response.data);
            setLoading(false);
          },

          async () => {

            const response = await axios.get(
              "https://smartseat-ai.onrender.com/api/restaurants"
            );

            setRestaurants(response.data);
            setLoading(false);
          }

        );

      } else {

        const response = await axios.get(
          "https://smartseat-ai.onrender.com/api/restaurants"
        );

        setRestaurants(response.data);
        setLoading(false);

      }

    } catch (error) {

      console.log(error);
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
        restaurant.crowdLevel === crowdFilter ||
        restaurant.crowd=== crowdFilter;

      return matchesSearch && matchesCrowd;
    }
  );

  console.log("FILTERED:", filteredRestaurants);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 pt-28 px-6">
       <div className="text-center mb-10">
  <h1 className="text-5xl font-bold text-slate-800">
    🍽 Nearby Restaurants
  </h1>

  <p className="text-gray-500 mt-3">
    Discover restaurants around your current location
  </p>
</div>
       {location && (
  <div className="max-w-6xl mx-auto mb-10">

    <div className="flex justify-end mb-4">
      <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-full shadow-sm text-sm font-medium">
        ✅ Location detected successfully
      </div>
    </div>

    <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-[420px]">
      <LocationMap location={location} />
    </div>

  </div>
)}

       <div className="max-w-6xl mx-auto bg-lightblue rounded-3xl shadow-xl p-5 flex flex-col md:flex-row gap-4 mb-12 border border-slate-100">
          <input
            type="text"
            placeholder="Search restaurant..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="flex-1 px-7 py-4 rounded-full bg-blue-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 placeholder:text-slate-400"
          />

          <select
            value={crowdFilter}
            onChange={(e) =>
              setCrowdFilter(e.target.value)
            }
            className="px-6 py-4 rounded-full bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none"
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

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto pb-20">
          {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
  key={restaurant._id}
  id={restaurant._id}
  image={restaurant.image}
  name={restaurant.name}
  rating={restaurant.rating}
  crowd={restaurant.crowdLevel || "Unknown"}
  waitTime={restaurant.waitTime}
  distance={restaurant.distance}
  openingTime={restaurant.openingTime}
  closingTime={restaurant.closingTime}
  openingHours={restaurant.openingHours}
  source={restaurant.source}
/>
          ))}
        </div>
      </section>
    </>
  );
}

export default Restaurants;