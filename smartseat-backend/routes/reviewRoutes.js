const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Review = require("../models/temp");
const Restaurant = require("../models/Restaurant");

// =======================
// AUTH MIDDLEWARE
// =======================

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Login Required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

// =======================
// ADD REVIEW
// =======================

router.post("/", auth, async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      rating,
      comment,
    } = req.body;

    console.log("REQ BODY =", req.body);
console.log("COMMENT =", comment);
console.log("USER =", req.user);
console.log("RESTAURANT ID =", restaurantId);

    const restaurant = await Restaurant.findById(restaurantId).select("+owner");

console.log("Restaurant =", restaurant);
console.log("Owner =", restaurant?.owner);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // NOTE: owner is optional here on purpose.
    // Some restaurants (older records / API-sourced ones) may not have
    // an owner set, and that should not block users from reviewing them.

    const review = new Review({
      restaurantId,
      restaurantOwner: restaurant.owner || null,
      userId: req.user.id,
      name,
      rating,
      comment,
    });

    console.log("REVIEW OBJECT =", review);

    const savedReview = await review.save();

    res.status(201).json({
      message: "Review Added Successfully",
      review: savedReview,
    });

  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message,
  });
}
});


// =======================
// GET REVIEWS
// =======================

router.get("/:restaurantId", async (req, res) => {
  try {

    const reviews = await Review.find({
      restaurantId: req.params.restaurantId,
    }).sort({
      createdAt: -1,
    });

    res.json(reviews);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

// =======================
// DELETE REVIEW
// =======================

router.delete("/:id", auth, async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const isReviewOwner =
      review.userId.toString() === req.user.id;

    const isRestaurantOwner =
      review.restaurantOwner &&
      review.restaurantOwner.toString() === req.user.id;

    if (!isReviewOwner && !isRestaurantOwner) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

module.exports = router;