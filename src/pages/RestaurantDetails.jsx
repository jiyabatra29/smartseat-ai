import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictLoading, setPredictLoading] = useState(false);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/restaurants/${id}`
      );

      setRestaurant(response.data);
    } catch (error) {
      console.error("Restaurant Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const predictCrowd = async () => {
    try {
      setPredictLoading(true);

      const predictionRes = await axios.post(
        "http://127.0.0.1:5001/predict",
        {
          restaurant: restaurant.name,
          crowd: restaurant.crowd,
        }
      );

      setPrediction(predictionRes.data);
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("AI Prediction Failed");
    } finally {
      setPredictLoading(false);
    }
  };

  if (loading) {
    return (
      <h1 className="text-center text-3xl mt-20">
        Loading...
      </h1>
    );
  }

  if (!restaurant) {
    return (
      <h1 className="text-center text-3xl mt-20">
        Restaurant Not Found
      </h1>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 pt-32 px-8">
        <div className="max-w-5xl mx-auto">

          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-96 object-cover rounded-2xl"
          />

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <h1 className="text-4xl font-bold">
              {restaurant.name}
            </h1>

            <p className="mt-4 text-lg">
              ⭐ {restaurant.rating}
            </p>

            <p className="mt-3 text-lg">
              Crowd Level : {restaurant.crowdLevel}
            </p>

            <p className="mt-3 text-lg">
              Current Crowd : {restaurant.crowd}%
            </p>

            <p className="mt-3 text-lg">
              Estimated Wait Time : {restaurant.waitTime} mins
            </p>

            <p className="mt-3 text-lg">
              Day : {restaurant.day}
            </p>

            <p className="mt-3 text-lg">
              Hour : {restaurant.hour}:00
            </p>

          </div>

          {/* Prediction Button */}

          <div className="mt-8 flex justify-center">
            <button
              onClick={predictCrowd}
              disabled={predictLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition disabled:bg-gray-400"
            >
              {predictLoading
                ? "Predicting..."
                : "🤖 Get AI Prediction"}
            </button>
          </div>

          {/* Prediction Card */}

          {prediction && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

              <h2 className="text-3xl font-bold text-blue-600 mb-8">
                🤖 AI Crowd Prediction
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-blue-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold">
                    Current Crowd
                  </h3>

                  <p className="text-4xl font-bold text-blue-700 mt-3">
                    {prediction.currentCrowd}%
                  </p>
                </div>

                <div className="bg-green-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold">
                    Predicted Wait Time
                  </h3>

                  <p className="text-4xl font-bold text-green-700 mt-3">
                    {prediction.predictedWaitTime} mins
                  </p>
                </div>

                <div className="bg-yellow-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold">
                    Future Crowd
                  </h3>

                  <p className="text-3xl font-bold text-yellow-700 mt-3">
                    {prediction.futureCrowd}%
                  </p>
                </div>

                <div className="bg-purple-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold">
                    Recommended Arrival
                  </h3>

                  <p className="text-3xl font-bold text-purple-700 mt-3">
                    {prediction.recommendedArrival}
                  </p>
                </div>

                <div className="md:col-span-2 bg-pink-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold">
                    AI Model Confidence
                  </h3>

                  <p className="text-4xl font-bold text-pink-700 mt-3">
                    {prediction.confidence}%
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default RestaurantDetails;