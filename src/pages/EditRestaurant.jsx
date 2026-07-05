
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/restaurants/${id}`
      );

      setFormData(res.data);
    } catch (error) {
      console.log(error);
      alert("Restaurant not found");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const token = localStorage.getItem("token");

await axios.put(
  `http://localhost:5000/api/restaurants/${id}`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert("Restaurant Updated Successfully!");

      navigate("/admin/add-restaurant");

    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-100 pt-32 px-8">

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold text-center mb-8">
            Edit Restaurant
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Restaurant Name"
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              step="0.1"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Rating"
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
              value={formData.crowd}
              onChange={handleChange}
              placeholder="Current Crowd (%)"
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="waitTime"
              value={formData.waitTime}
              onChange={handleChange}
              placeholder="Wait Time (mins)"
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
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
              value={formData.hour}
              onChange={handleChange}
              placeholder="Current Hour (0-23)"
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
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Update Restaurant
            </button>

          </form>

        </div>

      </section>
    </>
  );
}

export default EditRestaurant;
