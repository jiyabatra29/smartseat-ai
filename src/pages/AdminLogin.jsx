import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminLogin() {
  const navigate = useNavigate();

 const [formData, setFormData] = useState({
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
      const res = await axios.post(
        "https://smartseat-ai.onrender.com/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId);

      alert("Restaurant Owner Login Successful!");

      navigate("/admin/add-restaurant");

    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-slate-100 pt-32 px-8">

        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold text-center mb-2">
            Restaurant Owner Login
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Login to manage your restaurant.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

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
              Login as Restaurant Owner
            </button>

          </form>

          <p className="text-center mt-6">

            Want to register your restaurant?

            <Link
              to="/owner-signup"
              className="text-blue-600 font-semibold ml-2"
            >
              Signup
            </Link>

          </p>

        </div>

      </section>
    </>
  );
}

export default AdminLogin;