import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import Analytics from "./pages/Analytics";
import RestaurantDetails from "./pages/RestaurantDetails";
import AddRestaurant from "./pages/AddRestaurant";
import EditRestaurant from "./pages/EditRestaurant";

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
          element={<AddRestaurant />}
        />

        <Route
          path="/edit/:id"
          element={<EditRestaurant />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;