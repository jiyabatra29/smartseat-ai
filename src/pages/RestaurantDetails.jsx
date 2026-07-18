import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function RestaurantDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const isApiRestaurant =
    id.startsWith("geo_") ||
    id.startsWith("osm_");

  const [loading, setLoading] = useState(true);
  const [predictLoading, setPredictLoading] =
    useState(false);

  const [reviews, setReviews] = useState([]);
  const [alternatives, setAlternatives] =
    useState([]);

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {

    try {

      if (isApiRestaurant) {

        const userLocation = JSON.parse(
          localStorage.getItem("userLocation")
        );

        const res = await axios.get(
          `http://localhost:5000/api/restaurants/nearby/${userLocation.lat}/${userLocation.lng}`
        );

        const selectedRestaurant = res.data.find(
          (r) => r._id === id
        );

        setRestaurant(selectedRestaurant);

        setReviews([]);
        setAlternatives([]);

      } else {

        const response = await axios.get(
          `http://localhost:5000/api/restaurants/${id}`
        );

        setRestaurant(response.data);

        const reviewRes = await axios.get(
          `http://localhost:5000/api/reviews/${id}`
        );

        setReviews(reviewRes.data);

        const userLocation = JSON.parse(
          localStorage.getItem("userLocation")
        );

        if (userLocation) {

          const altRes = await axios.get(
            `http://localhost:5000/api/restaurants/alternatives/${response.data._id}/${userLocation.lat}/${userLocation.lng}`
          );

          setAlternatives(altRes.data);

        }

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const predictCrowd = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

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

      console.log(error);
      alert("Prediction Failed");

    } finally {

      setPredictLoading(false);

    }

  };

  const handleReviewChange = (e) => {

    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });

  };

  const submitReview = async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  try {
     console.log("ReviewData =", reviewData);

    console.log({
      restaurantId: restaurant._id,
      name: localStorage.getItem("name"),
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      token,
    });

    await axios.post(
      "http://localhost:5000/api/reviews",
      {
        restaurantId: restaurant._id,
        name: localStorage.getItem("name"),
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Review Added");

    setReviewData({
      rating: 5,
      comment: "",
    });

    fetchRestaurant();

  } catch (error) {
    console.log(error);
    console.log(error.response?.data);

    alert(
      error.response?.data?.message || "Review submit failed"
    );
  }

};

  const deleteReview = async (reviewId) => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRestaurant();

    } catch (error) {

      console.log(error);

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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 pt-28 pb-16 px-6">

        <div className="max-w-7xl mx-auto">

          {/* ================= HERO ================= */}

          <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 p-8 mb-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
                  Restaurant Details
                </p>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-2">
                  {restaurant.name}
                </h1>

                <p className="text-gray-500 mt-3 max-w-xl">
                  Discover live crowd levels, wait time, reviews and AI powered
                  predictions before visiting.
                </p>

                <div className="flex flex-wrap gap-3 mt-6">

                  <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-full font-semibold">
                    ⭐ {restaurant.rating || "N/A"}
                  </span>

                  <span
                    className={`px-4 py-2 rounded-full font-semibold border ${
                      restaurant.crowd === "Low"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : restaurant.crowd === "Medium"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {restaurant.crowd || "Unknown"} Crowd
                  </span>

                  {restaurant.waitTime && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full font-semibold">
                      ⏱ {restaurant.waitTime} mins
                    </span>
                  )}

                </div>

              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.lat},${restaurant.location.lng}`}
                target="_blank"
                rel="noreferrer"
              >

                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition">

                  🧭 Get Directions

                </button>

              </a>

            </div>

          </div>

          {/* ================= MAIN GRID (Image | Details | Reviews) ================= */}

          <div className="grid lg:grid-cols-[1.2fr_0.9fr_0.95fr] gap-8 mb-10">

            {/* ================= IMAGE ================= */}

            <div className="group">

              <img
                src={
restaurant.image ||
"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
}
                alt={restaurant.name}
                className="w-full h-[560px] object-cover rounded-[32px] shadow-xl transition duration-500 group-hover:shadow-2xl"
              />

            </div>

            {/* ================= DETAILS CARD ================= */}

            <div className="bg-white rounded-[32px] shadow-xl p-8">

              <h2 className="text-3xl font-bold text-slate-800">
                {restaurant.name}
              </h2>

              <div className="flex items-center gap-3 mt-4">

                <span className="text-yellow-500 text-xl">
                  ⭐
                </span>

                <span className="font-semibold text-lg text-slate-700">
                  {restaurant.rating || "N/A"}
                </span>

                <span className="ml-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                  Open
                </span>

              </div>

              <div className="space-y-5 mt-8 divide-y divide-slate-100">

                <div>

                  <p className="text-gray-400 text-sm">
                    Opening Time
                  </p>

                  <h3 className="font-semibold text-lg text-slate-700">
                    {restaurant.openingTime || "--"}
                  </h3>

                </div>

                <div className="pt-5">

                  <p className="text-gray-400 text-sm">
                    Closing Time
                  </p>

                  <h3 className="font-semibold text-lg text-slate-700">
                    {restaurant.closingTime || "--"}
                  </h3>

                </div>

                <div className="pt-5">

                  <p className="text-gray-400 text-sm">
                    Distance
                  </p>

                  <h3 className="font-semibold text-lg text-slate-700">
                    {restaurant.distance || "--"} km
                  </h3>

                </div>

                <div className="pt-5">

                  <p className="text-gray-400 text-sm">
                    Crowd Level
                  </p>

                  <h3 className="font-semibold text-lg text-slate-700">
                    {restaurant.crowd || "Unknown"}
                  </h3>

                </div>

                <div className="pt-5">

                  <p className="text-gray-400 text-sm">
                    Wait Time
                  </p>

                  <h3 className="font-semibold text-lg text-slate-700">
                    {restaurant.waitTime || "--"} mins
                  </h3>

                </div>

              </div>

            </div>

            {/* ================= REVIEWS + ADD REVIEW ================= */}

            <div className="bg-white rounded-[32px] shadow-xl p-6 flex flex-col">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-slate-800">
                  Reviews
                </h2>

                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                  {reviews.length} Reviews
                </span>

              </div>

              {/* ADD REVIEW */}

              {!isApiRestaurant && (

                <div className="bg-slate-50 rounded-2xl p-4 mb-6">

                  <select
                    name="rating"
                    value={reviewData.rating}
                    onChange={handleReviewChange}
                    className="w-full border rounded-xl p-3 mb-3"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                    <option value={3}>⭐⭐⭐</option>
                    <option value={2}>⭐⭐</option>
                    <option value={1}>⭐</option>
                  </select>

                  <textarea
                    name="comment"
                    value={reviewData.comment}
                    onChange={handleReviewChange}
                    rows="3"
                    placeholder="Write a review..."
                    className="w-full border rounded-xl p-3 resize-none"
                  />

                  <button
                  disabled={isApiRestaurant}
                    onClick={submitReview}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Submit Review
                  </button>
                  {isApiRestaurant && (
<p className="text-red-500 text-sm mt-2">
Reviews can only be added to registered restaurants.
</p>
)}

                </div>

              )}

              {/* REVIEW LIST */}

              <div className="space-y-4 flex-1">

                {reviews.length === 0 ? (

                  <div className="text-center py-12 text-gray-400">
                    No Reviews Yet
                  </div>

                ) : (

                  reviews.slice(0, 3).map((review) => (

                    <div
                      key={review._id}
                      className="border-b border-slate-100 pb-4"
                    >

                      <div className="flex justify-between items-start gap-3">

                        <div>

                          <h3 className="font-bold text-slate-800">
                            {review.name}
                          </h3>

                          <span className="text-yellow-500 text-sm">
                            {"⭐".repeat(review.rating)}
                          </span>

                        </div>

                        {(String(review.userId) === String(localStorage.getItem("userId")) ||
                          restaurant.owner === localStorage.getItem("userId")) && (

                          <button
                            onClick={() => deleteReview(review._id)}
                            className="text-red-500 hover:text-red-600 text-xs font-semibold"
                          >
                            Delete
                          </button>

                        )}

                      </div>

                      <p className="text-gray-500 mt-2 line-clamp-2 text-sm">
                        {review.comment}
                      </p>

                    </div>

                  ))

                )}

              </div>

              {reviews.length > 3 && (

                <button className="mt-5 text-blue-600 font-semibold hover:underline">
                  View All Reviews →
                </button>

              )}

            </div>

          </div>
          {/* ================= MAIN GRID ENDS HERE ================= */}

          {/* ================= AI PREDICTION ================= */}

          <div className="bg-white rounded-[32px] shadow-xl p-8 mb-10">

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-3xl font-bold text-slate-800">
                  🤖 AI Crowd Prediction
                </h2>

                <p className="text-gray-500">
                  Know the best time to visit
                </p>

              </div>

              <button
                onClick={predictCrowd}
                disabled={predictLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3 rounded-2xl font-semibold shadow-md transition disabled:opacity-70"
              >
                {predictLoading
                  ? "Predicting..."
                  : "Generate Prediction"}
              </button>

            </div>

            {!prediction ? (

              <div className="bg-slate-50 rounded-3xl h-72 flex flex-col justify-center items-center">

                <div className="text-6xl mb-4">
                  🤖
                </div>

                <h3 className="text-2xl font-bold text-slate-700">
                  AI Prediction Ready
                </h3>

                <p className="text-gray-500 mt-2">
                  Click Generate Prediction to analyze crowd.
                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-5 gap-5">

                <div className="rounded-3xl bg-blue-50 p-6">

                  <p className="text-gray-500">
                    Current Crowd
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-blue-700">
                    {prediction.currentCrowd}%
                  </h2>

                </div>

                <div className="rounded-3xl bg-green-50 p-6">

                  <p className="text-gray-500">
                    Wait Time
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-green-700">
                    {prediction.predictedWaitTime} mins
                  </h2>

                </div>

                <div className="rounded-3xl bg-yellow-50 p-6">

                  <p className="text-gray-500">
                    Future Crowd
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-yellow-700">
                    {prediction.futureCrowd}%
                  </h2>

                </div>

                <div className="rounded-3xl bg-purple-50 p-6">

                  <p className="text-gray-500">
                    Best Time
                  </p>

                  <h2 className="text-xl font-bold mt-3 text-purple-700">
                    {prediction.recommendedArrival}
                  </h2>

                </div>

                <div className="rounded-3xl bg-pink-50 p-6">

                  <p className="text-gray-500">
                    Confidence
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-pink-700">
                    {prediction.confidence}%
                  </h2>

                </div>

              </div>

            )}

          </div>

          {/* ================= NEARBY BETTER ALTERNATIVES ================= */}

          {alternatives.length > 0 && (

            <div className="bg-white rounded-[32px] shadow-xl p-8 mb-10">

              <div className="flex justify-between items-center mb-7">

                <div>

                  <h2 className="text-3xl font-bold text-slate-800">
                    🍽 Nearby Better Alternatives
                  </h2>

                  <p className="text-gray-500">
                    Less crowded restaurants nearby
                  </p>

                </div>

                <button
onClick={()=>{
document
.getElementById("reviewsSection")
?.scrollIntoView({
behavior:"smooth"
});
}}
className="mt-5 text-blue-600 font-semibold hover:underline"
>
                  View All →
                </button>

              </div>

              <div className="grid md:grid-cols-3 gap-6">

                {alternatives.slice(0, 3).map((item) => (

                  <div
                    key={item._id}
                    className="bg-slate-50 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl duration-300 border border-slate-200"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-44 w-full object-cover"
                    />

                    <div className="p-5">

                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex justify-between items-center mt-4">

                        <span className="font-semibold text-yellow-500">
                          ⭐ {item.rating || "N/A"}
                        </span>

                        <span className="text-blue-600 font-semibold">
                          📍 {item.distance} km
                        </span>

                      </div>

                      <div className="flex justify-between items-center mt-5">

                        <span
                          className={`px-3 py-2 rounded-full text-sm font-semibold ${
                            item.crowdLevel === "Low"
                              ? "bg-green-100 text-green-700"
                              : item.crowdLevel === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.crowdLevel}
                        </span>

                        <span className="font-semibold text-gray-700">
                          ⏱ {item.waitTime || "--"} mins
                        </span>

                      </div>

                      <button
                        onClick={() => {

setPrediction(null);

navigate(`/restaurant/${item._id}`);

window.location.reload();

}}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-2xl font-semibold shadow-md transition"
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>
      </div>
    </>
  );

}

export default RestaurantDetails;
