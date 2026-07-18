import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function OwnerSignup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "https://smartseat-ai.onrender.com/api/auth/signup",
        formData
      );

      alert("Restaurant Owner Registered Successfully!");

      navigate("/admin/login");

    } catch (error) {

      alert(
        error.response?.data?.message || "Signup Failed"
      );

    }

  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-100 pt-32 px-8">

        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold text-center mb-2">
            Restaurant Owner Signup
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Create your Restaurant Owner account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Owner Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Owner Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg"
            >
              Signup as Restaurant Owner
            </button>

          </form>

          <p className="text-center mt-6">

            Already have an Owner account?

            <Link
              to="/admin/login"
              className="text-blue-600 font-semibold ml-2"
            >
              Login
            </Link>

          </p>

        </div>

      </section>

    </>
  );
}

export default OwnerSignup;