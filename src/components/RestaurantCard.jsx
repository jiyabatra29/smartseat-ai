import { Link } from "react-router-dom";

function RestaurantCard({
  id,
  image,
  name,
  rating,
  crowd,
  waitTime,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">

      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
        }
        alt={name}
        className="h-48 w-full object-cover rounded-xl mb-4"
      />

      <h2 className="text-xl font-bold">
        {name}
      </h2>

      <p className="text-gray-600 mt-2">
        ⭐ {rating || "N/A"}
      </p>

      <div className="mt-4 flex justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            crowd === "Low"
              ? "bg-green-100 text-green-700"
              : crowd === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {crowd || "Unknown"}
        </span>

        <span className="text-gray-600">
          ⏱ {waitTime || 0} mins
        </span>
      </div>

      <Link to={`/restaurant/${id}`}>
        <button className="w-full mt-5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </div>
  );
}

export default RestaurantCard;