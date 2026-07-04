const express = require("express");
const router = express.Router();

const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    const reviews = await Review.find();

    const totalRestaurants = restaurants.length;

    const averageWaitTime =
      totalRestaurants > 0
        ? (
            restaurants.reduce(
              (sum, r) => sum + Number(r.waitTime),
              0
            ) / totalRestaurants
          ).toFixed(1)
        : 0;

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce(
              (sum, r) => sum + Number(r.rating),
              0
            ) / reviews.length
          ).toFixed(1)
        : 0;

    const totalReviews = reviews.length;

    const crowdData = [
      {
        name: "Low",
        value: restaurants.filter(
          (r) => r.crowdLevel === "Low"
        ).length,
      },
      {
        name: "Medium",
        value: restaurants.filter(
          (r) => r.crowdLevel === "Medium"
        ).length,
      },
      {
        name: "High",
        value: restaurants.filter(
          (r) => r.crowdLevel === "High"
        ).length,
      },
    ];

    const ratingData = restaurants.map((restaurant) => {
      const restaurantReviews = reviews.filter(
        (review) =>
          review.restaurantId.toString() ===
          restaurant._id.toString()
      );

      const avg =
        restaurantReviews.length > 0
          ? (
              restaurantReviews.reduce(
                (sum, review) =>
                  sum + Number(review.rating),
                0
              ) / restaurantReviews.length
            ).toFixed(1)
          : Number(restaurant.rating);

      return {
        name: restaurant.name,
        rating: Number(avg),
      };
    });

    res.json({
      totalRestaurants,
      averageWaitTime,
      averageRating,
      totalReviews,
      crowdData,
      ratingData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;