import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showSignupMenu, setShowSignupMenu] = useState(false);

  const logout = () => {
    localStorage.clear();
    alert("Logged Out Successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-[9999]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <h1
          className="text-3xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          SmartSeat AI
        </h1>

        <div className="flex items-center gap-7 text-lg">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Restaurants
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Analytics
          </NavLink>

          {/* Admin Button */}

          {token && role === "admin" && (
            <NavLink
              to="/admin/add-restaurant"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }
            >
              Admin
            </NavLink>
          )}

          {/* Guest Navbar */}

          {!token && (
            <>

              {/* LOGIN */}

              <div
                className="relative"
                onMouseEnter={() => setShowLoginMenu(true)}
                onMouseLeave={() => setShowLoginMenu(false)}
              >
                <button className="text-gray-700 hover:text-blue-600 font-medium">
                  Login ▼
                </button>

                {showLoginMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-white shadow-xl rounded-xl overflow-hidden">

                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-left px-5 py-3 hover:bg-blue-50"
                    >
                      👤 Login as User
                    </button>

                    <button
                      onClick={() => navigate("/admin/login")}
                      className="w-full text-left px-5 py-3 hover:bg-blue-50"
                    >
                      🏪 Login as Restaurant Owner
                    </button>

                  </div>
                )}
              </div>

              {/* SIGNUP */}

              <div
                className="relative"
                onMouseEnter={() => setShowSignupMenu(true)}
                onMouseLeave={() => setShowSignupMenu(false)}
              >
                <button className="text-gray-700 hover:text-blue-600 font-medium">
                  Signup ▼
                </button>

                {showSignupMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-white shadow-xl rounded-xl overflow-hidden">

                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full text-left px-5 py-3 hover:bg-blue-50"
                    >
                      👤 Signup as User
                    </button>

                    <button
                      onClick={() => navigate("/owner-signup")}
                      className="w-full text-left px-5 py-3 hover:bg-blue-50"
                    >
                      🏪 Signup as Restaurant Owner
                    </button>

                  </div>
                )}
              </div>

            </>
          )}

          {/* Logged In */}

          {token && (
            <>
              <span className="font-semibold text-green-600">
                Hi, {name}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
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