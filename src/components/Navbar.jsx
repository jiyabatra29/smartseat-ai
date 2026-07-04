import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-[9999]">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <h1 className="text-3xl font-bold text-blue-600">
          SmartSeat AI
        </h1>

        <div className="flex gap-8 text-lg">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }
          >
            Restaurants
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }
          >
            Analytics
          </NavLink>

          <NavLink
  to="/admin/add-restaurant"
  className={({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700"
  }
>
  Admin
</NavLink>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;