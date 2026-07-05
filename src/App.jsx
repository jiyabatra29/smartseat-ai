import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import Analytics from "./pages/Analytics";
import RestaurantDetails from "./pages/RestaurantDetails";
import AddRestaurant from "./pages/AddRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminLogin from "./pages/AdminLogin";
import OwnerSignup from "./pages/OwnerSignup";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/restaurants"
          element={<Restaurants />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/restaurant/:id"
          element={<RestaurantDetails />}
        />

        <Route
  path="/admin/add-restaurant"
  element={
    <ProtectedAdminRoute>
      <AddRestaurant />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/edit/:id"
  element={
    <ProtectedAdminRoute>
      <EditRestaurant />
    </ProtectedAdminRoute>
  }
/>
  <Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />

<Route path="/admin/login" element={<AdminLogin />} />

<Route path="/owner-signup" element={<OwnerSignup />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;