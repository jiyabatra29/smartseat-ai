import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  email: "",
  password: "",
  role: "user",
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
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId);

      alert("Login Successful!");

      if (res.data.role === "admin") {
        navigate("/admin/add-restaurant");
      } else {
        navigate("/restaurants");
      }

    } catch (error) {
      console.log(error);

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

          <h1 className="text-3xl font-bold text-center mb-8">
            Login
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="email"
              name="email"
              placeholder="Email"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              Login
            </button>

          </form>

          <p className="text-center mt-6">

            Don't have an account?

            <Link
              to="/signup"
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

export default Login;