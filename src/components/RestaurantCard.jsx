import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Clock, Star } from "lucide-react";

function RestaurantCard({
  id,
  image,
  name,
  rating,
  crowd,
  waitTime,
  distance,
  openingTime,
  closingTime,
  openingHours,
  source,
}) {
  const badgeColor = () => {
    if (crowd === "Low")
      return "bg-green-100 text-green-700";

    if (crowd === "Medium")
      return "bg-yellow-100 text-yellow-700";

    if (crowd === "High")
      return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-600";
  };

  return (
    <Link to={`/restaurant/${id}`}>

      <div className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 flex gap-4 items-center border border-slate-100 cursor-pointer">

        {/* Image */}

        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
          }
          alt={name}
          className="w-40 h-40 rounded-2xl object-cover flex-shrink-0"
        />

        {/* Content */}

        <div className="flex-1">

          <h2 className="text-xl font-bold text-slate-800 line-clamp-1">
            {name}
          </h2>

          <div className="flex items-center gap-2 mt-2">

            <div className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
              <Star size={15} fill="currentColor" />
              {rating || "N/A"}
            </div>

            <span className="text-gray-300">|</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor()}`}
            >
              {crowd}
            </span>

          </div>

          <div className="mt-4 space-y-2">

            {distance !== undefined && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin size={16} />
                <span>{distance.toFixed(1)} km away</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock size={16} />
              <span>{waitTime || "--"} mins</span>
            </div>

          </div>

        </div>

        {/* Arrow */}

        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">

          <ChevronRight size={20} className="text-slate-500" />

        </div>

      </div>

    </Link>
  );
}

export default RestaurantCard;