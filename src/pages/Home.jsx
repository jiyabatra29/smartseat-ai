import Navbar from "../components/Navbar";
import { getUserLocation } from "../utils/location";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLocation = async () => {
    try {
      const location = await getUserLocation();

      console.log(location);

      localStorage.setItem(
        "userLocation",
        JSON.stringify(location)
      );

      navigate("/restaurants");
    } catch (error) {
      alert("Location access denied");
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col justify-center items-center text-center px-6">

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          AI Powered Crowd Prediction
        </span>

        <h1 className="text-6xl font-bold text-slate-900 max-w-5xl leading-tight">
          Find Less Crowded Restaurants Before You Leave Home
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-3xl">
          Discover nearby restaurants, predict crowd levels,
          estimate waiting times and choose the best place
          to dine with SmartSeat AI.
        </p>

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition"
          >
            Detect My Location
          </button>

          <button className="border border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100">
            Learn More
          </button>
        </div>

      </section>
      

      {/* Features Section */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-16">
    

      <h2 className="text-5xl font-bold text-gray-900 mt-3">
        Everything You Need Before Dining Out
      </h2>

      <p className="text-gray-500 mt-5 max-w-2xl mx-auto text-lg">
        SmartSeat AI combines live restaurant discovery with AI-powered
        crowd prediction to help you save time and avoid long queues.
      </p>
    </div>

    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

      {/* Card 1 */}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">

        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
          🤖
        </div>

        <h3 className="text-2xl font-bold mt-6">
          AI Crowd Prediction
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          Our machine learning model predicts future crowd levels,
          expected waiting time and recommends the best time to visit.
        </p>

      </div>

      {/* Card 2 */}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">

        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
          📍
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Nearby Restaurants
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          Instantly discover restaurants, cafes and fast-food outlets
          around your current location with live map integration.
        </p>

      </div>

      {/* Card 3 */}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">

        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
          ⏳
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Wait Time Estimation
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          View estimated waiting times before leaving home and choose the
          restaurant with the shortest queue.
        </p>

      </div>

      {/* Card 4 */}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">

        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl">
          🧭
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Navigation Support
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          Get one-click Google Maps directions to your selected restaurant
          without searching manually.
        </p>

      </div>

      {/* Card 5 */}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">

        <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl">
          ⭐
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Reviews & Ratings
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          Read genuine customer reviews and share your own dining
          experience with the community.
        </p>

      </div>

      {/* Card 6 */}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300">

        <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-3xl">
          📊
        </div>

        <h3 className="text-2xl font-bold mt-6">
          Smart Analytics
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          Explore crowd trends, restaurant performance and AI-generated
          insights through interactive analytics.
        </p>

      </div>

    </div>

  </div>
</section>

      {/* How It Works */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div>
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl font-bold">
                1
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Detect Location
              </h3>
            </div>

            <div>
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl font-bold">
                2
              </div>

              <h3 className="mt-6 text-xl font-bold">
                AI Predicts Crowd
              </h3>
            </div>

            <div>
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl font-bold">
                3
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Choose Best Restaurant
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-2xl font-bold">
            SmartSeat AI
          </h2>

          <p className="mt-4 text-gray-400">
            Predict crowd levels before you go.
          </p>

        </div>
      </footer>
    </>
  );
}

export default Home;