const express = require("express");
const router = express.Router();

const Restaurant = require("../models/Restaurant");
const authMiddleware = require("../middleware/authMiddleware");

const axios = require("axios");
const { getDistance } = require("geolib");
require("dotenv").config();

// ======================
// SMART ESTIMATION FOR LIVE RESTAURANTS
// ======================

function estimateRestaurantData() {

  const now = new Date();

  const hour = now.getHours();

  const day = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const weekend =
    day === "Saturday" || day === "Sunday" ? 1 : 0;

  let crowd = 30;

  if (hour >= 8 && hour <= 11) {
    crowd = 35;
  }

  else if (hour >= 12 && hour <= 15) {
    crowd = 70;
  }

  else if (hour >= 16 && hour <= 18) {
    crowd = 45;
  }

  else if (hour >= 19 && hour <= 22) {
    crowd = 80;
  }

  else {
    crowd = 25;
  }

  if (weekend) {
    crowd += 10;
  }

  crowd = Math.min(crowd, 100);

  let crowdLevel = "Low";

  if (crowd >= 70) {
    crowdLevel = "High";
  }
  else if (crowd >= 40) {
    crowdLevel = "Medium";
  }

  const waitTime = Math.round(crowd * 0.45);

  return {
    crowd,
    crowdLevel,
    waitTime,
    day,
    hour,
    weekend,
  };
}

// ==============================
// GET ALL RESTAURANTS
// ==============================

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==============================
// GET LIVE + OWNER RESTAURANTS
// ==============================

router.get("/nearby/:lat/:lng", async (req, res) => {
  try {
    const userLat = Number(req.params.lat);
    const userLng = Number(req.params.lng);

    // ======================
    // OWNER RESTAURANTS
    // ======================

    const dbRestaurants = await Restaurant.find();

const ownerRestaurants = dbRestaurants
  .filter(
    (restaurant) =>
      restaurant.location &&
      restaurant.location.lat !== undefined &&
      restaurant.location.lng !== undefined
  )
  .map((restaurant) => {
      const distance = getDistance(
  {
    latitude: Number(userLat),
    longitude: Number(userLng),
  },
  {
    latitude: Number(restaurant.location.lat),
    longitude: Number(restaurant.location.lng),
  }
);

      return {
        ...restaurant.toObject(),

        distance: Number((distance / 1000).toFixed(2)),

        source: "owner",
      };
    });

 

    // ======================
// LIVE RESTAURANTS (Geoapify)
// ======================

let apiRestaurants = [];

try {

  const response = await axios.get(
    "https://api.geoapify.com/v2/places",
    {
      params: {
        categories:
          "catering.restaurant,catering.fast_food,catering.cafe",

        filter: `circle:${userLng},${userLat},5000`,

        bias: `proximity:${userLng},${userLat}`,

        limit: 50,

        apiKey: process.env.GEOAPIFY_API_KEY,
      },
    }
  );

  apiRestaurants = response.data.features.map((item) => {

    const props = item.properties;
    const estimated = estimateRestaurantData();

    const distance = getDistance(
      {
        latitude: userLat,
        longitude: userLng,
      },
      {
        latitude: props.lat,
        longitude: props.lon,
      }
    );

    return {

      _id: `geo_${props.place_id}`,

      name: props.name || "Unnamed Restaurant",

      rating: "N/A",

crowdLevel: estimated.crowdLevel,

crowd: estimated.crowd,

waitTime: estimated.waitTime,

day: estimated.day,

hour: estimated.hour,

weekend: estimated.weekend,

      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",

      location: {
        lat: props.lat,
        lng: props.lon,
      },

      address: props.address_line1 || "",

      city: props.city || "",

      postcode: props.postcode || "",

      cuisine: props.categories?.[0] || "Restaurant",

      phone: props.contact?.phone || "Not Available",

      website: props.website || "",

      openingHours:
  props.opening_hours ||
  props.datasource?.raw?.opening_hours ||
  props.formatted_opening_hours ||
  "Not Available",

      distance: Number((distance / 1000).toFixed(2)),

      source: "geoapify",
    };

  });

} catch (error) {

  console.log("Geoapify Failed");

  console.log(error.response?.data || error.message);

}
    // ======================
    // MERGE BOTH
    // ======================

    const allRestaurants = [
      ...ownerRestaurants,
      ...apiRestaurants,
    ];

    const uniqueRestaurants = [];

    const names = new Set();

    allRestaurants.forEach((restaurant) => {
      const key = restaurant.name.toLowerCase();

      if (!names.has(key)) {
        names.add(key);
        uniqueRestaurants.push(restaurant);
      }
    });

    uniqueRestaurants.sort(
      (a, b) => a.distance - b.distance
    );

    res.json(uniqueRestaurants);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
});

// ==============================
// GET SINGLE RESTAURANT
// ==============================

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(
      req.params.id
    );

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json(restaurant);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// ==============================
// ADD RESTAURANT
// ==============================

router.post("/", authMiddleware, async (req, res) => {
  try {

    const restaurant = new Restaurant({
      ...req.body,
      owner: req.user.id,
    });

    const savedRestaurant =
      await restaurant.save();

    res.status(201).json(savedRestaurant);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// ==============================
// UPDATE RESTAURANT
// ==============================

router.put("/:id", async (req, res) => {
  try {

    const updatedRestaurant =
      await Restaurant.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json(updatedRestaurant);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// ==============================
// BETTER NEARBY ALTERNATIVES
// ==============================

router.get("/alternatives/:id/:lat/:lng", async (req, res) => {
  try {
    const { id, lat, lng } = req.params;

    const userLat = Number(lat);
    const userLng = Number(lng);

    // Get all restaurants (owner + geoapify)
    const response = await axios.get(
      `http://localhost:5000/api/restaurants/nearby/${userLat}/${userLng}`
    );

    let restaurants = response.data;

    restaurants = restaurants.filter((r) => r._id !== id);

    restaurants.sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }

      const ratingA = Number(a.rating) || 0;
      const ratingB = Number(b.rating) || 0;

      return ratingB - ratingA;
    });

    res.json(restaurants.slice(0, 3));

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to load alternatives",
    });
  }
});

// ==============================
// DELETE RESTAURANT
// ==============================

router.delete("/:id", async (req, res) => {
  try {

    const deletedRestaurant =
      await Restaurant.findByIdAndDelete(
        req.params.id
      );

    if (!deletedRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json({
      message: "Restaurant deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

module.exports = router;