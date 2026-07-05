const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

// =======================
// ADD REVIEW
// =======================

router.post("/", async (req, res) => {
  try {
    const {
      restaurantId,
      userId,
      name,
      rating,
      comment,
    } = req.body;

    const review = new Review({
      restaurantId,
      userId,
      name,
      rating,
      comment,
    });

    const savedReview = await review.save();

    res.status(201).json({
      message: "Review Added Successfully",
      review: savedReview,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// =======================
// GET REVIEWS OF RESTAURANT
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

router.delete("/:id", async (req, res) => {
  try {

    const review = await Review.findByIdAndDelete(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

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