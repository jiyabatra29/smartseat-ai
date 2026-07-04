const express = require("express");
const router = express.Router();

const Review = require("../models/Review");


// =======================
// Add Review
// =======================

router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);

    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// =======================
// Get Reviews of Restaurant
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
    res.status(500).json({
      message: error.message,
    });
  }
});


// =======================
// Delete Review
// =======================

router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;