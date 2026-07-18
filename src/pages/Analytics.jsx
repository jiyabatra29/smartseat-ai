import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  const COLORS = [
    "#22c55e",
    "#facc15",
    "#ef4444",
  ];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://smartseat-ai.onrender.com/api/analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAnalytics(response.data);
  } catch (error) {
    console.error(error);
  }
};

  if (!analytics) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex justify-center items-center">
          <h1 className="text-3xl font-bold">
            Loading Analytics...
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 pt-32 px-8 pb-20">

        <h1 className="text-5xl font-bold text-center text-slate-800">
  Your Restaurant Analytics
</h1>

<p className="text-center text-gray-500 mt-3">
  Statistics for your restaurants only
</p>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto mt-12">

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <h3 className="text-gray-500">
              Restaurants
            </h3>

            <p className="text-4xl font-bold text-blue-600 mt-4">
              {analytics.totalRestaurants}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <h3 className="text-gray-500">
              Average Rating
            </h3>

            <p className="text-4xl font-bold text-yellow-500 mt-4">
              ⭐ {analytics.averageRating}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <h3 className="text-gray-500">
              Average Crowd
            </h3>

            <p className="text-4xl font-bold text-green-600 mt-4">
              {analytics.averageCrowd}% 
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <h3 className="text-gray-500">
              Reviews
            </h3>

            <p className="text-4xl font-bold text-red-500 mt-4">
              {analytics.totalReviews}
            </p>

          </div>

        </div>

        {/* Charts */}

        <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto mt-14">

          {/* Pie Chart */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6 text-center">
              Crowd Distribution
            </h2>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={analytics.crowdData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {analytics.crowdData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

                    {/* Bar Chart */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6 text-center">
              Restaurant Ratings
            </h2>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={analytics.ratingData}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis domain={[0, 5]} />

                <Tooltip />

                <Bar
                  dataKey="rating"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </>
  );
}

export default Analytics;