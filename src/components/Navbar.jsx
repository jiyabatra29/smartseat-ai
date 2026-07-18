import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    alert("Logged Out Successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-[9999]">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-8 py-4">

        {/* Logo */}
        <div className="flex justify-start">
          <h1
            onClick={() => navigate("/")}
            className="text-3xl font-bold text-blue-600 cursor-pointer tracking-wide"
          >
            SmartSeat AI
          </h1>
        </div>

        {/* Center Navigation */}
        <div className="flex justify-center items-center gap-8 text-[17px] font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Restaurants
          </NavLink>

          {token && role === "admin" && (
  <NavLink
    to="/analytics"
    className={({ isActive }) =>
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600 transition"
    }
  >
    Analytics
  </NavLink>
)}

          {token && role === "admin" && (
            <NavLink
              to="/admin/add-restaurant"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              DashBoard
            </NavLink>
          )}

        </div>

        {/* Right Side */}
        <div className="flex justify-end items-center gap-4">

          {!token && (
            <div className="relative group">

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition">
                Login ▾
              </button>

              <div
                className="
                  absolute right-0 mt-2
                  w-64
                  bg-white
                  rounded-xl
                  shadow-xl
                  border
                  opacity-0
                  invisible
                  group-hover:opacity-100
                  group-hover:visible
                  transition-all
                "
              >
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-left px-5 py-4 hover:bg-blue-50"
                >
                  👤 Login as User
                </button>

                <button
                  onClick={() => navigate("/admin/login")}
                  className="w-full text-left px-5 py-4 hover:bg-blue-50"
                >
                  🏪 Login as Restaurant Owner
                </button>

              </div>

            </div>
          )}

          {token && (
            <>
              <div className=" text-green-700 px-4 py-2 rounded-full font-semibold">
                👋 Hi, {name}
              </div>

              <button
                onClick={logout}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;