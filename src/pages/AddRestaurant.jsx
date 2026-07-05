import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    crowdLevel: "Low",
    crowd: "",
    waitTime: "",
    image: "",
    day: "Monday",
    hour: 12,
    weekend: 0,
  });

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/restaurants"
      );

      setRestaurants(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

await axios.post(
  "http://localhost:5000/api/restaurants",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      await fetchRestaurants();

      alert("Restaurant Added Successfully!");

      setFormData({
        name: "",
        rating: "",
        crowdLevel: "Low",
        crowd: "",
        waitTime: "",
        image: "",
        day: "Monday",
        hour: 12,
        weekend: 0,
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }
    }
  };

  // Delete Restaurant
  const deleteRestaurant = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this restaurant?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

await axios.delete(
  `http://localhost:5000/api/restaurants/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert("Restaurant Deleted Successfully!");

      fetchRestaurants();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-100 pt-32 px-8">

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Add Restaurant
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              step="0.1"
              name="rating"
              placeholder="Rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <select
              name="crowdLevel"
              value={formData.crowdLevel}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input
              type="number"
              name="crowd"
              placeholder="Current Crowd (%)"
              value={formData.crowd}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="waitTime"
              placeholder="Wait Time (mins)"
              value={formData.waitTime}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>

            <input
              type="number"
              name="hour"
              min="0"
              max="23"
              placeholder="Hour (0-23)"
              value={formData.hour}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <select
              name="weekend"
              value={formData.weekend}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value={0}>Weekday</option>
              <option value={1}>Weekend</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Add Restaurant
            </button>

          </form>

        </div>
                {/* Restaurant List */}

        <div className="max-w-6xl mx-auto mt-12">

          <h2 className="text-3xl font-bold text-center mb-8">
            Existing Restaurants
          </h2>

          {loading ? (
            <p className="text-center text-xl">
              Loading Restaurants...
            </p>
          ) : restaurants.length === 0 ? (
            <p className="text-center text-gray-500">
              No Restaurants Found
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">

              {restaurants
.filter(
  (restaurant) =>
    restaurant.owner === localStorage.getItem("userId")
)
.map((restaurant) => (

                <div
                  key={restaurant._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">

                    <h3 className="text-2xl font-bold">
                      {restaurant.name}
                    </h3>

                    <p className="mt-2">
                      ⭐ {restaurant.rating}
                    </p>

                    <p className="mt-2">
                      Crowd Level :
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${
                          restaurant.crowdLevel === "Low"
                            ? "bg-green-500"
                            : restaurant.crowdLevel === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {restaurant.crowdLevel}
                      </span>
                    </p>

                    <p className="mt-2">
                      👥 Crowd : <b>{restaurant.crowd}%</b>
                    </p>

                    <p className="mt-2">
                      ⏱ Wait Time : {restaurant.waitTime} mins
                    </p>

                    <p className="mt-2">
                      📅 Day : {restaurant.day}
                    </p>

                    <p className="mt-2">
                      🕒 Hour : {restaurant.hour}:00
                    </p>

                    <p className="mt-2">
                      {restaurant.weekend == 1
                        ? "🎉 Weekend"
                        : "💼 Weekday"}
                    </p>

                    <div className="flex gap-3 mt-6">

                      <Link
                        to={`/edit/${restaurant._id}`}
                        className="flex-1"
                      >
                        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
                          Edit
                        </button>
                      </Link>

                      <button
                        onClick={() =>
                          deleteRestaurant(restaurant._id)
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </section>

    </>
  );
}

export default AddRestaurant;