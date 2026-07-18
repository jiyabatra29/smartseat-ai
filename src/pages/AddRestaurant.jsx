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
  image: "",
  openingTime: "09:00",
closingTime: "22:00",
  
  lat: "",
  lng: "",
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
  {
    ...formData,
    location: {
      lat: Number(formData.lat),
      lng: Number(formData.lng),
    },
  },
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
  image: "",
  openingTime: "09:00",
closingTime: "22:00",
  
  lat: "",
  lng: "",
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

    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 pt-28 pb-10 px-8">

      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12">

          {/* ================= LEFT : EXISTING RESTAURANTS ================= */}

          <div>

            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Your Restaurants
            </h2>

            {loading ? (
  <p className="text-center text-xl py-10">
    Loading Restaurants...
  </p>
) : restaurants.filter(
    (restaurant) =>
      restaurant.owner === localStorage.getItem("userId")
  ).length === 0 ? (
  <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
    <h3 className="text-2xl font-bold text-slate-700">
      No Restaurants Yet 🍽️
    </h3>

    <p className="text-gray-500 mt-2">
      Add your first restaurant from the form.
    </p>
  </div>
) : (

<div className="space-y-6">

{restaurants
.filter(
(restaurant)=>
restaurant.owner===localStorage.getItem("userId")
)
.map((restaurant)=>(

<div
key={restaurant._id}
className="bg-white rounded-[28px] shadow-xl overflow-hidden flex w-[92%] hover:-translate-y-1 hover:shadow-2xl duration-300"
>

<img
src={restaurant.image}
alt={restaurant.name}
className="w-64 h-56 object-cover"
/>

<div className="flex-1 p-6">

<div className="flex justify-between">

<div>

<h2 className="text-2xl font-bold">
{restaurant.name}
</h2>

<p className="text-yellow-500 mt-2">
⭐ {restaurant.rating}
</p>

<div className="flex gap-3 mt-4">

<span
className={`px-4 py-1 rounded-full text-white text-sm ${
restaurant.crowdLevel==="Low"
?"bg-green-500"
:restaurant.crowdLevel==="Medium"
?"bg-yellow-500"
:"bg-red-500"
}`}
>
{restaurant.crowdLevel}
</span>

<span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
👥 {restaurant.crowd}%
</span>

</div>

<div className="mt-5 text-gray-600 space-y-1">

<p>🕒 {restaurant.openingTime} - {restaurant.closingTime}</p>

<p>📅 {restaurant.day}</p>

<p>{restaurant.weekend==1?"🎉 Weekend":"💼 Weekday"}</p>

</div>

</div>

<div className="flex flex-col gap-3">

<Link to={`/edit/${restaurant._id}`}>

<button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl font-semibold">
Edit
</button>

</Link>

<button
onClick={()=>deleteRestaurant(restaurant._id)}
className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold"
>
Delete
</button>

</div>

</div>

</div>

</div>

))}
</div>

)}

          </div>


            {/* RIGHT SIDE */}

<div className="sticky top-28">

  <div className="bg-white rounded-[30px] shadow-xl p-8">

    <h2 className="text-3xl font-bold text-slate-800 mb-6">
      Add Restaurant
    </h2>

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
        className="w-full border p-3 rounded-xl"
        required
      />

      <input
        type="number"
        step="0.1"
        name="rating"
        placeholder="Rating"
        value={formData.rating}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
        required
      />

      <select
        name="crowdLevel"
        value={formData.crowdLevel}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="number"
        name="crowd"
        placeholder="Crowd %"
        value={formData.crowd}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <div className="grid grid-cols-2 gap-4">

        <input
          type="time"
          name="openingTime"
          value={formData.openingTime}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

      </div>

      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      />

      <div className="grid grid-cols-2 gap-4">

        <input
          type="number"
          step="any"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="number"
          step="any"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

      </div>

      <select
        name="day"
        value={formData.day}
        onChange={handleChange}
        className="w-full border p-3 rounded-xl"
      >
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>

      <div className="grid grid-cols-2 gap-4">

        <input
          type="number"
          name="hour"
          min="0"
          max="23"
          value={formData.hour}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <select
          name="weekend"
          value={formData.weekend}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        >
          <option value={0}>Weekday</option>
          <option value={1}>Weekend</option>
        </select>

      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
      >
        Add Restaurant
      </button>

    </form>

  </div>

</div>
        </div> {/* End Grid */}

      </div> {/* End max-w-7xl */}

    </section>

  </>
);
}

export default AddRestaurant;

