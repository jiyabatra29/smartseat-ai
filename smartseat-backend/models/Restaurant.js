const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 0,
  },

  crowdLevel: {
    type: String,
    default: "Low",
  },

  image: {
    type: String,
    default: "",
  },

  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },

  // Restaurant Timing
  openingTime: {
    type: String,
    default: "09:00",
  },

  closingTime: {
    type: String,
    default: "22:00",
  },

  // API / Owner Source
  source: {
    type: String,
    default: "owner",
  },

  distance: {
    type: Number,
    default: 0,
  },

  // Restaurant Owner
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ML Inputs
  day: {
    type: String,
    default: "Monday",
  },

  hour: {
    type: Number,
    default: 12,
  },

  weekend: {
    type: Number,
    default: 0,
  },

  crowd: {
    type: Number,
    default: 20,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);