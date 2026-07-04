const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/predict
router.post("/", async (req, res) => {
  try {
    const { restaurant, crowd } = req.body;

    // Flask API ko request bhejna
    const response = await axios.post(
      "http://127.0.0.1:5001/predict",
      {
        restaurant,
        crowd,
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Prediction Error:", error.message);

    if (error.response) {
      console.log(error.response.data);
    }

    res.status(500).json({
      message: "Prediction Failed",
    });
  }
});

module.exports = router;