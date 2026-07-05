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

  waitTime: {
    type: Number,
    default: 0,
  },

  image: {
    type: String,
    default: "",
  },

  // ===== Restaurant Owner =====

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ===== ML Inputs =====

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

module.exports = mongoose.model(
  "Restaurant",
  restaurantSchema
);